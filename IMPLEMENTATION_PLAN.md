# TTyper - Terminal TypeRacer Implementation Plan

## Overview
A terminal-based TypeRacer game using React with OpenTUI and Convex for real-time functionality.

## Phase 1: Core Functionality Implementation

### Architecture
- **Framework**: React + OpenTUI
- **Backend**: Convex (real-time multiplayer ready)
- **State**: Local React state (Phase 1), Convex integration (Phase 2)

### File Structure
```
src/
├── index.tsx                      # Entry point
├── App.tsx                        # Main app with routing
├── components/
│   ├── screens/
│   │   ├── Splash.tsx             # Animated logo entry
│   │   ├── MainMenu.tsx           # Navigation hub
│   │   ├── SoloPractice.tsx       # Single player mode
│   │   ├── Race.tsx               # Main racing interface
│   │   └── Results.tsx            # Post-game stats
│   ├── ui/
│   │   ├── AnimatedLogo.tsx       # Reusable logo component
│   │   ├── TypingArea.tsx         # Character-level input display
│   │   ├── ProgressBar.tsx        # Animated progress indicator
│   │   ├── Countdown.tsx          # 3-2-1-GO animation
│   │   ├── StatsPanel.tsx         # WPM/accuracy display
│   │   ├── CategorySelector.tsx   # Text category tabs
│   │   ├── ConfigPanel.tsx        # Settings/config screen
│   │   └── Podium.tsx             # Results display
│   └── shared/
│       ├── KeyHint.tsx            # Keyboard shortcuts helper
│       └── ThemeProvider.tsx      # Color theme configuration
├── hooks/
│   ├── useTypingEngine.ts         # Typing logic and state
│   ├── useRaceTimer.ts            # Timer management
│   ├── useWPMCalculator.ts        # WPM/accuracy calculations
│   └── useTheme.ts                # Theme configuration hook
├── types/
│   └── game.ts                    # TypeScript interfaces
├── utils/
│   ├── textCategories.ts          # Extensible category registry
│   ├── textGenerators.ts          # Local text generation
│   ├── wpmCalculator.ts           # Performance calculations
│   └── themes.ts                  # Configurable color schemes
└── convex/
    ├── schema.ts                  # Database schema
    ├── _generated/                # Convex generated code
    └── README.md                  # Setup instructions
```

### Screen Flow
```
STARTUP
  ↓
Splash Screen (1.5s animation)
  ↓
Main Menu
  ├── Solo Practice ──→ Category Select ──→ Race ──→ Results
  ├── Multiplayer (Phase 2)
  ├── Stats (Phase 2)
  └── Settings
```

### Component Specifications

#### Splash Screen (Splash.tsx)
- **Components**: `<ascii-font>`, `<box>`, custom progress bar
- **Animation**: Logo slide-in with easeOutBack, progress bar fill
- **Duration**: 1.5 seconds
- **Transition**: Any key press to menu

#### Main Menu (MainMenu.tsx)
- **Components**: `<select>`, `<box>`, `<text>`
- **Options**:
  - Solo Practice
  - Multiplayer (disabled Phase 1)
  - Stats (disabled Phase 1)
  - Settings
  - Exit
- **Navigation**: Arrow keys + Enter
- **Keyboard**: ESC to exit

#### Solo Practice (SoloPractice.tsx)
- **Components**: `<tab-select>`, `<select>`, `<box>`, `<input>`
- **Configuration**:
  - Text Category (Quotes, Code, Random)
  - Duration (15s, 30s, 60s, Unlimited)
  - Difficulty (Easy, Medium, Hard)
- **Layout**: Centered configuration panel

#### Race Screen (Race.tsx)
- **Components**: Custom `<TypingArea>`, `<ProgressBar>`, `<StatsPanel>`, `<Countdown>`
- **Layout**:
  ```
  ┌─────────────────────────────────────────┐
  │  Race Timer    Countdown                │
  ├─────────────────────────────────────────┤
  │                                         │
  │  [Typing Text Display]                  │
  │                                         │
  ├─────────────────────────────────────────┤
  │  Progress Bar    WPM    Accuracy        │
  └─────────────────────────────────────────┘
  ```
- **Features**:
  - Real-time character highlighting
  - Error tracking with visual feedback
  - WPM/Accuracy calculations
  - Progress bar with animation

#### Results Screen (Results.tsx)
- **Components**: `<box>`, `<text>`, `<Podium>`
- **Display**:
  - Final WPM
  - Accuracy percentage
  - Time taken
  - Error count
  - Consistency score
- **Actions**: Play Again, Change Settings, Main Menu

### Text Generation System

#### Categories (Extensible)
```typescript
interface TextCategory {
  id: string
  name: string
  icon: string
  description: string
  difficulty: 'easy' | 'medium' | 'hard'
  generator: () => string
}
```

