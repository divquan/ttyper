// Splash screen with animated logo

import { useState, useEffect } from 'react'
import { useTheme } from '../shared/ThemeProvider.js'
import { AnimatedLogo } from '../ui/AnimatedLogo.js'

interface SplashProps {
  onComplete: () => void
}

export function Splash({ onComplete }: SplashProps) {
  const { theme } = useTheme()
  const [progress, setProgress] = useState(0)
  const [showPressKey, setShowPressKey] = useState(false)

  // Progress animation
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setShowPressKey(true)
          return 100
        }
        return prev + 2
      })
    }, 30)

    return () => clearInterval(interval)
  }, [])

  return (
    <box 
      flexDirection="column" 
      alignItems="center" 
      justifyContent="center"
      flexGrow={1}
      backgroundColor={theme.background}
    >
      <box marginBottom={2}>
        <AnimatedLogo size="large" />
      </box>
      
      <text fg={theme.dim} marginBottom={2}>
        Terminal typing, competitive style
      </text>
      
      {/* Progress bar */}
      <box width={40} marginBottom={2}>
        <box 
          width={40} 
          height={1}
          backgroundColor={theme.highlight}
        >
          <box 
            width={Math.round((progress / 100) * 40)}
            height={1}
            backgroundColor={theme.primary}
          />
        </box>
      </box>
      
      {showPressKey && (
        <text fg={theme.primary}>
          <em>Press any key to continue...</em>
        </text>
      )}
    </box>
  )
}
