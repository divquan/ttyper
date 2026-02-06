// Entry point for TTyper

import { createCliRenderer } from '@opentui/core'
import { createRoot } from '@opentui/react'
import { ConvexReactClient } from 'convex/react'
import { ConvexProvider } from 'convex/react'  
import { App } from './App.js'

// Initialize Convex client
const convexUrl = process.env.CONVEX_URL 

const renderer = await createCliRenderer({
  exitOnCtrlC: true
})

createRoot(renderer).render(<App />)
