// Lobby management mutations and queries

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

// Create a new lobby
export const createLobby = mutation({
  args: {
    name: v.string(),
    maxPlayers: v.number(),
    isPublic: v.boolean(),
    textCategory: v.string(),
    text: v.string(),
    userId: v.string(),
  },
  returns: v.object({
    lobbyId: v.id('lobbies'),
    joinCode: v.string(),
  }),
  handler: async (ctx, args) => {
    const userId = args.userId
    
    // Generate unique join code
    let joinCode = generateCode()
    let existing = await ctx.db
      .query('lobbies')
      .withIndex('by_code', (q) => q.eq('joinCode', joinCode))
      .first()
    
    // Retry if code exists
    while (existing) {
      joinCode = generateCode()
      existing = await ctx.db
        .query('lobbies')
        .withIndex('by_code', (q) => q.eq('joinCode', joinCode))
        .first()
    }
    
    // Create lobby
    const lobbyId = await ctx.db.insert('lobbies', {
      name: args.name,
      hostId: userId,
      status: 'waiting',
      text: args.text,
      textCategory: args.textCategory,
      maxPlayers: args.maxPlayers,
      isPublic: args.isPublic,
      joinCode,
      createdAt: Date.now(),
    })
    
    // Add host as first player
    await ctx.db.insert('lobbyPlayers', {
      lobbyId,
      userId,
      name: args.name,
      isReady: true, // Host is automatically ready
      progress: 0,
      wpm: 0,
      accuracy: 0,
      status: 'ready',
      joinedAt: Date.now(),
    })
    
    return { lobbyId, joinCode }
  },
})

// Join a lobby by code
export const joinLobbyByCode = mutation({
  args: {
    code: v.string(),
    playerName: v.string(),
    userId: v.string(),
  },
  returns: v.union(
    v.object({
      success: v.literal(true),
      lobbyId: v.id('lobbies'),
    }),
    v.object({
      success: v.literal(false),
      error: v.string(),
    })
  ),
  handler: async (ctx, args) => {
    const userId = args.userId
    
    // Find lobby by code
    const lobby = await ctx.db
      .query('lobbies')
      .withIndex('by_code', (q) => q.eq('joinCode', args.code.toUpperCase()))
      .first()
    
    if (!lobby) {
      return { success: false as const, error: 'Invalid join code' }
    }
    
    if (lobby.status !== 'waiting') {
      return { success: false as const, error: 'Race already started' }
    }
    
    // Check if player already in lobby
    const existingPlayer = await ctx.db
      .query('lobbyPlayers')
      .withIndex('by_user', (q) => q.eq('userId', userId))
      .filter((q) => q.eq(q.field('lobbyId'), lobby._id))
      .first()
    
    if (existingPlayer) {
      return { success: true as const, lobbyId: lobby._id }
    }
    
    // Check lobby capacity
    const playerCount = await ctx.db
      .query('lobbyPlayers')
      .withIndex('by_lobby', (q) => q.eq('lobbyId', lobby._id))
      .collect()
    
    if (playerCount.length >= lobby.maxPlayers) {
      return { success: false as const, error: 'Lobby is full' }
    }
    
    // Add player to lobby - automatically ready
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
    
    return { success: true as const, lobbyId: lobby._id }
  },
})

