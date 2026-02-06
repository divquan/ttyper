// Entry point for TTyper

import { createCliRenderer } from '@opentui/core'
import { createRoot } from '@opentui/react'
import { App } from './App.js'

const renderer = await createCliRenderer({
  exitOnCtrlC: true
})

createRoot(renderer).render(<App />)
