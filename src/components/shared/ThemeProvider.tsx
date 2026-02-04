// Theme context and hook

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import type { GameTheme } from '../../types/game.js'
import { defaultTheme, type ThemeName, themes } from '../../utils/themes.js'

interface ThemeContextType {
  theme: GameTheme
  themeName: ThemeName
  setTheme: (name: ThemeName) => void
  availableThemes: ThemeName[]
}

const ThemeContext = createContext<ThemeContextType | null>(null)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeName, setThemeName] = useState<ThemeName>('default')
  const theme = themes[themeName]

  const setTheme = useCallback((name: ThemeName) => {
    setThemeName(name)
  }, [])

  const availableThemes = Object.keys(themes) as ThemeName[]

  return (
    <ThemeContext.Provider value={{ theme, themeName, setTheme, availableThemes }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}
