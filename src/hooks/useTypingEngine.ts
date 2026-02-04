// React hook for typing engine

import { useState, useCallback, useRef, useEffect } from 'react'
import type { TypingState, RaceStats } from '../types/game.js'
import { calculateAllMetrics } from '../utils/wpmCalculator.js'

export function useTypingEngine(targetText: string, duration: number | null) {
  const [state, setState] = useState<TypingState>({
    targetText,
    userInput: '',
    cursorPosition: 0,
    errors: [],
    startTime: null,
    endTime: null,
    isComplete: false
  })

  const [currentTime, setCurrentTime] = useState<number>(0)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const wpmHistoryRef = useRef<number[]>([])

  // Start timer when first character is typed
  useEffect(() => {
    if (state.startTime && !state.isComplete) {
      timerRef.current = setInterval(() => {
        const elapsed = Date.now() - state.startTime!
        setCurrentTime(elapsed)

        // Update WPM history every second
        if (elapsed % 1000 < 100) {
          const timeInSeconds = elapsed / 1000
          const charsTyped = state.userInput.length
          const errors = state.errors.length
          const wpm = calculateAllMetrics(charsTyped, errors, timeInSeconds).wpm
          wpmHistoryRef.current.push(wpm)
        }

        // Check if time limit reached
        if (duration && elapsed >= duration * 1000) {
          finishRace()
        }
      }, 100)

      return () => {
        if (timerRef.current) {
          clearInterval(timerRef.current)
        }
      }
    }
  }, [state.startTime, state.isComplete, duration, state.userInput.length, state.errors.length])

  const handleCharacter = useCallback((char: string) => {
    if (state.isComplete) return

    setState(prev => {
      // Start timer on first character
      const startTime = prev.startTime || Date.now()
      
      const newInput = prev.userInput + char
      const position = newInput.length - 1
      
      // Check if character is correct
      const isCorrect = char === prev.targetText[position]
      const newErrors = isCorrect 
        ? prev.errors 
        : [...prev.errors, position]

      // Check if race is complete
      const isComplete = newInput.length >= prev.targetText.length
      const endTime = isComplete ? Date.now() : null

      return {
        ...prev,
        userInput: newInput,
        cursorPosition: newInput.length,
        errors: newErrors,
        startTime,
        endTime,
        isComplete
      }
    })
  }, [state.isComplete])

  const handleBackspace = useCallback(() => {
    if (state.isComplete || state.userInput.length === 0) return

    setState(prev => {
      const newInput = prev.userInput.slice(0, -1)
      const newPosition = newInput.length
      
      // Remove error if it was at the deleted position
      const newErrors = prev.errors.filter(e => e < newPosition)

      return {
        ...prev,
        userInput: newInput,
        cursorPosition: newPosition,
        errors: newErrors
      }
    })
  }, [state.isComplete, state.userInput.length])

  const finishRace = useCallback(() => {
    setState(prev => ({
      ...prev,
      isComplete: true,
      endTime: Date.now()
    }))
    
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }
  }, [])

  const reset = useCallback((newTargetText?: string) => {
    setState({
      targetText: newTargetText || targetText,
      userInput: '',
      cursorPosition: 0,
      errors: [],
      startTime: null,
      endTime: null,
      isComplete: false
    })
    setCurrentTime(0)
    wpmHistoryRef.current = []
    
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }
  }, [targetText])

  // Calculate stats
  const getStats = useCallback((): RaceStats => {
    const timeInSeconds = state.endTime 
      ? (state.endTime - (state.startTime || 0)) / 1000
      : currentTime / 1000

    return calculateAllMetrics(
      state.userInput.length,
      state.errors.length,
      timeInSeconds,
      wpmHistoryRef.current
    )
  }, [state, currentTime])

  return {
    state,
    currentTime,
    handleCharacter,
    handleBackspace,
    finishRace,
    reset,
    getStats
  }
}
