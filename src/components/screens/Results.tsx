// Results screen - post race statistics

import { useTheme } from '../shared/ThemeProvider.js'
import type { RaceStats } from '../../types/game.js'

interface ResultsProps {
  stats: RaceStats
  onPlayAgain: () => void
  onMainMenu: () => void
}

export function Results({ stats, onPlayAgain, onMainMenu }: ResultsProps) {
  const { theme } = useTheme()

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    const ms = Math.floor((seconds % 1) * 100)
    return `${mins}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`
  }

  const getRating = (wpm: number): string => {
    if (wpm >= 100) return 'Lightning Fast! ⚡'
    if (wpm >= 80) return 'Excellent! 🌟'
    if (wpm >= 60) return 'Great job! 🎉'
    if (wpm >= 40) return 'Good work! 👍'
    return 'Keep practicing! 💪'
  }

  return (
    <box 
      flexDirection="column" 
      alignItems="center" 
      justifyContent="center"
      flexGrow={1}
      backgroundColor={theme.background}
      gap={2}
    >
      {/* Header */}
      <text fg={theme.success}>
        <strong>🏆 Race Complete! 🏆</strong>
      </text>

      {/* Rating */}
      <text fg={theme.accent}>
        {getRating(stats.wpm)}
      </text>

      {/* Stats Grid */}
      <box 
        border 
        borderStyle="rounded"
        padding={2}
        width={50}
        flexDirection="column"
        gap={1}
      >
        <box flexDirection="row" justifyContent="space-between">
          <text fg={theme.dim}>WPM</text>
          <text fg={theme.primary}>
            <strong>{stats.wpm}</strong>
          </text>
        </box>

        <box flexDirection="row" justifyContent="space-between">
          <text fg={theme.dim}>Accuracy</text>
          <text fg={stats.accuracy >= 95 ? theme.success : theme.warning}>
            <strong>{stats.accuracy}%</strong>
          </text>
        </box>

        <box flexDirection="row" justifyContent="space-between">
          <text fg={theme.dim}>Time</text>
          <text fg={theme.foreground}>
            <strong>{formatTime(stats.timeTaken)}</strong>
          </text>
        </box>

        <box flexDirection="row" justifyContent="space-between">
          <text fg={theme.dim}>Characters</text>
          <text fg={theme.foreground}>
            <strong>{stats.totalCharacters}</strong>
          </text>
        </box>

        <box flexDirection="row" justifyContent="space-between">
          <text fg={theme.dim}>Errors</text>
          <text fg={stats.errorCount === 0 ? theme.success : theme.error}>
            <strong>{stats.errorCount}</strong>
          </text>
        </box>

        <box flexDirection="row" justifyContent="space-between">
          <text fg={theme.dim}>Consistency</text>
          <text fg={theme.accent}>
            <strong>{stats.consistency}%</strong>
          </text>
        </box>
      </box>

      {/* Actions */}
      <box flexDirection="row" gap={4} marginTop={2}>
        <box 
          border 
          padding={1}
          onMouseDown={onPlayAgain}
        >
          <text fg={theme.success}>
            <strong>[ R ] Play Again</strong>
          </text>
        </box>
        
        <box 
          border 
          padding={1}
          onMouseDown={onMainMenu}
        >
          <text fg={theme.primary}>
            <strong>[ M ] Main Menu</strong>
          </text>
        </box>
      </box>

      {/* Keyboard hints */}
      <box marginTop={1}>
        <text fg={theme.dim}>
          Press R to race again or M for main menu
        </text>
      </box>
    </box>
  )
}
