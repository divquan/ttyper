// Race screen - main typing interface

import { useEffect, useState, useCallback } from 'react'
import { useKeyboard } from '@opentui/react'
import { useTheme } from '../shared/ThemeProvider.js'
import { useTypingEngine } from '../../hooks/useTypingEngine.js'
import { TypingArea } from '../ui/TypingArea.js'
import { StatsPanel } from '../ui/StatsPanel.js'
import { Countdown } from '../ui/Countdown.js'
import { ProgressBar } from '../ui/ProgressBar.js'
import { generateText } from '../../utils/textGenerators.js'
import type { RaceConfig, RaceStats } from '../../types/game.js'

interface RaceProps {
  config: RaceConfig
  onComplete: (stats: RaceStats) => void
  onQuit: () => void
}

export function Race({ config, onComplete, onQuit }: RaceProps) {
  const { theme } = useTheme()
  const [targetText, setTargetText] = useState('')
  const [showCountdown, setShowCountdown] = useState(true)
  
  const {
    state,
    handleCharacter,
    handleBackspace,
    getStats
  } = useTypingEngine(targetText, config.duration)

  // Generate text on mount
  useEffect(() => {
    const text = generateText(config.category)
    setTargetText(text)
  }, [config.category])

  // Handle race completion
  useEffect(() => {
    if (state.isComplete) {
      const stats = getStats()
      onComplete(stats)
    }
  }, [state.isComplete, getStats, onComplete])

  // Keyboard handler
  useKeyboard((key) => {
    if (state.isComplete || showCountdown) return
    
    if (key.name === 'escape') {
      onQuit()
      return
    }

    if (key.name === 'backspace') {
      handleBackspace()
      return
    }

    // Handle printable characters
    if (key.name.length === 1 && !key.ctrl) {
      handleCharacter(key.name)
    }
  })

  const progress = targetText.length > 0 
    ? (state.userInput.length / targetText.length) * 100 
    : 0

  const stats = getStats()

  if (showCountdown) {
    return (
      <box 
        flexGrow={1}
        backgroundColor={theme.background}
      >
        <Countdown onComplete={() => setShowCountdown(false)} />
      </box>
    )
  }

  return (
    <box 
      flexDirection="column"
      flexGrow={1}
      padding={2}
      backgroundColor={theme.background}
      gap={1}
    >
      {/* Header */}
      <box flexDirection="row" justifyContent="space-between">
        <text fg={theme.primary}>
          <strong>Solo Race</strong>
        </text>
        <text fg={theme.dim}>
          {config.duration 
            ? `${Math.floor(stats.timeTaken)}s / ${config.duration}s`
            : `${Math.floor(stats.timeTaken)}s`
          }
        </text>
      </box>

      {/* Progress bar */}
      <ProgressBar 
        progress={progress} 
        width={60}
        showPercentage
      />

      {/* Typing area */}
      <box flexGrow={1} marginTop={1} marginBottom={1}>
        <TypingArea state={state} height={15} />
      </box>

      {/* Stats */}
      <StatsPanel stats={stats} isLive />

      {/* Help text */}
      <box marginTop={1}>
        <text fg={theme.dim}>
          Type the text above • ESC to quit
        </text>
      </box>
    </box>
  )
}
