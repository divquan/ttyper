// Convex client hook for TTyper

import { useState, useEffect, useCallback, useRef } from 'react'
import { ConvexClient } from 'convex/browser'
import { api } from '../../convex/_generated/api.js'
import type { Id } from '../../convex/_generated/dataModel.js'

const CONVEX_URL = process.env.CONVEX_URL || 'http://127.0.0.1:3210'

// Generate a persistent user ID for this session
function generateUserId(): string {
  return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

export function useConvexMultiplayer() {
  const [client, setClient] = useState<ConvexClient | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState<string>('')
  const userIdRef = useRef<string>(generateUserId())

  // Initialize Convex client
  useEffect(() => {
    try {
      const convexClient = new ConvexClient(CONVEX_URL)
      setClient(convexClient)
      setIsConnected(true)
      
      return () => {
        convexClient.close()
      }
    } catch (err) {
      setError('Failed to connect to Convex')
      setIsConnected(false)
    }
  }, [])

  // Helper to convert string to Convex ID
  const toLobbyId = (id: string): Id<'lobbies'> => id as Id<'lobbies'>

  // Get current user ID
  const getUserId = useCallback(() => userIdRef.current, [])

  // Quick play - find or create lobby
  const quickPlay = useCallback(async (playerName: string, textCategory: string = 'quotes') => {
    if (!client) return { success: false, error: 'Not connected' }
    
    try {
      const result = await client.mutation(api.matchmaking.quickPlay, {
        playerName,
        textCategory,
        userId: userIdRef.current,
      })
      
      if (result.success) {
        return {
          success: true,
          lobbyId: result.lobbyId as string,
          joinCode: result.joinCode || '',
        }
      } else {
        return { success: false, error: 'Failed to join' }
      }
    } catch (err) {
      return { success: false, error: 'Network error' }
    }
  }, [client])

  // Create a new lobby
  const createLobby = useCallback(async (name: string, maxPlayers: number = 8, isPublic: boolean = true, textCategory: string = 'quotes') => {
    if (!client) return { success: false, error: 'Not connected' }
    
    try {
      // Generate text using the text generator
      const { generateText } = await import('../utils/textGenerators.js')
      const text = generateText(textCategory)
      
      const result = await client.mutation(api.lobbies.createLobby, {
        name,
        maxPlayers,
        isPublic,
        textCategory,
        text,
        userId: userIdRef.current,
      })
      
      return {
        success: true,
        lobbyId: result.lobbyId as string,
        joinCode: result.joinCode,
      }
    } catch (err) {
      return { success: false, error: 'Failed to create lobby' }
    }
  }, [client])

  // Join lobby by code
  const joinLobbyByCode = useCallback(async (code: string, playerName: string) => {
    if (!client) return { success: false, error: 'Not connected' }
    
    try {
      const result = await client.mutation(api.lobbies.joinLobbyByCode, {
        code: code.toUpperCase(),
        playerName,
        userId: userIdRef.current,
      })
      
      if (result.success) {
        return { success: true, lobbyId: result.lobbyId as string }
      } else {
        return { success: false, error: result.error }
      }
    } catch (err) {
      return { success: false, error: 'Network error' }
    }
  }, [client])

  // Get lobby state (for polling)
  const getLobby = useCallback(async (lobbyId: string) => {
    if (!client) return null
    
    try {
      const result = await client.query(api.lobbies.getLobby, { 
        lobbyId: toLobbyId(lobbyId),
        userId: userIdRef.current,
      })
      return result
    } catch (err) {
      return null
    }
  }, [client])

  // Toggle ready status
  const toggleReady = useCallback(async (lobbyId: string, isReady: boolean) => {
    if (!client) return
    
    try {
      await client.mutation(api.lobbies.toggleReady, { 
        lobbyId: toLobbyId(lobbyId), 
        isReady,
        userId: userIdRef.current,
      })
    } catch (err) {
      console.error('Failed to toggle ready:', err)
    }
  }, [client])

  // Leave lobby
  const leaveLobby = useCallback(async (lobbyId: string) => {
    if (!client) return
    
    try {
      await client.mutation(api.lobbies.leaveLobby, { 
        lobbyId: toLobbyId(lobbyId),
        userId: userIdRef.current,
      })
    } catch (err) {
      console.error('Failed to leave lobby:', err)
    }
  }, [client])

  // Start race (host only)
  const startRace = useCallback(async (lobbyId: string) => {
    if (!client) return { success: false, error: 'Not connected' }
    
    try {
      const result = await client.mutation(api.lobbies.startRace, { 
        lobbyId: toLobbyId(lobbyId),
        userId: userIdRef.current,
      })
      return result
    } catch (err) {
      return { success: false, error: 'Failed to start race' }
    }
  }, [client])

  // Update progress during race
  const updateProgress = useCallback(async (lobbyId: string, progress: number, wpm: number, accuracy: number) => {
    if (!client) return
    
    try {
      await client.mutation(api.lobbies.updateProgress, {
        lobbyId: toLobbyId(lobbyId),
        userId: userIdRef.current,
        progress,
        wpm,
        accuracy,
      })
    } catch (err) {
      console.error('Failed to update progress:', err)
    }
  }, [client])

  // Finish race
  const finishRace = useCallback(async (
    lobbyId: string,
    stats: {
      wpm: number
      accuracy: number
      timeTaken: number
      errorCount: number
      totalCharacters: number
      consistency: number
    }
  ) => {
    if (!client) return
    
    try {
      await client.mutation(api.lobbies.finishRace, {
        lobbyId: toLobbyId(lobbyId),
        userId: userIdRef.current,
        ...stats,
      })
    } catch (err) {
      console.error('Failed to finish race:', err)
    }
  }, [client])

  // Get race state
  const getRaceState = useCallback(async (lobbyId: string) => {
    if (!client) return null
    
    try {
      const result = await client.query(api.race.getRaceState, { 
        lobbyId: toLobbyId(lobbyId),
        userId: userIdRef.current,
      })
      return result
    } catch (err) {
      return null
    }
  }, [client])

  // Get race results
  const getRaceResults = useCallback(async (lobbyId: string) => {
    if (!client) return null
    
    try {
      const result = await client.query(api.race.getResults, { lobbyId: toLobbyId(lobbyId) })
      return result
    } catch (err) {
      return null
    }
  }, [client])

  return {
    isConnected,
    error,
    getUserId,
    quickPlay,
    createLobby,
    joinLobbyByCode,
    getLobby,
    toggleReady,
    leaveLobby,
    startRace,
    updateProgress,
    finishRace,
    getRaceState,
    getRaceResults,
  }
}
