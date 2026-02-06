// Multiplayer menu screen

import { useState, useCallback } from 'react'
import { useKeyboard } from '@opentui/react'
import { useTheme } from '../shared/ThemeProvider.js'
import type { ScreenState } from '../../types/game.js'

interface MultiplayerMenuProps {
  onNavigate: (screen: ScreenState) => void
  onBack: () => void
  onJoinLobby: () => void
  onQuickPlay: () => void
  onCreateLobby: () => void
}

export function MultiplayerMenu({ onNavigate, onBack, onJoinLobby, onQuickPlay, onCreateLobby }: MultiplayerMenuProps) {
  const { theme } = useTheme()
  const [selectedIndex, setSelectedIndex] = useState(0)

  const menuOptions = [
    { id: 'quick', label: 'Quick Play', icon: '⚡', description: 'Join a race instantly' },
    { id: 'create', label: 'Create Lobby', icon: '➕', description: 'Host your own race' },
    { id: 'join', label: 'Join by Code', icon: '🔑', description: 'Enter a 4-character code' },
    { id: 'back', label: 'Back', icon: '⬅️', description: 'Return to main menu' },
  ]

  const handleSelect = useCallback((index: number) => {
    const option = menuOptions[index]
    console.log('handleSelect called with index:', index, 'option:', option?.id)
    if (!option) return

    switch (option.id) {
      case 'quick':
        console.log('Calling onQuickPlay')
        onQuickPlay()
        break
      case 'create':
        console.log('Calling onCreateLobby')
        onCreateLobby()
        break
      case 'join':
        console.log('Calling onJoinLobby')
        onJoinLobby()
        break
      case 'back':
        console.log('Calling onBack')
        onBack()
        break
    }
  }, [onQuickPlay, onCreateLobby, onJoinLobby, onBack])

  useKeyboard((key) => {
    console.log('Key pressed:', key.name, key.sequence)
    
    if (key.name === 'escape') {
      onBack()
      return
    }

    if (key.name === 'up') {
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : menuOptions.length - 1))
      return
    }

    if (key.name === 'down') {
      setSelectedIndex((prev) => (prev < menuOptions.length - 1 ? prev + 1 : 0))
      return
    }

    if (key.name === 'return' || key.name === 'enter') {
      console.log('Enter pressed, selected:', menuOptions[selectedIndex]?.id)
      handleSelect(selectedIndex)
    }
  })

  return (
    <box 
      flexDirection="column" 
      alignItems="center" 
      justifyContent="center"
      flexGrow={1}
      backgroundColor={theme.background}
    >
      <text fg={theme.primary}>
        <strong>🏁 Multiplayer</strong>
      </text>
      
      <box marginTop={1} marginBottom={2}>
        <text fg={theme.dim}>
          Race against other players in real-time
        </text>
      </box>

      <box 
        border 
        borderStyle="rounded"
        padding={2}
        width={60}
      >
        {menuOptions.map((option, index) => (
          <box
            key={option.id}
            flexDirection="row"
            padding={1}
            backgroundColor={index === selectedIndex ? theme.highlight : undefined}
          >
            <text fg={index === selectedIndex ? theme.primary : theme.foreground}>
              {index === selectedIndex ? '▸ ' : '  '}
              {option.icon} {option.label}
            </text>
            <box flexGrow={1} />
            <text fg={theme.dim}>
              {option.description}
            </text>
          </box>
        ))}
      </box>

      <box marginTop={2} flexDirection="row" gap={4}>
        <text fg={theme.dim}>↑↓ Navigate</text>
        <text fg={theme.dim}>Enter Select</text>
        <text fg={theme.dim}>ESC Back</text>
      </box>
    </box>
  )
}
