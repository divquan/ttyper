// Race state and results queries

import { v } from 'convex/values'
import { query } from './_generated/server'

// Get current race state with all player progress
export const getRaceState = query({
  args: {
    lobbyId: v.id('lobbies'),
    userId: v.string(),
  },
  returns: v.union(
    v.object({
      lobby: v.any(),
      players: v.array(v.any()),
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
      currentUserId: userId,
    }
  },
})

// Get race results
export const getResults = query({
  args: {
    lobbyId: v.id('lobbies'),
  },
  returns: v.union(
    v.object({
      lobby: v.any(),
      players: v.array(v.any()),
      results: v.array(v.any()),
    }),
    v.null()
  ),
  handler: async (ctx, args) => {
    const lobby = await ctx.db.get(args.lobbyId)
    if (!lobby) return null
    
    const players = await ctx.db
      .query('lobbyPlayers')
      .withIndex('by_lobby', (q) => q.eq('lobbyId', args.lobbyId))
      .order('asc')
      .collect()
    
    // Get race results for this lobby
    const results = await ctx.db
      .query('raceResults')
      .filter((q) => q.eq(q.field('lobbyId'), args.lobbyId))
      .order('asc')
      .collect()
    
    return {
      lobby,
      players,
      results,
    }
  },
})

// Check if race should end (all players finished)
export const shouldEndRace = query({
  args: {
    lobbyId: v.id('lobbies'),
  },
  returns: v.boolean(),
  handler: async (ctx, args) => {
    const lobby = await ctx.db.get(args.lobbyId)
    if (!lobby || lobby.status !== 'racing') return false
    
    const players = await ctx.db
      .query('lobbyPlayers')
      .withIndex('by_lobby', (q) => q.eq('lobbyId', args.lobbyId))
      .collect()
    
    // Race should end if all players have finished
    return players.every((p) => p.status === 'finished')
  },
})
