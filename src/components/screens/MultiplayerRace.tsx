// Multiplayer race screen - typing interface with live opponent progress

import { useEffect, useState, useCallback, useRef } from 'react'
import { useKeyboard } from '@opentui/react'
import { useTheme } from '../shared/ThemeProvider.js'
import { useTypingEngine } from '../../hooks/useTypingEngine.js'
import { TypingArea } from '../ui/TypingArea.js'
import { StatsPanel } from '../ui/StatsPanel.js'
import { Countdown } from '../ui/Countdown.js'
import { ProgressBar } from '../ui/ProgressBar.js'
import type { LobbyPlayer, RaceStats } from '../../types/game.js'

interface MultiplayerRaceProps {
  lobbyId: string
  targetText: string
  players: LobbyPlayer[]
  currentUserId: string
  onComplete: (stats: RaceStats) => void
  onQuit: () => void
  onUpdateProgress: (progress: number, wpm: number, accuracy: number) => void
}

export function MultiplayerRace({
  lobbyId,
  targetText,
  players,
  currentUserId,
  onComplete,
  onQuit,
  onUpdateProgress,
}: MultiplayerRaceProps) {
  const { theme } = useTheme()
  const [showCountdown, setShowCountdown] = useState(true)
  const [hasFinished, setHasFinished] = useState(false)
  const [spectatorMode, setSpectatorMode] = useState(false)
  const progressUpdateRef = useRef<NodeJS.Timeout | null>(null)
  
  const {
    state,
    currentTime,
    handleCharacter,
    handleBackspace,
    getStats
  } = useTypingEngine(targetText, null) // No time limit for multiplayer

  const currentPlayer = players.find(p => p.userId === currentUserId)
  const finishedPlayers = players.filter(p => p.status === 'finished')

  // Update progress to server every 100ms
  useEffect(() => {
    if (state.startTime && !state.isComplete && !hasFinished) {
      progressUpdateRef.current = setInterval(() => {
        const stats = getStats()
        const progress = targetText.length > 0 
          ? (state.userInput.length / targetText.length) * 100 
          : 0
        onUpdateProgress(progress, stats.wpm, stats.accuracy)
      }, 100)

      return () => {
        if (progressUpdateRef.current) {
          clearInterval(progressUpdateRef.current)
        }
      }
    }
  }, [state.startTime, state.isComplete, hasFinished, targetText.length, state.userInput.length])

  // Handle race completion
  useEffect(() => {
    if (state.isComplete && !hasFinished) {
      setHasFinished(true)
      setSpectatorMode(true)
      const stats = getStats()
      onComplete(stats)
    }
  }, [state.isComplete, hasFinished, getStats, onComplete])

  // Keyboard handler
  useKeyboard((key) => {
    if (showCountdown) return
    
    if (key.name === 'escape') {
      onQuit()
      return
    }

    // Disable typing if finished (spectator mode)
    if (hasFinished) return

    if (key.name === 'backspace') {
      handleBackspace()
      return
    }

    if (key.name === 'space') {
      handleCharacter(' ')
      return
    }

    if (key.name.length === 1 && !key.ctrl) {
      const char = key.shift ? key.name.toUpperCase() : key.name
      handleCharacter(char)
    }
  })

  const progress = targetText.length > 0 
    ? (state.userInput.length / targetText.length) * 100 
    : 0

  const stats = getStats()

  if (showCountdown) {
    return (
      <box 
        flexGrow={1}
        backgroundColor={theme.background}
      >
        <Countdown onComplete={() => setShowCountdown(false)} />
      </box>
    )
  }

  return (
    <box 
      flexDirection="row"
      flexGrow={1}
      backgroundColor={theme.background}
    >
      {/* Main typing area */}
      <box 
        flexDirection="column"
        flexGrow={1}
        padding={2}
        gap={1}
      >
        {/* Header */}
        <box flexDirection="row" justifyContent="space-between">
          <text fg={theme.primary}>
            <strong>🏁 Multiplayer Race</strong>
          </text>
          <text fg={theme.dim}>
            {Math.floor(stats.timeTaken)}s
          </text>
        </box>

        {/* Progress bar */}
        <ProgressBar 
          progress={progress} 
          width={50}
          showPercentage
        />

        {/* Typing area */}
        <box flexGrow={1} marginTop={1} marginBottom={1}>
          <TypingArea state={state} height={12} />
        </box>

        {/* Stats */}
        <StatsPanel stats={stats} isLive />

        {/* Help text */}
        <box marginTop={1} flexDirection="row" justifyContent="space-between">
          <text fg={theme.dim}>
            {spectatorMode 
              ? 'You finished! Watching others...' 
              : 'Type the text above • ESC to quit'}
          </text>
          <text fg={theme.dim}>
            {finishedPlayers.length}/{players.length} finished
          </text>
        </box>
      </box>

      {/* Opponent progress panel */}
      <box 
        width={25}
        padding={1}
        border
        borderStyle="single"
        flexDirection="column"
      >
        <text fg={theme.primary} marginBottom={1}>
          <strong>Racers</strong>
        </text>

        {players.map((player) => (
          <box 
            key={player.userId}
            flexDirection="column"
            marginBottom={1}
          >
            <box flexDirection="row" justifyContent="space-between">
              <text 
                fg={player.userId === currentUserId ? theme.accent : theme.foreground}
                width={15}
              >
                {player.name.length > 12 
                  ? player.name.slice(0, 12) + '...' 
                  : player.name}
                {player.userId === currentUserId && ' (You)'}
              </text>
              <text fg={theme.dim}>
                {player.status === 'finished' 
                  ? '✓' 
                  : `${Math.round(player.progress)}%`}
              </text>
            </box>
            
            {/* Mini progress bar */}
            <box flexDirection="row" marginTop={1}>
              <box 
                width={Math.round((player.progress / 100) * 20)}
                height={1}
                backgroundColor={player.status === 'finished' ? theme.success : theme.primary}
              />
              <box 
                width={20 - Math.round((player.progress / 100) * 20)}
                height={1}
                backgroundColor={theme.dim}
              />
            </box>

            {player.status === 'finished' && (
              <text fg={theme.success}>
                {player.wpm} WPM
              </text>
            )}
          </box>
        ))}
      </box>
    </box>
  )
}
