// Main menu screen

import { useTheme } from '../shared/ThemeProvider.js'
import { AnimatedLogo } from '../ui/AnimatedLogo.js'
import type { ScreenState } from '../../types/game.js'

interface MainMenuProps {
  onNavigate: (screen: ScreenState) => void
  onExit: () => void
}

export function MainMenu({ onNavigate, onExit }: MainMenuProps) {
  const { theme } = useTheme()

  const menuOptions = [
    { id: 'solo', label: 'Solo Practice', icon: '🎮', disabled: false },
    { id: 'multiplayer', label: 'Multiplayer', icon: '🏁', disabled: true },
    { id: 'stats', label: 'Statistics', icon: '📊', disabled: true },
    { id: 'settings', label: 'Settings', icon: '⚙️', disabled: false },
    { id: 'exit', label: 'Exit', icon: '❌', disabled: false },
  ]

  const handleSelect = (index: number) => {
    const option = menuOptions[index]
    if (!option || option.disabled) return

    switch (option.id) {
      case 'solo':
        onNavigate('solo-config')
        break
      case 'settings':
        onNavigate('settings')
        break
      case 'exit':
        onExit()
        break
    }
  }

  return (
    <box 
      flexDirection="column" 
      alignItems="center" 
      justifyContent="center"
      flexGrow={1}
      backgroundColor={theme.background}
    >
      <box marginBottom={2}>
        <AnimatedLogo size="medium" />
      </box>

      <box 
        border 
        borderStyle="rounded"
        padding={2}
        width={50}
      >
        <select
          options={menuOptions.map(opt => ({
            name: `${opt.icon} ${opt.label}`,
            description: opt.disabled ? 'Coming soon' : ''
          }))}
          onSelect={(index) => handleSelect(index)}
          focused
          height={menuOptions.length + 2}
          selectedBackgroundColor={theme.highlight}
          selectedTextColor={theme.primary}
        />
      </box>

      <box marginTop={2} flexDirection="row" gap={4}>
        <text fg={theme.dim}>↑↓ Navigate</text>
        <text fg={theme.dim}>Enter Select</text>
        <text fg={theme.dim}>ESC Exit</text>
      </box>
    </box>
  )
}
