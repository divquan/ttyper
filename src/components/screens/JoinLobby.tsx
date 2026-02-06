// Join lobby screen - enter code or browse public lobbies

import { useState, useCallback } from 'react'
import { useKeyboard } from '@opentui/react'
import { useTheme } from '../shared/ThemeProvider.js'

interface JoinLobbyProps {
  onJoinByCode: (code: string, playerName: string) => void
  onBack: () => void
  error?: string
}

export function JoinLobby({ onJoinByCode, onBack, error }: JoinLobbyProps) {
  const { theme } = useTheme()
  const [mode, setMode] = useState<'code' | 'name'>('name')
  const [joinCode, setJoinCode] = useState('')
  const [playerName, setPlayerName] = useState('')
  const [cursorPos, setCursorPos] = useState(0)

  const handleKey = useCallback((key: { name: string; sequence?: string }) => {
    if (key.name === 'escape') {
      if (mode === 'code') {
        setMode('name')
        setJoinCode('')
      } else {
        onBack()
      }
      return
    }

    if (mode === 'name') {
      if (key.name === 'return' && playerName.trim()) {
        setMode('code')
        setCursorPos(0)
        return
      }

      if (key.name === 'backspace') {
        setPlayerName((prev) => prev.slice(0, -1))
        return
      }

      if (key.sequence && key.sequence.length === 1 && playerName.length < 15) {
        setPlayerName((prev) => prev + key.sequence)
      }
    } else if (mode === 'code') {
      if (key.name === 'return' && joinCode.length === 4) {
        onJoinByCode(joinCode.toUpperCase(), playerName)
        return
      }

      if (key.name === 'backspace') {
        setJoinCode((prev) => {
          const newCode = prev.slice(0, -1)
          setCursorPos(newCode.length)
          return newCode
        })
        return
      }

      // Only allow alphanumeric characters
      if (key.sequence && key.sequence.length === 1 && joinCode.length < 4) {
        const char = key.sequence.toUpperCase()
        if (/[A-Z0-9]/.test(char)) {
          setJoinCode((prev) => prev + char)
          setCursorPos((prev) => prev + 1)
        }
      }
    }
  }, [mode, playerName, joinCode, onJoinByCode, onBack])

  useKeyboard(handleKey)

  return (
    <box 
      flexDirection="column" 
      alignItems="center" 
      justifyContent="center"
      flexGrow={1}
      backgroundColor={theme.background}
    >
      <text fg={theme.primary}>
        <strong>🔑 Join Race</strong>
      </text>

      {mode === 'name' ? (
        <>
          <box marginTop={1} marginBottom={2}>
            <text fg={theme.dim}>
              Enter your name to join
            </text>
          </box>

          <box 
            border 
            borderStyle="rounded"
            padding={2}
            width={50}
          >
            <text fg={theme.primary}>Your Name:</text>
            <box 
              border 
              borderStyle="single"
              padding={1}
              marginTop={1}
            >
              <text>{playerName || ' '}</text>
            </box>
          </box>

          <box marginTop={1}>
            <text fg={theme.dim}>
              Press Enter to continue
            </text>
          </box>
        </>
      ) : (
        <>
          <box marginTop={1} marginBottom={2}>
            <text fg={theme.dim}>
              Enter the 4-character join code
            </text>
          </box>

          <box 
            border 
            borderStyle="rounded"
            padding={2}
            width={50}
            alignItems="center"
          >
            <text fg={theme.dim}>Join Code</text>
            
            <box 
              marginTop={1}
              flexDirection="row"
              gap={2}
            >
              {[0, 1, 2, 3].map((i) => (
                <box
                  key={i}
                  border
                  borderStyle="double"
                  padding={1}
                  width={5}
                  alignItems="center"
                  backgroundColor={i === joinCode.length ? theme.highlight : undefined}
                >
                  <text 
                    fg={joinCode[i] ? theme.primary : theme.dim}
                  >
                    <strong>{joinCode[i] || '•'}</strong>
                  </text>
                </box>
              ))}
            </box>

            {error && (
              <box marginTop={1}>
                <text fg={theme.error}>{error}</text>
              </box>
            )}
          </box>

          <box marginTop={1}>
            <text fg={theme.dim}>
              {joinCode.length === 4 ? 'Press Enter to join' : 'Type the code...'}
            </text>
          </box>
        </>
      )}

      <box marginTop={2}>
        <text fg={theme.dim}>ESC to go back</text>
      </box>
    </box>
  )
}
