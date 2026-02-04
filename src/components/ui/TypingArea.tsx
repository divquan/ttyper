// Typing area with character-level display

import { useTheme } from '../shared/ThemeProvider.js'
import type { TypingState } from '../../types/game.js'

interface TypingAreaProps {
  state: TypingState
  height?: number
}

export function TypingArea({ state, height = 10 }: TypingAreaProps) {
  const { theme } = useTheme()

  // Split text into displayable chunks
  const renderText = () => {
    const elements: React.ReactNode[] = []
    
    for (let i = 0; i < state.targetText.length; i++) {
      const char = state.targetText[i]
      const isTyped = i < state.userInput.length
      const isCurrent = i === state.cursorPosition
      const isError = state.errors.includes(i)

      let fg = theme.untyped
      let bg = undefined
      let content = char

      if (isTyped) {
        if (isError) {
          fg = theme.error
          content = state.userInput[i] || char
        } else {
          fg = theme.correct
        }
      } else if (isCurrent) {
        fg = theme.background
        bg = theme.cursor
      }

      elements.push(
        <span key={i} fg={fg} bg={bg}>
          {content}
        </span>
      )
    }

    return elements
  }

  return (
    <box 
      border 
      padding={1}
      height={height}
      width="100%"
      backgroundColor={theme.background}
    >
      <text>
        {renderText()}
      </text>
    </box>
  )
}
