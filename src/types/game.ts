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
  | 'multiplayer-menu'
  | 'join-lobby'
  | 'lobby'
  | 'multiplayer-race'
  | 'multiplayer-results'

export interface MultiplayerRaceConfig {
  lobbyId: string
  text: string
  textCategory: string
  isHost: boolean
}

export interface LobbyPlayer {
  userId: string
  name: string
  isReady: boolean
  progress: number
  wpm: number
  accuracy: number
  status: 'waiting' | 'ready' | 'racing' | 'finished'
  isHost: boolean
}

export interface LobbyInfo {
  id: string
  name: string
  joinCode: string
  status: 'waiting' | 'racing' | 'finished'
  maxPlayers: number
  textCategory: string
  isPublic: boolean
}

export interface MenuOption {
  id: string
  label: string
  icon: string
  action: () => void
  disabled?: boolean
}