#### Implemented Categories
1. **Quotes**
   - Static array of famous quotes
   - Length: 50-150 characters
   - Difficulty: Medium

2. **Code Snippets**
   - JavaScript/TypeScript functions
   - Programming concepts
   - Length: 100-300 characters
   - Difficulty: Hard

3. **Random Words**
   - Lorem ipsum style
   - Common English words
   - Length: Variable
   - Difficulty: Easy

### Color Scheme (Configurable)

#### Default Theme (Tokyo Night Inspired)
```typescript
const defaultTheme = {
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
```

#### Configuration
- Theme stored in React context
- Switchable at runtime
- User preferences persisted (Phase 2)

### Typing Engine

#### State Management
```typescript
interface TypingState {
  targetText: string
  userInput: string
  cursorPosition: number
  errors: number[]
  startTime: number | null
  endTime: number | null
  isComplete: boolean
}
```

#### Features
- Character-by-character validation
- Error tracking (position-based)
- Backspace support
- Real-time WPM calculation
- Accuracy percentage

### WPM Calculation

```typescript
function calculateWPM(
  charCount: number,
  errors: number,
  timeInSeconds: number
): number {
  const minutes = timeInSeconds / 60
  const grossWPM = charCount / 5 / minutes
  const netWPM = grossWPM - (errors / minutes)
  return Math.max(0, Math.round(netWPM))
}

function calculateAccuracy(
  totalChars: number,
  errors: number
): number {
  return Math.round(((totalChars - errors) / totalChars) * 100)
}
```

### Animations (Phase 2 Enhancement)

#### Phase 1 (Basic)
- Progress bar width transitions
- Cursor blinking
- Simple fade transitions

#### Phase 2 (Advanced)
- Splash logo slide-in with easeOutBack
- Countdown scale animation with easeOutElastic
- Results podium staggered reveal
- Error shake effect
- Number count-up animation

### Convex Schema (Ready for Phase 2)

```typescript
// schema.ts
export default defineSchema({
  lobbies: defineTable({
    name: v.string(),
    hostId: v.string(),
    status: v.union(v.literal('waiting'), v.literal('racing'), v.literal('finished')),
    text: v.string(),
    maxPlayers: v.number(),
    createdAt: v.number()
  }),
  
  raceResults: defineTable({
    lobbyId: v.id('lobbies'),
    userId: v.string(),
    wpm: v.number(),
    accuracy: v.number(),
    timeTaken: v.number(),
    errorCount: v.number(),
    finishedAt: v.number()
  })
})
```

### Dependencies

```json
{
  "dependencies": {
    "@opentui/core": "^0.1.75",
    "@opentui/react": "^0.1.75",
    "convex": "^1.0.0",
    "react": "^19.2.3"
  }
}
```

### Implementation Order

1. **Setup & Configuration**
   - Initialize Convex project
   - Configure TypeScript
   - Set up file structure

2. **Core Components**
   - Theme system
   - Splash screen
   - Main menu

3. **Game Logic**
   - Text generators
   - Typing engine hook
   - Race screen

4. **Results & Polish**
   - Results screen
   - Settings/config
   - Sound effects

5. **Testing & Refinement**
   - Terminal responsiveness
   - Edge cases
   - Performance optimization

### Terminal Requirements
- Minimum: 80 columns x 24 rows
- Optimal: 100+ columns x 30+ rows
- Supports: Color terminals (256 colors minimum)

### Sound Effects
- Error: Terminal bell (`\x07`)
- Completion: Double bell sequence
- Navigation: Optional subtle tones

### Keyboard Shortcuts
- **Global**:
  - `ESC`: Go back / Exit
  - `Ctrl+C`: Force exit
  
- **Menu**:
  - `↑/↓`: Navigate
  - `Enter`: Select
  
- **Race**:
  - `Any character`: Type
  - `Backspace`: Delete
  - `ESC`: Quit race
  - `Tab`: Restart (after completion)

### Future Enhancements (Phase 2)
- Multiplayer races via Convex
- Real-time leaderboards
- User statistics persistence
- Achievement system
- Advanced animations
- Custom text upload
- API integration for quotes

---

## Implementation Checklist

- [ ] Convex project initialized
- [ ] File structure created
- [ ] Theme system implemented
- [ ] Splash screen with animation
- [ ] Main menu navigation
- [ ] Solo practice configuration
- [ ] Text generators (3 categories)
- [ ] Typing engine hook
- [ ] Race screen UI
- [ ] Real-time WPM calculation
- [ ] Results screen
- [ ] Settings panel
- [ ] Sound effects
- [ ] Keyboard navigation
- [ ] Terminal responsiveness
- [ ] Error handling
- [ ] Documentation

---

**Start Date**: 2026-02-04  
**Target Completion**: Phase 1 - Same day  
**Status**: Ready to implement
