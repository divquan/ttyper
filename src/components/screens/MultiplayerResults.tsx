// Multiplayer results screen - podium and rankings

import { useState, useCallback } from 'react'
import { useKeyboard } from '@opentui/react'
import { useTheme } from '../shared/ThemeProvider.js'
import type { RaceStats } from '../../types/game.js'

interface PlayerResult {
  userId: string
  name: string
  wpm: number
  accuracy: number
  timeTaken: number
  rank: number
}

interface MultiplayerResultsProps {
  results: PlayerResult[]
  yourUserId: string
  onRaceAgain: () => void
  onNewRace: () => void
  onMainMenu: () => void
}

export function MultiplayerResults({
  results,
  yourUserId,
  onRaceAgain,
  onNewRace,
  onMainMenu,
}: MultiplayerResultsProps) {
  const { theme } = useTheme()
  const [selectedAction, setSelectedAction] = useState(0)

  const sortedResults = [...results].sort((a, b) => {
    // Sort by rank first, then by WPM
    if (a.rank !== b.rank) return a.rank - b.rank
    return b.wpm - a.wpm
  })

  const yourResult = sortedResults.find(r => r.userId === yourUserId)
  const yourRank = yourResult?.rank || 0

  const actions = [
    { id: 'again', label: 'Race Again', key: 'r' },
    { id: 'new', label: 'New Race', key: 'n' },
    { id: 'menu', label: 'Main Menu', key: 'm' },
  ]

  useKeyboard((key) => {
    if (key.name === 'r') {
      onRaceAgain()
      return
    }
    if (key.name === 'n') {
      onNewRace()
      return
    }
    if (key.name === 'm') {
      onMainMenu()
      return
    }
    if (key.name === 'up') {
      setSelectedAction((prev) => (prev > 0 ? prev - 1 : actions.length - 1))
      return
    }
    if (key.name === 'down') {
      setSelectedAction((prev) => (prev < actions.length - 1 ? 0 : prev + 1))
      return
    }
    if (key.name === 'return') {
      const action = actions[selectedAction]
      if (action) {
        if (action.id === 'again') onRaceAgain()
        if (action.id === 'new') onNewRace()
        if (action.id === 'menu') onMainMenu()
      }
    }
  })

  const getMedal = (rank: number) => {
    switch (rank) {
      case 1: return '🥇'
      case 2: return '🥈'
      case 3: return '🥉'
      default: return `${rank}.`
    }
  }

  const getRankMessage = () => {
    switch (yourRank) {
      case 1: return '🏆 Champion!'
      case 2: return '🥈 Second place!'
      case 3: return '🥉 Third place!'
      default: return `Rank #${yourRank}`
    }
  }

  return (
    <box 
      flexDirection="column" 
      alignItems="center"
      flexGrow={1}
      padding={2}
      backgroundColor={theme.background}
    >
      {/* Header */}
      <text fg={theme.primary}>
        <strong>🏁 Race Complete!</strong>
      </text>

      {/* Your rank */}
      <box marginTop={1} marginBottom={2}>
        <text fg={theme.warning}>
          <strong>{getRankMessage()}</strong>
        </text>
      </box>

      {/* Podium - Top 3 */}
      {sortedResults.length >= 3 && (
        <box 
          flexDirection="row" 
          justifyContent="center"
          marginBottom={2}
          gap={2}
        >
          {/* Second place */}
          <box 
            flexDirection="column" 
            alignItems="center"
            padding={1}
          >
            <text fg={theme.dim}>🥈</text>
            <text>{sortedResults[1]?.name || '?'}</text>
            <text fg={theme.primary}>{sortedResults[1]?.wpm} WPM</text>
          </box>

          {/* First place - elevated */}
          <box 
            flexDirection="column" 
            alignItems="center"
            padding={1}
            border
            borderStyle="double"
          >
            <text fg={theme.warning}>🥇</text>
            <text><strong>{sortedResults[0]?.name || '?'}</strong></text>
            <text fg={theme.primary}><strong>{sortedResults[0]?.wpm} WPM</strong></text>
          </box>

          {/* Third place */}
          <box 
            flexDirection="column" 
            alignItems="center"
            padding={1}
          >
            <text fg={theme.dim}>🥉</text>
            <text>{sortedResults[2]?.name || '?'}</text>
            <text fg={theme.primary}>{sortedResults[2]?.wpm} WPM</text>
          </box>
        </box>
      )}

      {/* Full results table */}
      <box 
        border
        borderStyle="rounded"
        padding={1}
        width={70}
        marginBottom={2}
      >
        <box flexDirection="row" paddingBottom={1}>
          <text fg={theme.dim} width={8}>Rank</text>
          <text fg={theme.dim} width={20}>Player</text>
          <text fg={theme.dim} width={12}>WPM</text>
          <text fg={theme.dim} width={12}>Accuracy</text>
          <text fg={theme.dim} width={12}>Time</text>
        </box>

        {sortedResults.map((result) => (
          <box 
            key={result.userId}
            flexDirection="row"
            padding={1}
            backgroundColor={result.userId === yourUserId ? theme.highlight : undefined}
          >
            <text width={8} fg={theme.foreground}>
              {getMedal(result.rank)}
            </text>
            <text width={20} fg={theme.foreground}>
              {result.name}
              {result.userId === yourUserId && ' (You)'}
            </text>
            <text width={12} fg={theme.primary}>
              {result.wpm}
            </text>
            <text width={12} fg={result.accuracy >= 95 ? theme.success : theme.warning}>
              {result.accuracy}%
            </text>
            <text width={12} fg={theme.dim}>
              {result.timeTaken.toFixed(1)}s
            </text>
          </box>
        ))}
      </box>

      {/* Action buttons */}
      <box flexDirection="row" gap={4}>
        {actions.map((action, index) => (
          <box
            key={action.id}
            padding={1}
            backgroundColor={index === selectedAction ? theme.highlight : undefined}
          >
            <text 
              fg={index === selectedAction ? theme.primary : theme.dim}
            >
              [{action.key.toUpperCase()}] {action.label}
            </text>
          </box>
        ))}
      </box>
    </box>
  )
}
