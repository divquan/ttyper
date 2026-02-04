// Settings screen - theme and configuration

import { useTheme } from '../shared/ThemeProvider.js'
import type { ThemeName } from '../../utils/themes.js'
import type { ScreenState } from '../../types/game.js'

interface SettingsProps {
  onBack: () => void
}

export function Settings({ onBack }: SettingsProps) {
  const { theme, themeName, setTheme, availableThemes } = useTheme()

  const handleThemeChange = (index: number) => {
    const newTheme = availableThemes[index]
    if (newTheme) {
      setTheme(newTheme)
    }
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
      <text fg={theme.primary}>
        <strong>⚙️ Settings</strong>
      </text>

      <text fg={theme.dim}>Select theme:</text>
      <box border borderStyle="rounded" width={50}>
        <select
          options={availableThemes.map(t => ({
            name: t.charAt(0).toUpperCase() + t.slice(1),
            description: t === themeName ? 'Current' : ''
          }))}
          onChange={(index) => handleThemeChange(index)}
          onSelect={(index) => handleThemeChange(index)}
          focused
          height={availableThemes.length + 2}
          selectedBackgroundColor={theme.highlight}
          selectedTextColor={theme.primary}
        />
      </box>

      {/* Theme preview */}
      <box 
        border 
        borderStyle="single"
        padding={2}
        width={50}
        flexDirection="column"
        gap={1}
      >
        <text fg={theme.primary}>Primary</text>
        <text fg={theme.success}>Success</text>
        <text fg={theme.error}>Error</text>
        <text fg={theme.warning}>Warning</text>
        <text fg={theme.accent}>Accent</text>
        <text fg={theme.dim}>Dim</text>
      </box>

      <box 
        border 
        padding={1}
        marginTop={2}
        onMouseDown={onBack}
      >
        <text fg={theme.dim}>
          <strong>[ ESC ] Back</strong>
        </text>
      </box>
    </box>
  )
}
