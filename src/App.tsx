// Main App component

import { useState, useCallback } from 'react'
import { useKeyboard, useRenderer } from '@opentui/react'
import { ThemeProvider } from './components/shared/ThemeProvider.js'
import { Splash } from './components/screens/Splash.js'
import { MainMenu } from './components/screens/MainMenu.js'
import { SoloPractice } from './components/screens/SoloPractice.js'
import { Race } from './components/screens/Race.js'
import { Results } from './components/screens/Results.js'
import { Settings } from './components/screens/Settings.js'
import type { ScreenState, RaceConfig, RaceStats } from './types/game.js'

function AppContent() {
  const renderer = useRenderer()
  const [screen, setScreen] = useState<ScreenState>('splash')
  const [raceConfig, setRaceConfig] = useState<RaceConfig | null>(null)
  const [raceStats, setRaceStats] = useState<RaceStats | null>(null)

  const handleExit = useCallback(() => {
    renderer.destroy()
  }, [renderer])

  const handleStartRace = useCallback((config: RaceConfig) => {
    setRaceConfig(config)
    setScreen('race')
  }, [])

  const handleRaceComplete = useCallback((stats: RaceStats) => {
    setRaceStats(stats)
    setScreen('results')
  }, [])

  const handlePlayAgain = useCallback(() => {
    if (raceConfig) {
      setScreen('race')
    } else {
      setScreen('solo-config')
    }
  }, [raceConfig])

  const handleMainMenu = useCallback(() => {
    setRaceConfig(null)
    setRaceStats(null)
    setScreen('menu')
  }, [])

  // Global keyboard shortcuts
  useKeyboard((key) => {
    // Always allow Ctrl+C to exit
    if (key.ctrl && key.name === 'c') {
      handleExit()
      return
    }

    // Handle results screen shortcuts
    if (screen === 'results' && raceStats) {
      if (key.name === 'r') {
        handlePlayAgain()
      } else if (key.name === 'm') {
        handleMainMenu()
      }
    }
    
    // Handle splash screen - any key continues
    if (screen === 'splash') {
      setScreen('menu')
    }
  })

  // Render current screen
  const renderScreen = () => {
    switch (screen) {
      case 'splash':
        return <Splash onComplete={() => setScreen('menu')} />

      case 'menu':
        return (
          <MainMenu
            onNavigate={setScreen}
            onExit={handleExit}
          />
        )

      case 'solo-config':
        return (
          <SoloPractice
            onStart={handleStartRace}
            onBack={() => setScreen('menu')}
          />
        )

      case 'race':
        if (!raceConfig) {
          setScreen('solo-config')
          return null
        }
        return (
          <Race
            config={raceConfig}
            onComplete={handleRaceComplete}
            onQuit={() => {
              setRaceConfig(null)
              setScreen('menu')
            }}
          />
        )

      case 'results':
        if (!raceStats) {
          setScreen('menu')
          return null
        }
        return (
          <Results
            stats={raceStats}
            onPlayAgain={handlePlayAgain}
            onMainMenu={handleMainMenu}
          />
        )

      case 'settings':
        return (
          <Settings
            onBack={() => setScreen('menu')}
          />
        )

      default:
        return <Splash onComplete={() => setScreen('menu')} />
    }
  }

  return (
    <box 
      flexDirection="column"
      width="100%"
      height="100%"
    >
      {renderScreen()}
    </box>
  )
}

export function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  )
}
