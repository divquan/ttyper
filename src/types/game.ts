// Type definitions for TTyper game

export interface GameTheme {
  background: string
  foreground: string
  primary: string
  success: string
  error: string
  warning: string
  accent: string
  dim: string
  cursor: string
  correct: string
  incorrect: string
  untyped: string
  border: string
  highlight: string
}

export interface TextCategory {
  id: string
  name: string
  icon: string
  description: string
  difficulty: 'easy' | 'medium' | 'hard'
  generator: () => string
}

export interface TypingState {
  targetText: string
  userInput: string
  cursorPosition: number
  errors: number[]
  startTime: number | null
  endTime: number | null
  isComplete: boolean
}

export interface RaceStats {
  wpm: number
  accuracy: number
  timeTaken: number
  errorCount: number
  totalCharacters: number
  consistency: number
}

export interface RaceConfig {
  category: string
  duration: number | null // null for unlimited
  difficulty: 'easy' | 'medium' | 'hard'
}

export type ScreenState = 
  | 'splash'
  | 'menu'
  | 'solo-config'
  | 'race'
  | 'results'
  | 'settings'

export interface MenuOption {
  id: string
  label: string
  icon: string
  action: () => void
  disabled?: boolean
}
