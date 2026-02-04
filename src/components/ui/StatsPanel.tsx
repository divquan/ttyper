// Stats panel for race metrics

import { useTheme } from '../shared/ThemeProvider.js'
import type { RaceStats } from '../../types/game.js'

interface StatsPanelProps {
  stats: RaceStats
  isLive?: boolean
}

export function StatsPanel({ stats, isLive = false }: StatsPanelProps) {
  const { theme } = useTheme()

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    const ms = Math.floor((seconds % 1) * 100)
    return `${mins}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`
  }

  return (
    <box 
      flexDirection="row" 
      gap={4}
      padding={1}
      border
      borderStyle="single"
    >
      <box flexDirection="column">
        <text fg={theme.dim}>WPM</text>
        <text fg={theme.primary}>
          <strong>{stats.wpm}</strong>
        </text>
      </box>
      
      <box flexDirection="column">
        <text fg={theme.dim}>Accuracy</text>
        <text fg={theme.success}>
          <strong>{stats.accuracy}%</strong>
        </text>
      </box>
      
      <box flexDirection="column">
        <text fg={theme.dim}>Time</text>
        <text fg={theme.foreground}>
          <strong>{formatTime(stats.timeTaken)}</strong>
        </text>
      </box>
      
      <box flexDirection="column">
        <text fg={theme.dim}>Errors</text>
        <text fg={stats.errorCount > 0 ? theme.error : theme.success}>
          <strong>{stats.errorCount}</strong>
        </text>
      </box>
      
      {!isLive && (
        <box flexDirection="column">
          <text fg={theme.dim}>Consistency</text>
          <text fg={theme.accent}>
            <strong>{stats.consistency}%</strong>
          </text>
        </box>
      )}
    </box>
  )
}
