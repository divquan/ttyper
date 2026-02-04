// Keyboard hints component

import { useTheme } from './ThemeProvider.js'

interface KeyHintProps {
  keys: string[]
  action: string
}

export function KeyHint({ keys, action }: KeyHintProps) {
  const { theme } = useTheme()

  return (
    <box flexDirection="row" gap={1}>
      {keys.map((key, i) => (
        <box key={i}>
          <text fg={theme.dim}>{key}</text>
        </box>
      ))}
      <text fg={theme.foreground}>{action}</text>
    </box>
  )
}
