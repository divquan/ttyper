// Progress bar component with animation

import { useEffect, useState } from 'react'
import { useTheme } from '../shared/ThemeProvider.js'

interface ProgressBarProps {
  progress: number // 0-100
  width?: number
  showPercentage?: boolean
  label?: string
}

export function ProgressBar({ 
  progress, 
  width = 40, 
  showPercentage = true,
  label
}: ProgressBarProps) {
  const { theme } = useTheme()
  const [displayProgress, setDisplayProgress] = useState(0)

  // Smooth animation
  useEffect(() => {
    const diff = progress - displayProgress
    if (Math.abs(diff) < 0.5) {
      setDisplayProgress(progress)
      return
    }

    const step = diff * 0.2
    const timer = setTimeout(() => {
      setDisplayProgress(prev => prev + step)
    }, 16)

    return () => clearTimeout(timer)
  }, [progress, displayProgress])

  const filledWidth = Math.round((displayProgress / 100) * (width - 2))
  const emptyWidth = (width - 2) - filledWidth

  return (
    <box flexDirection="column">
      {label && (
        <text fg={theme.foreground}>{label}</text>
      )}
      <box flexDirection="row">
        <box 
          width={width} 
          height={1}
          border
          borderStyle="single"
        >
          <box 
            flexDirection="row"
            width={width - 2}
          >
            <box 
              width={filledWidth}
              height={1}
              backgroundColor={theme.success}
            />
            <box 
              width={emptyWidth}
              height={1}
              backgroundColor={theme.dim}
            />
          </box>
        </box>
        {showPercentage && (
          <text fg={theme.foreground}>
            {Math.round(displayProgress)}%
          </text>
        )}
      </box>
    </box>
  )
}
