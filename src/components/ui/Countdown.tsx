// Countdown animation component

import { useState, useEffect } from 'react'
import { useTheme } from '../shared/ThemeProvider.js'

interface CountdownProps {
  onComplete: () => void
}

export function Countdown({ onComplete }: CountdownProps) {
  const { theme } = useTheme()
  const [phase, setPhase] = useState<3 | 2 | 1 | 0 | 'go'>(3)

  useEffect(() => {
    const timers: NodeJS.Timeout[] = []
    
    // Countdown from 3 to 1
    timers.push(setTimeout(() => setPhase(2), 1000))
    timers.push(setTimeout(() => setPhase(1), 2000))
    timers.push(setTimeout(() => setPhase(0), 3000))
    
    // Show GO! and complete
    timers.push(setTimeout(() => {
      setPhase('go')
    }, 3000))
    
    timers.push(setTimeout(() => {
      onComplete()
    }, 4000))

    return () => {
      timers.forEach(clearTimeout)
    }
  }, [])

  if (phase === 'go') {
    return (
      <box 
        flexDirection="column" 
        alignItems="center" 
        justifyContent="center"
        flexGrow={1}
      >
        <text fg={theme.success}>
          <strong>GO!</strong>
        </text>
      </box>
    )
  }

  return (
    <box 
      flexDirection="column" 
      alignItems="center" 
      justifyContent="center"
      flexGrow={1}
    >
      <ascii-font 
        text={phase === 0 ? '1' : phase.toString()} 
        font="block"
        color={theme.primary}
      />
    </box>
  )
}