// Join a public lobby by ID
export const joinPublicLobby = mutation({
  args: {
    lobbyId: v.id('lobbies'),
    playerName: v.string(),
    userId: v.string(),
  },
  returns: v.union(
    v.object({
      success: v.literal(true),
      lobbyId: v.id('lobbies'),
    }),
    v.object({
      success: v.literal(false),
      error: v.string(),
    })
  ),
  handler: async (ctx, args) => {
    const userId = args.userId
    
    const lobby = await ctx.db.get(args.lobbyId)
    
    if (!lobby) {
      return { success: false as const, error: 'Lobby not found' }
    }
    
    if (lobby.status !== 'waiting') {
      return { success: false as const, error: 'Race already started' }
    }
    
    if (!lobby.isPublic) {
      return { success: false as const, error: 'Lobby is private' }
    }
    
    // Check if player already in lobby
    const existingPlayer = await ctx.db
      .query('lobbyPlayers')
      .withIndex('by_user', (q) => q.eq('userId', userId))
      .filter((q) => q.eq(q.field('lobbyId'), lobby._id))
      .first()
    
    if (existingPlayer) {
      return { success: true as const, lobbyId: lobby._id }
    }
    
    // Check lobby capacity
    const playerCount = await ctx.db
      .query('lobbyPlayers')
      .withIndex('by_lobby', (q) => q.eq('lobbyId', lobby._id))
      .collect()
    
    if (playerCount.length >= lobby.maxPlayers) {
      return { success: false as const, error: 'Lobby is full' }
    }
    
    // Add player to lobby - automatically ready
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

    return { success: true as const, lobbyId: lobby._id }
  },
})

// Leave a lobby
export const leaveLobby = mutation({
  args: {
    lobbyId: v.id('lobbies'),
    userId: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const userId = args.userId
    
    const player = await ctx.db
      .query('lobbyPlayers')
      .withIndex('by_user', (q) => q.eq('userId', userId))
      .filter((q) => q.eq(q.field('lobbyId'), args.lobbyId))
      .first()
    
    if (player) {
      await ctx.db.delete(player._id)
    }
    
    // Check if lobby is now empty
    const remainingPlayers = await ctx.db
      .query('lobbyPlayers')
      .withIndex('by_lobby', (q) => q.eq('lobbyId', args.lobbyId))
      .collect()
    
    if (remainingPlayers.length === 0) {
      // Delete empty lobby
      await ctx.db.delete(args.lobbyId)
    } else {
      // Check if host left, transfer host
      const lobby = await ctx.db.get(args.lobbyId)
      if (lobby && lobby.hostId === userId) {
        const newHost = remainingPlayers[0]
        if (newHost) {
          await ctx.db.patch(args.lobbyId, { hostId: newHost.userId })
          // Make new host ready automatically
          await ctx.db.patch(newHost._id, { isReady: true, status: 'ready' })
        }
      }
    }
    
    return null
  },
})

// Toggle ready status
export const toggleReady = mutation({
  args: {
    lobbyId: v.id('lobbies'),
    isReady: v.boolean(),
    userId: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const userId = args.userId
    
    const player = await ctx.db
      .query('lobbyPlayers')
      .withIndex('by_user', (q) => q.eq('userId', userId))
      .filter((q) => q.eq(q.field('lobbyId'), args.lobbyId))
      .first()
    
    if (player) {
      await ctx.db.patch(player._id, {
        isReady: args.isReady,
        status: args.isReady ? 'ready' : 'waiting',
      })
    }
    
    return null
  },
})

// Start race (host only)
export const startRace = mutation({
  args: {
    lobbyId: v.id('lobbies'),
    userId: v.string(),
  },
  returns: v.union(
    v.object({
      success: v.literal(true),
    }),
    v.object({
      success: v.literal(false),
      error: v.string(),
    })
  ),
  handler: async (ctx, args) => {
    const userId = args.userId
    
    const lobby = await ctx.db.get(args.lobbyId)
    
    if (!lobby) {
      return { success: false as const, error: 'Lobby not found' }
    }
    
    if (lobby.hostId !== userId) {
      return { success: false as const, error: 'Only host can start race' }
    }
    
    // Get all players
    const players = await ctx.db
      .query('lobbyPlayers')
      .withIndex('by_lobby', (q) => q.eq('lobbyId', args.lobbyId))
      .collect()
    
    if (players.length < 2) {
      return { success: false as const, error: 'Need at least 2 players' }
    }
    
    // Update lobby status
    await ctx.db.patch(args.lobbyId, {
      status: 'racing',
      countdownStartedAt: Date.now(),
    })
    
    // Update all players to racing status
    for (const player of players) {
      await ctx.db.patch(player._id, {
        status: 'racing',
        progress: 0,
        wpm: 0,
        accuracy: 0,
      })
    }
    
    return { success: true as const }
  },
})

