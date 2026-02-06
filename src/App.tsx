// Main App component with Convex integration

import { useState, useCallback, useEffect, useRef } from 'react'
import { useKeyboard, useRenderer } from '@opentui/react'
import { ThemeProvider } from './components/shared/ThemeProvider.js'
import { Splash } from './components/screens/Splash.js'
import { MainMenu } from './components/screens/MainMenu.js'
import { SoloPractice } from './components/screens/SoloPractice.js'
import { Race } from './components/screens/Race.js'
import { Results } from './components/screens/Results.js'
import { Settings } from './components/screens/Settings.js'
import { MultiplayerMenu } from './components/screens/MultiplayerMenu.js'
import { JoinLobby } from './components/screens/JoinLobby.js'
import { Lobby } from './components/screens/Lobby.js'
import { MultiplayerRace } from './components/screens/MultiplayerRace.js'
import { MultiplayerResults } from './components/screens/MultiplayerResults.js'
import { useConvexMultiplayer } from './hooks/useConvexMultiplayer.js'
import type { ScreenState, RaceConfig, RaceStats, LobbyPlayer, MultiplayerRaceConfig } from './types/game.js'

function AppContent() {
  const renderer = useRenderer()
  const [screen, setScreen] = useState<ScreenState>('splash')
  const [raceConfig, setRaceConfig] = useState<RaceConfig | null>(null)
  const [raceStats, setRaceStats] = useState<RaceStats | null>(null)
  
  // Multiplayer state
  const [mpConfig, setMpConfig] = useState<MultiplayerRaceConfig | null>(null)
  const [lobbyId, setLobbyId] = useState<string | null>(null)
  const [joinCode, setJoinCode] = useState<string>('')
  const [lobbyPlayers, setLobbyPlayers] = useState<LobbyPlayer[]>([])
  const [isHost, setIsHost] = useState(false)
  const [currentUserId, setCurrentUserId] = useState<string>('')
  const [mpError, setMpError] = useState<string>('')
  const [lobbyData, setLobbyData] = useState<any>(null)
  
  // Subscription ref for lobby updates
  const lobbyUnsubscribeRef = useRef<(() => void) | null>(null)
  const racePollRef = useRef<NodeJS.Timeout | null>(null)
  
  // Convex multiplayer hook
  const convex = useConvexMultiplayer()

  const handleExit = useCallback(() => {
    renderer.destroy()
  }, [renderer])

  const handleStartRace = useCallback((config: RaceConfig) => {
    setRaceConfig(config)
    setScreen('race')
  }, [])

  const handleRaceComplete = useCallback((stats: RaceStats) => {
    setRaceStats(stats)
    setScreen('results')
  }, [])

  const handlePlayAgain = useCallback(() => {
    if (raceConfig) {
      setScreen('race')
    } else {
      setScreen('solo-config')
    }
  }, [raceConfig])

  const handleMainMenu = useCallback(() => {
    setRaceConfig(null)
    setRaceStats(null)
    setMpConfig(null)
    setLobbyId(null)
    setLobbyPlayers([])
    setScreen('menu')
  }, [])

  // Start lobby subscription for real-time updates
  const startLobbySubscription = useCallback((id: string) => {
    // Stop any existing subscription
    if (lobbyUnsubscribeRef.current) {
      lobbyUnsubscribeRef.current()
      lobbyUnsubscribeRef.current = null
    }
    
    // Start new subscription
    const unsubscribe = convex.watchLobby(id, (data: any) => {
      if (data) {
        setLobbyData(data)
        setIsHost(data.isHost)
        
        // Get current user's ID from the data
        if (data.currentUserId) {
          setCurrentUserId(data.currentUserId)
        }
        
        // Transform players to LobbyPlayer format
        const players: LobbyPlayer[] = data.players.map((p: any) => ({
          userId: p.userId,
          name: p.name,
          isReady: p.isReady,
          progress: p.progress,
          wpm: p.wpm,
          accuracy: p.accuracy,
          status: p.status,
          isHost: p.userId === data.lobby.hostId,
        }))
        setLobbyPlayers(players)
        setJoinCode(data.lobby.joinCode || '')
        
        // Check if race has started - use functional update to get current screen
        if (data.lobby.status === 'racing') {
          setScreen(currentScreen => {
            if (currentScreen === 'lobby') {
              // Transition to race screen
              setMpConfig({
                lobbyId: id,
                text: data.lobby.text,
                textCategory: data.lobby.textCategory,
                isHost: data.isHost,
              })
              return 'multiplayer-race'
            }
            return currentScreen
          })
        }
      }
    }, (err: any) => {
      console.error('Lobby subscription error:', err)
    })
    
    lobbyUnsubscribeRef.current = unsubscribe
  }, [convex])

  // Stop lobby subscription
  const stopLobbySubscription = useCallback(() => {
    if (lobbyUnsubscribeRef.current) {
      lobbyUnsubscribeRef.current()
      lobbyUnsubscribeRef.current = null
    }
  }, [])

  // Multiplayer handlers
  const handleQuickPlay = useCallback(async () => {
    const result = await convex.quickPlay('Player', 'quotes')
    if (result.success && result.lobbyId) {
      setLobbyId(result.lobbyId)
      setJoinCode(result.joinCode || '')
      startLobbySubscription(result.lobbyId)
      setScreen('lobby')
    } else {
      setMpError(result.error || 'Failed to join')
    }
  }, [convex, startLobbySubscription])

  const handleCreateLobby = useCallback(async () => {
    console.log('handleCreateLobby called')
    try {
      const result = await convex.createLobby('Player', 8, true, 'quotes')
      console.log('createLobby result:', result)
      if (result.success && result.lobbyId) {
        setLobbyId(result.lobbyId)
        setJoinCode(result.joinCode)
        setIsHost(true)
        startLobbySubscription(result.lobbyId)
        setScreen('lobby')
      } else {
        setMpError(result.error || 'Failed to create lobby')
      }
    } catch (err) {
      setMpError('Error creating lobby: ' + String(err))
    }
  }, [convex, startLobbySubscription])

  const handleJoinByCode = useCallback(async (code: string, playerName: string) => {
    const result = await convex.joinLobbyByCode(code, playerName)
    if (result.success && result.lobbyId) {
      setLobbyId(result.lobbyId)
      setIsHost(false)
      startLobbySubscription(result.lobbyId)
      setMpError('')
      setScreen('lobby')
    } else {
      setMpError(result.error || 'Failed to join')
    }
  }, [convex, startLobbySubscription])

  const handleToggleReady = useCallback(async () => {
    if (!lobbyId || !currentUserId) return
    
    const currentPlayer = lobbyPlayers.find(p => p.userId === currentUserId)
    const isReady = currentPlayer?.isReady || false
    
    await convex.toggleReady(lobbyId, !isReady)
    
    // Optimistically update local state
    setLobbyPlayers(prev => prev.map(p => 
      p.userId === currentUserId
        ? { ...p, isReady: !isReady, status: !isReady ? 'ready' : 'waiting' }
        : p
    ))
  }, [lobbyId, lobbyPlayers, currentUserId, convex])

  const handleStartMultiplayerRace = useCallback(async () => {
    if (!lobbyId) return
    
    const result = await convex.startRace(lobbyId)
    if (result.success) {
      // Polling will catch the status change and transition to race screen
    } else {
      setMpError(result.error || 'Failed to start race')
    }
  }, [lobbyId, convex])

  const handleLeaveLobby = useCallback(async () => {
    if (lobbyId) {
      stopLobbySubscription()
      await convex.leaveLobby(lobbyId)
    }
    setLobbyId(null)
    setLobbyPlayers([])
    setLobbyData(null)
    setCurrentUserId('')
    setScreen('multiplayer-menu')
  }, [lobbyId, convex, stopLobbySubscription])

  const handleMultiplayerRaceComplete = useCallback(async (stats: RaceStats) => {
    if (!lobbyId) return
    
    await convex.finishRace(lobbyId, {
      wpm: stats.wpm,
      accuracy: stats.accuracy,
      timeTaken: stats.timeTaken,
      errorCount: stats.errorCount,
      totalCharacters: stats.totalCharacters,
      consistency: stats.consistency,
    })
    
    setRaceStats(stats)
    setScreen('multiplayer-results')
    
    // Stop lobby polling, start results polling
    stopLobbySubscription()
  }, [lobbyId, convex, stopLobbySubscription])

  const handleUpdateProgress = useCallback(async (progress: number, wpm: number, accuracy: number) => {
    if (!lobbyId) return
    
    await convex.updateProgress(lobbyId, progress, wpm, accuracy)
  }, [lobbyId, convex])

  const handleRaceAgain = useCallback(() => {
    if (lobbyId) {
      // Return to lobby for another race
      startLobbySubscription(lobbyId)
      setScreen('lobby')
    } else {
      setScreen('multiplayer-menu')
    }
  }, [lobbyId, startLobbySubscription])

  const handleNewRace = useCallback(() => {
    if (lobbyId) {
      convex.leaveLobby(lobbyId)
    }
    stopLobbySubscription()
    setLobbyId(null)
    setLobbyPlayers([])
    setLobbyData(null)
    setCurrentUserId('')
    setScreen('multiplayer-menu')
  }, [lobbyId, convex, stopLobbySubscription])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopLobbySubscription()
      if (racePollRef.current) {
        clearInterval(racePollRef.current)
      }
    }
  }, [stopLobbySubscription])

  // Global keyboard shortcuts
  useKeyboard((key) => {
    // Always allow Ctrl+C to exit
    if (key.ctrl && key.name === 'c') {
      handleExit()
      return
    }

    // Don't handle other keys if in lobby (handled by Lobby component)
    if (screen === 'lobby') {
      return
    }

    // Handle results screen shortcuts
    if (screen === 'results' && raceStats) {
      if (key.name === 'r') {
        handlePlayAgain()
      } else if (key.name === 'm') {
        handleMainMenu()
      }
    }
    
    // Handle splash screen - any key continues
    if (screen === 'splash') {
      setScreen('menu')
    }
  })

  // Render current screen
  const renderScreen = () => {
    switch (screen) {
      case 'splash':
        return <Splash onComplete={() => setScreen('menu')} />

      case 'menu':
        return (
          <MainMenu
            onNavigate={setScreen}
            onExit={handleExit}
          />
        )

      case 'solo-config':
        return (
          <SoloPractice
            onStart={handleStartRace}
            onBack={() => setScreen('menu')}
          />
        )

      case 'race':
        if (!raceConfig) {
          setScreen('solo-config')
          return null
        }
        return (
          <Race
            config={raceConfig}
            onComplete={handleRaceComplete}
            onQuit={() => {
              setRaceConfig(null)
              setScreen('menu')
            }}
          />
        )

      case 'results':
        if (!raceStats) {
          setScreen('menu')
          return null
        }
        return (
          <Results
            stats={raceStats}
            onPlayAgain={handlePlayAgain}
            onMainMenu={handleMainMenu}
          />
        )

      case 'settings':
        return (
          <Settings
            onBack={() => setScreen('menu')}
          />
        )

      case 'multiplayer-menu':
        return (
          <MultiplayerMenu
            onNavigate={setScreen}
            onBack={() => setScreen('menu')}
            onQuickPlay={handleQuickPlay}
            onCreateLobby={handleCreateLobby}
            onJoinLobby={() => setScreen('join-lobby')}
          />
        )

      case 'join-lobby':
        return (
          <JoinLobby
            onJoinByCode={handleJoinByCode}
            onBack={() => setScreen('multiplayer-menu')}
            error={mpError}
          />
        )

      case 'lobby':
        if (!lobbyId) {
          setScreen('multiplayer-menu')
          return null
        }
        return (
          <Lobby
            lobbyName="Multiplayer Race"
            joinCode={joinCode}
            players={lobbyPlayers}
            isHost={isHost}
            maxPlayers={8}
            onToggleReady={handleToggleReady}
            onStartRace={handleStartMultiplayerRace}
            onLeave={handleLeaveLobby}
          />
        )

      case 'multiplayer-race':
        if (!mpConfig) {
          setScreen('lobby')
          return null
        }
        return (
          <MultiplayerRace
            lobbyId={mpConfig.lobbyId}
            targetText={mpConfig.text}
            players={lobbyPlayers}
            currentUserId={currentUserId || 'you'}
            onComplete={handleMultiplayerRaceComplete}
            onQuit={handleLeaveLobby}
            onUpdateProgress={handleUpdateProgress}
          />
        )

      case 'multiplayer-results':
        // Generate results from lobby players
        const sortedPlayers = [...lobbyPlayers].sort((a, b) => b.wpm - a.wpm)
        const results = sortedPlayers.map((p, i) => ({
          userId: p.userId,
          name: p.name,
          wpm: p.wpm || raceStats?.wpm || 0,
          accuracy: p.accuracy || raceStats?.accuracy || 95,
          timeTaken: raceStats?.timeTaken || 30,
          rank: i + 1,
        }))
        return (
          <MultiplayerResults
            results={results}
            yourUserId={currentUserId || 'you'}
            onRaceAgain={handleRaceAgain}
            onNewRace={handleNewRace}
            onMainMenu={handleMainMenu}
          />
        )

      default:
        return <Splash onComplete={() => setScreen('menu')} />
    }
  }

  return (
    <box 
      flexDirection="column"
      width="100%"
      height="100%"
    >
      {renderScreen()}
    </box>
  )
}

export function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  )
}
