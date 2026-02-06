// Lobby screen - waiting room before race

import { useEffect, useState } from 'react'
import { useKeyboard } from '@opentui/react'
import { useTheme } from '../shared/ThemeProvider.js'
import type { LobbyPlayer } from '../../types/game.js'

interface LobbyProps {
  lobbyName: string
  joinCode: string
  players: LobbyPlayer[]
  isHost: boolean
  maxPlayers: number
  onToggleReady: () => void
  onStartRace: () => void
  onLeave: () => void
}

export function Lobby({ 
  lobbyName, 
  joinCode, 
  players, 
  isHost, 
  maxPlayers,
  onToggleReady, 
  onStartRace, 
  onLeave 
}: LobbyProps) {
  const { theme } = useTheme()
  
  // Players are automatically ready when they join
  const canStart = players.length >= 2

  useKeyboard((key) => {
    if (key.name === 'escape') {
      onLeave()
      return
    }

    if (key.name === 's' && isHost && canStart) {
      onStartRace()
      return
    }
  })

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
        <strong>🏁 Race Lobby</strong>
      </text>

      {/* Join Code Display */}
      <box 
        marginTop={1}
        marginBottom={2}
        border
        borderStyle="double"
        padding={1}
        alignItems="center"
      >
        <text fg={theme.dim}>Join Code: </text>
        <text fg={theme.warning}>
          <strong>{joinCode}</strong>
        </text>
      </box>

      {/* Player List */}
      <box 
        border
        borderStyle="rounded"
        padding={1}
        width={60}
      >
        <box flexDirection="row" marginBottom={1} paddingBottom={1}>
          <text fg={theme.dim} width={20}>Player</text>
          <text fg={theme.dim} width={15}>Status</text>
          <text fg={theme.dim} width={10}>Host</text>
        </box>

        {players.map((player, index) => (
          <box 
            key={player.userId}
            flexDirection="row"
            padding={1}
          >
            <text width={20} fg={theme.foreground}>
              {index + 1}. {player.name}
            </text>
            <text width={15} fg={theme.success}>
              ✓ Ready
            </text>
            <text width={10} fg={theme.primary}>
              {player.isHost ? '👑' : ''}
            </text>
          </box>
        ))}

        {/* Empty slots */}
        {Array.from({ length: maxPlayers - players.length }).map((_, i) => (
          <box 
            key={`empty-${i}`}
            flexDirection="row"
            padding={1}
          >
            <text width={20} fg={theme.dim}>
              {players.length + i + 1}. (Empty)
            </text>
            <text width={15} fg={theme.dim}>...</text>
            <text width={10} />
          </box>
        ))}
      </box>

      {/* Player count */}
      <box marginTop={1}>
        <text fg={theme.dim}>
          Players: {players.length}/{maxPlayers}
        </text>
      </box>

      {/* Action hints */}
      <box marginTop={2} flexDirection="row" gap={4}>
        {isHost && (
          <text fg={canStart ? theme.success : theme.dim}>
            S - Start Race {canStart ? '(Ready!)' : '(Need 2+ players)'}
          </text>
        )}
        <text fg={theme.dim}>ESC - Leave</text>
      </box>

      {/* Waiting message */}
      {!isHost && (
        <box marginTop={1}>
          <text fg={theme.dim}>
            Waiting for host to start...
          </text>
        </box>
      )}
    </box>
  )
}