// Update player progress during race
export const updateProgress = mutation({
  args: {
    lobbyId: v.id('lobbies'),
    progress: v.number(),
    wpm: v.number(),
    accuracy: v.number(),
    userId: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const userId = args.userId
    
    const player = await ctx.db
      .query('lobbyPlayers')
      .withIndex('by_user', (q) => q.eq('userId', userId))
      .filter((q) => q.eq(q.field('lobbyId'), args.lobbyId))
      .first()
    
    if (player && player.status === 'racing') {
      await ctx.db.patch(player._id, {
        progress: Math.min(100, Math.max(0, args.progress)),
        wpm: args.wpm,
        accuracy: args.accuracy,
      })
    }
    
    return null
  },
})

// Finish race for a player
export const finishRace = mutation({
  args: {
    lobbyId: v.id('lobbies'),
    wpm: v.number(),
    accuracy: v.number(),
    timeTaken: v.number(),
    errorCount: v.number(),
    totalCharacters: v.number(),
    consistency: v.number(),
    userId: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const userId = args.userId
    
    const player = await ctx.db
      .query('lobbyPlayers')
      .withIndex('by_user', (q) => q.eq('userId', userId))
      .filter((q) => q.eq(q.field('lobbyId'), args.lobbyId))
      .first()
    
    if (player) {
      await ctx.db.patch(player._id, {
        status: 'finished',
        progress: 100,
        wpm: args.wpm,
        accuracy: args.accuracy,
        finishedAt: Date.now(),
      })
      
      // Save race result
      const lobby = await ctx.db.get(args.lobbyId)
      if (lobby) {
        await ctx.db.insert('raceResults', {
          lobbyId: args.lobbyId,
          userId,
          userName: player.name,
          wpm: args.wpm,
          accuracy: args.accuracy,
          timeTaken: args.timeTaken,
          errorCount: args.errorCount,
          totalCharacters: args.totalCharacters,
          consistency: args.consistency,
          textCategory: lobby.textCategory,
          finishedAt: Date.now(),
        })
      }
    }
    
    return null
  },
})

// Get lobby with players
export const getLobby = query({
  args: {
    lobbyId: v.id('lobbies'),
    userId: v.string(),
  },
  returns: v.union(
    v.object({
      lobby: v.any(),
      players: v.array(v.any()),
      isHost: v.boolean(),
      currentUserId: v.string(),
    }),
    v.null()
  ),
  handler: async (ctx, args) => {
    const userId = args.userId
    
    const lobby = await ctx.db.get(args.lobbyId)
    if (!lobby) return null
    
    const players = await ctx.db
      .query('lobbyPlayers')
      .withIndex('by_lobby', (q) => q.eq('lobbyId', args.lobbyId))
      .order('asc')
      .collect()
    
    return {
      lobby,
      players,
      isHost: lobby.hostId === userId,
      currentUserId: userId,
    }
  },
})

// Get public lobbies
export const getPublicLobbies = query({
  args: {},
  returns: v.array(v.any()),
  handler: async (ctx) => {
    const lobbies = await ctx.db
      .query('lobbies')
      .withIndex('by_status_public', (q) => 
        q.eq('status', 'waiting').eq('isPublic', true)
      )
      .order('desc')
      .take(20)
    
    // Get player counts
    const lobbiesWithCounts = await Promise.all(
      lobbies.map(async (lobby) => {
        const players = await ctx.db
          .query('lobbyPlayers')
          .withIndex('by_lobby', (q) => q.eq('lobbyId', lobby._id))
          .collect()
        
        return {
          ...lobby,
          playerCount: players.length,
        }
      })
    )
    
    return lobbiesWithCounts
  },
})

// End race and mark lobby as finished
export const endRace = mutation({
  args: {
    lobbyId: v.id('lobbies'),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.patch(args.lobbyId, { status: 'finished' })
    return null
  },
})
