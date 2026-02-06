// Convex schema for TTyper

import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export default defineSchema({
  // Lobby management for multiplayer (Phase 2)
  lobbies: defineTable({
    name: v.string(),
    hostId: v.string(),
    status: v.union(v.literal('waiting'), v.literal('racing'), v.literal('finished')),
    text: v.string(),
    textCategory: v.string(),
    maxPlayers: v.number(),
    isPublic: v.boolean(),
    joinCode: v.optional(v.string()),
    countdownStartedAt: v.optional(v.number()),
    createdAt: v.number()
  })
  .index('by_host', ['hostId'])
  .index('by_status', ['status'])
  .index('by_code', ['joinCode'])
  .index('by_status_public', ['status', 'isPublic']),

  // Player participation in lobbies
  lobbyPlayers: defineTable({
    lobbyId: v.id('lobbies'),
    userId: v.string(),
    name: v.string(),
    isReady: v.boolean(),
    progress: v.number(), // 0-100
    wpm: v.number(),
    accuracy: v.number(),
    status: v.union(v.literal('waiting'), v.literal('ready'), v.literal('racing'), v.literal('finished')),
    finishedAt: v.optional(v.number()),
    joinedAt: v.number()
  })
  .index('by_lobby', ['lobbyId'])
  .index('by_user', ['userId']),

  // Race results storage
  raceResults: defineTable({
    lobbyId: v.optional(v.id('lobbies')),
    userId: v.string(),
    userName: v.string(),
    wpm: v.number(),
    accuracy: v.number(),
    timeTaken: v.number(),
    errorCount: v.number(),
    totalCharacters: v.number(),
    consistency: v.number(),
    textCategory: v.string(),
    finishedAt: v.number()
  })
  .index('by_user', ['userId'])
  .index('by_finished', ['finishedAt']),
})
