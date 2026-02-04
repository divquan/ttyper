// Animated Logo component

import { useTheme } from '../shared/ThemeProvider.js'

interface AnimatedLogoProps {
  size?: 'small' | 'medium' | 'large'
}

export function AnimatedLogo({ size = 'medium' }: AnimatedLogoProps) {
  const { theme } = useTheme()

  const font: 'tiny' | 'block' = size === 'small' ? 'tiny' : 'block'

  return (
    <box flexDirection="column" alignItems="center">
      <ascii-font 
        text="TTYper" 
        font={font}
        color={theme.primary}
      />
    </box>
  )
}
