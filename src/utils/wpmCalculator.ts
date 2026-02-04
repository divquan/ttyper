// WPM and accuracy calculations

export interface TypingMetrics {
  wpm: number
  accuracy: number
  rawWpm: number
  errorCount: number
  consistency: number
  timeTaken: number
  totalCharacters: number
}

export function calculateWPM(
  charCount: number,
  errors: number,
  timeInSeconds: number
): number {
  if (timeInSeconds <= 0) return 0
  
  const minutes = timeInSeconds / 60
  const grossWPM = charCount / 5 / minutes
  const netWPM = Math.max(0, grossWPM - errors / minutes)
  
  return Math.round(netWPM)
}

export function calculateRawWPM(
  charCount: number,
  timeInSeconds: number
): number {
  if (timeInSeconds <= 0) return 0
  
  const minutes = timeInSeconds / 60
  const grossWPM = charCount / 5 / minutes
  
  return Math.round(grossWPM)
}

export function calculateAccuracy(
  totalChars: number,
  errors: number
): number {
  if (totalChars <= 0) return 100
  
  const accuracy = ((totalChars - errors) / totalChars) * 100
  return Math.max(0, Math.round(accuracy))
}

export function calculateConsistency(
  wpms: number[]
): number {
  if (wpms.length < 2) return 100
  
  const mean = wpms.reduce((a, b) => a + b, 0) / wpms.length
  const squaredDiffs = wpms.map(wpm => Math.pow(wpm - mean, 2))
  const variance = squaredDiffs.reduce((a, b) => a + b, 0) / wpms.length
  const standardDeviation = Math.sqrt(variance)
  
  // Convert to consistency percentage (lower std dev = higher consistency)
  const consistency = Math.max(0, Math.min(100, 100 - (standardDeviation / mean) * 100))
  
  return Math.round(consistency)
}

export function calculateAllMetrics(
  charCount: number,
  errors: number,
  timeInSeconds: number,
  wpmHistory?: number[]
): TypingMetrics {
  return {
    wpm: calculateWPM(charCount, errors, timeInSeconds),
    rawWpm: calculateRawWPM(charCount, timeInSeconds),
    accuracy: calculateAccuracy(charCount, errors),
    errorCount: errors,
    consistency: wpmHistory ? calculateConsistency(wpmHistory) : 100,
    timeTaken: timeInSeconds,
    totalCharacters: charCount
  }
}
