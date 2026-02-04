// Solo practice configuration screen - Simplified UX

import { useState } from 'react'
import { useKeyboard } from '@opentui/react'
import { useTheme } from '../shared/ThemeProvider.js'
import { textCategories } from '../../utils/textGenerators.js'
import type { RaceConfig } from '../../types/game.js'

interface SoloPracticeProps {
  onStart: (config: RaceConfig) => void
  onBack: () => void
}

type ConfigField = 'category' | 'duration' | 'difficulty' | 'action'

export function SoloPractice({ onStart, onBack }: SoloPracticeProps) {
  const { theme } = useTheme()
  const [focusedField, setFocusedField] = useState<ConfigField>('category')
  const [selectedCategory, setSelectedCategory] = useState(0)
  const [selectedDuration, setSelectedDuration] = useState(2) // Default 60s
  const [selectedDifficulty, setSelectedDifficulty] = useState(1) // Default medium

  const durations = [
    { label: '15s', value: 15 },
    { label: '30s', value: 30 },
    { label: '60s', value: 60 },
    { label: 'Unlimited', value: null },
  ]

  const difficulties = [
    { label: 'Easy', value: 'easy' as const },
    { label: 'Medium', value: 'medium' as const },
    { label: 'Hard', value: 'hard' as const },
  ]

  const handleStart = () => {
    const config: RaceConfig = {
      category: textCategories[selectedCategory]!.id,
      duration: durations[selectedDuration]!.value,
      difficulty: difficulties[selectedDifficulty]!.value,
    }
    onStart(config)
  }

  // Keyboard navigation
  useKeyboard((key) => {
    if (key.name === 'escape') {
      onBack()
      return
    }

    if (key.name === 'enter' || key.name === 'return') {
      handleStart()
      return
    }

    if (key.name === 'tab') {
      // Cycle through fields
      const fields: ConfigField[] = ['category', 'duration', 'difficulty', 'action']
      const currentIndex = fields.indexOf(focusedField)
      const nextIndex = (currentIndex + 1) % fields.length
      setFocusedField(fields[nextIndex]!)
      return
    }

    // Only handle arrow keys for the currently focused field
    if (focusedField === 'category') {
      if (key.name === 'down' || key.name === 'j') {
        setSelectedCategory(i => Math.min(textCategories.length - 1, i + 1))
      } else if (key.name === 'up' || key.name === 'k') {
        setSelectedCategory(i => Math.max(0, i - 1))
      }
    } else if (focusedField === 'duration') {
      if (key.name === 'right' || key.name === 'l') {
        setSelectedDuration(i => Math.min(durations.length - 1, i + 1))
      } else if (key.name === 'left' || key.name === 'h') {
        setSelectedDuration(i => Math.max(0, i - 1))
      }
    } else if (focusedField === 'difficulty') {
      if (key.name === 'right' || key.name === 'l') {
        setSelectedDifficulty(i => Math.min(difficulties.length - 1, i + 1))
      } else if (key.name === 'left' || key.name === 'h') {
        setSelectedDifficulty(i => Math.max(0, i - 1))
      }
    }
  })

  const isFocused = (field: ConfigField) => focusedField === field

  return (
    <box 
      flexDirection="column" 
      alignItems="center" 
      justifyContent="center"
      flexGrow={1}
      backgroundColor={theme.background}
      gap={1}
    >
      <text fg={theme.primary} marginBottom={1}>
        <strong>🎮 Solo Practice</strong>
      </text>

      <text fg={theme.dim}>Configure your race:</text>

      {/* Category Selection */}
      <box 
        border 
        borderStyle={isFocused('category') ? 'double' : 'single'}
        borderColor={isFocused('category') ? theme.primary : theme.dim}
        padding={1}
        width={60}
        marginBottom={1}
      >
        <box flexDirection="column" gap={1}>
          <text fg={isFocused('category') ? theme.primary : theme.dim}>
            {isFocused('category') ? '▶ ' : '  '}Text Category
          </text>
          <box flexDirection="row" gap={2} flexWrap="wrap">
            {textCategories.map((cat, i) => (
              <text 
                key={cat.id}
                fg={i === selectedCategory 
                  ? (isFocused('category') ? theme.success : theme.primary)
                  : theme.dim
                }
                bg={i === selectedCategory ? theme.highlight : undefined}
              >
                {i === selectedCategory ? `[${cat.icon} ${cat.name}]` : ` ${cat.icon} ${cat.name} `}
              </text>
            ))}
          </box>
          <text fg={theme.dim}>
            {textCategories[selectedCategory]!.description}
          </text>
        </box>
      </box>

      {/* Duration Selection */}
      <box 
        border 
        borderStyle={isFocused('duration') ? 'double' : 'single'}
        borderColor={isFocused('duration') ? theme.primary : theme.dim}
        padding={1}
        width={60}
        marginBottom={1}
      >
        <box flexDirection="column" gap={1}>
          <text fg={isFocused('duration') ? theme.primary : theme.dim}>
            {isFocused('duration') ? '▶ ' : '  '}Duration
          </text>
          <box flexDirection="row" gap={2}>
            {durations.map((dur, i) => (
              <text 
                key={dur.label}
                fg={i === selectedDuration 
                  ? (isFocused('duration') ? theme.success : theme.primary)
                  : theme.dim
                }
                bg={i === selectedDuration ? theme.highlight : undefined}
              >
                {i === selectedDuration ? `[${dur.label}]` : ` ${dur.label} `}
              </text>
            ))}
          </box>
        </box>
      </box>

      {/* Difficulty Selection */}
      <box 
        border 
        borderStyle={isFocused('difficulty') ? 'double' : 'single'}
        borderColor={isFocused('difficulty') ? theme.primary : theme.dim}
        padding={1}
        width={60}
        marginBottom={2}
      >
        <box flexDirection="column" gap={1}>
          <text fg={isFocused('difficulty') ? theme.primary : theme.dim}>
            {isFocused('difficulty') ? '▶ ' : '  '}Difficulty
          </text>
          <box flexDirection="row" gap={2}>
            {difficulties.map((diff, i) => (
              <text 
                key={diff.value}
                fg={i === selectedDifficulty 
                  ? (isFocused('difficulty') ? theme.success : theme.primary)
                  : theme.dim
                }
                bg={i === selectedDifficulty ? theme.highlight : undefined}
              >
                {i === selectedDifficulty ? `[${diff.label}]` : ` ${diff.label} `}
              </text>
            ))}
          </box>
        </box>
      </box>

      {/* Action Button */}
      <box 
        border 
        borderStyle={isFocused('action') ? 'double' : 'single'}
        borderColor={isFocused('action') ? theme.success : theme.dim}
        padding={1}
        width={60}
        backgroundColor={isFocused('action') ? theme.highlight : undefined}
      >
        <box flexDirection="column" alignItems="center">
          <text fg={isFocused('action') ? theme.success : theme.dim}>
            {isFocused('action') ? '▶ ' : '  '}
            <strong>START RACE</strong>
          </text>
        </box>
      </box>

      {/* Help text */}
      <box marginTop={2}>
        <text fg={theme.dim}>
          TAB: Next Field • ↑↓: Change Category • ←→: Change Value • ENTER: Start • ESC: Back
        </text>
      </box>
    </box>
  )
}
