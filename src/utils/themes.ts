// Configurable color themes for TTyper

import type { GameTheme } from '../types/game.js'

export const defaultTheme: GameTheme = {
  background: '#1a1a2e',
  foreground: '#c0caf5',
  primary: '#7aa2f7',
  success: '#9ece6a',
  error: '#f7768e',
  warning: '#e0af68',
  accent: '#bb9af7',
  dim: '#565f89',
  cursor: '#e0af68',
  correct: '#9ece6a',
  incorrect: '#f7768e',
  untyped: '#565f89',
  border: '#7aa2f7',
  highlight: '#2a2a4e'
}

export const darkTheme: GameTheme = {
  background: '#000000',
  foreground: '#ffffff',
  primary: '#00d4ff',
  success: '#00ff88',
  error: '#ff4444',
  warning: '#ffaa00',
  accent: '#ff00ff',
  dim: '#666666',
  cursor: '#ffff00',
  correct: '#00ff88',
  incorrect: '#ff4444',
  untyped: '#666666',
  border: '#00d4ff',
  highlight: '#1a1a1a'
}

export const lightTheme: GameTheme = {
  background: '#f0f0f0',
  foreground: '#1a1a1a',
  primary: '#0066cc',
  success: '#00aa00',
  error: '#cc0000',
  warning: '#ff8800',
  accent: '#6600cc',
  dim: '#666666',
  cursor: '#ff6600',
  correct: '#00aa00',
  incorrect: '#cc0000',
  untyped: '#999999',
  border: '#0066cc',
  highlight: '#e0e0e0'
}

export const themes = {
  default: defaultTheme,
  dark: darkTheme,
  light: lightTheme
}

export type ThemeName = keyof typeof themes
