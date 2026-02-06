// Quick play matchmaking

import { v } from 'convex/values'
import { query, mutation } from './_generated/server'

// Generate a 4-character alphanumeric join code
function generateCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let code = ''
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

// Generate sample text (simple version to avoid import issues)
function generateSampleText(): string {
  return 'The quick brown fox jumps over the lazy dog. This is a sample text for multiplayer racing. Type as fast and accurately as you can.'
}

// Quick play - find or create a lobby
export const quickPlay = mutation({
  args: {
    playerName: v.string(),
    textCategory: v.string(),
    userId: v.string(),
  },
  returns: v.object({
    success: v.boolean(),
    lobbyId: v.optional(v.id('lobbies')),
    joinCode: v.optional(v.string()),
    error: v.optional(v.string()),
  }),
  handler: async (ctx, args) => {
    const userId = args.userId
    
    // Look for an available public lobby that's waiting
    const availableLobbies = await ctx.db
      .query('lobbies')
      .withIndex('by_status_public', (q) => 
        q.eq('status', 'waiting').eq('isPublic', true)
      )
      .order('desc')
      .take(10)
    
    // Find one with space
    for (const lobby of availableLobbies) {
      const playerCount = await ctx.db
        .query('lobbyPlayers')
        .withIndex('by_lobby', (q) => q.eq('lobbyId', lobby._id))
        .collect()
      
      if (playerCount.length < lobby.maxPlayers) {
        // Check if player already in this lobby
        const existingPlayer = await ctx.db
          .query('lobbyPlayers')
          .withIndex('by_user', (q) => q.eq('userId', userId))
          .filter((q) => q.eq(q.field('lobbyId'), lobby._id))
          .first()
        
        if (!existingPlayer) {
          // Join this lobby - automatically ready
          await ctx.db.insert('lobbyPlayers', {
            lobbyId: lobby._id,
            userId,
            name: args.playerName,
            isReady: true,
            progress: 0,
            wpm: 0,
            accuracy: 0,
            status: 'ready',
            joinedAt: Date.now(),
          })
        }
        
        return {
          success: true,
          lobbyId: lobby._id,
          joinCode: lobby.joinCode,
        }
      }
    }
    
    // No available lobby, create one
    let joinCode = generateCode()
    
    // Check if code exists
    let existing = await ctx.db
      .query('lobbies')
      .withIndex('by_code', (q) => q.eq('joinCode', joinCode))
      .first()
    
    while (existing) {
      joinCode = generateCode()
      existing = await ctx.db
        .query('lobbies')
        .withIndex('by_code', (q) => q.eq('joinCode', joinCode))
        .first()
    }
    
    // Generate text for the race
    const text = generateSampleText()
    
    // Create new public lobby
    const lobbyId = await ctx.db.insert('lobbies', {
      name: `${args.playerName}'s Race`,
      hostId: userId,
      status: 'waiting',
      text,
      textCategory: args.textCategory,
      maxPlayers: 8,
      isPublic: true,
      joinCode,
      createdAt: Date.now(),
    })
    
    // Add creator as first player
    await ctx.db.insert('lobbyPlayers', {
      lobbyId,
      userId,
      name: args.playerName,
      isReady: true,
      progress: 0,
      wpm: 0,
      accuracy: 0,
      status: 'ready',
      joinedAt: Date.now(),
    })
    
    return {
      success: true,
      lobbyId,
      joinCode,
    }
  },
})

// Get matchmaking status (for polling)
export const getMatchmakingStatus = query({
  args: {
    lobbyId: v.id('lobbies'),
  },
  returns: v.union(
    v.object({
      lobby: v.any(),
      playerCount: v.number(),
      maxPlayers: v.number(),
    }),
    v.null()
  ),
  handler: async (ctx, args) => {
    const lobby = await ctx.db.get(args.lobbyId)
    if (!lobby) return null
    
    const players = await ctx.db
      .query('lobbyPlayers')
      .withIndex('by_lobby', (q) => q.eq('lobbyId', args.lobbyId))
      .collect()
    
    return {
      lobby,
      playerCount: players.length,
      maxPlayers: lobby.maxPlayers,
    }
  },
})
