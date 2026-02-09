# AGENTS.md - Development Guidelines for TTyper

This file contains guidelines for agentic coding agents working on the TTyper repository.

## Development Commands

### Core Commands
- **Development Server**: `bun run dev` (starts dev server with watch mode)
- **Type Checking**: `bun run typecheck` (strict TypeScript validation)
- **Build**: `bun run build` (creates Node.js bundle in `dist/`)
- **Compile**: `bun run compile` (creates standalone executable)
- **Prepublish**: `bun run prepublishOnly` (runs build before publishing)

### Testing
Currently, no automated test framework is configured. Manual testing is required:
- Test solo practice mode thoroughly
- Test multiplayer functionality
- Verify keyboard navigation works
- Check UI renders correctly in terminal

### CI/CD
- GitHub Actions run `bun run typecheck` and `bun run build` on push/PR to main/develop
- Ensure all changes pass type checking before committing

## Code Style Guidelines

### Import Patterns
```typescript
// React imports
import { useState, useCallback, useEffect, useRef } from 'react'
import { useKeyboard, useRenderer } from '@opentui/react'

// Local imports (always use .js extension)
import { ThemeProvider } from './components/shared/ThemeProvider.js'
import { Splash } from './components/screens/Splash.js'
import type { ScreenState, RaceConfig } from '../types/game.js'
```

### Component Structure
- Use functional components with hooks
- Keep components focused and modular
- Export components as named exports
- Use TypeScript interfaces for props

```typescript
interface ComponentProps {
  onStart: (config: RaceConfig) => void
  onBack: () => void
}

export function ComponentName({ onStart, onBack }: ComponentProps) {
  // Component logic
  return <JSX />
}
```

### TypeScript Conventions
- Strict mode enabled - avoid `any` types when possible
- Use explicit type annotations for function parameters and return types
- Prefer interface over type for object shapes
- Use const assertions for literal types: `'easy' as const`

### File Organization
```
src/
├── components/
│   ├── screens/     # Screen-level components
│   ├── shared/      # Shared components (ThemeProvider, KeyHint)
│   └── ui/          # Reusable UI components
├── hooks/            # Custom React hooks
├── types/            # TypeScript type definitions
├── utils/            # Utility functions
└── App.tsx           # Main application component
```

### Naming Conventions
- **Components**: PascalCase (e.g., `SoloPractice`, `MultiplayerRace`)
- **Functions/Variables**: camelCase (e.g., `handleStartRace`, `selectedCategory`)
- **Types/Interfaces**: PascalCase with descriptive names (e.g., `RaceConfig`, `LobbyPlayer`)
- **Files**: PascalCase for components (e.g., `SoloPractice.tsx`), camelCase for utilities

### Error Handling
- Use try-catch blocks for async operations
- Provide meaningful error messages
- Log errors appropriately without exposing sensitive information

```typescript
const handleOperation = useCallback(async () => {
  try {
    const result = await convex.operation()
    if (result.success) {
      // Handle success
    } else {
      setMpError(result.error || 'Operation failed')
    }
  } catch (err) {
    setMpError('Error: ' + String(err))
  }
}, [convex])
```

### State Management Patterns
- Use React hooks for local state (`useState`, `useReducer`)
- Use refs for mutable values that don't trigger re-renders
- Use callback hooks for event handlers to prevent re-renders

```typescript
const [screen, setScreen] = useState<ScreenState>('splash')
const [raceConfig, setRaceConfig] = useState<RaceConfig | null>(null)
const racePollRef = useRef<NodeJS.Timeout | null>(null)

const handleStartRace = useCallback((config: RaceConfig) => {
  setRaceConfig(config)
  setScreen('race')
}, [])
```

### OpenTUI Integration
- Use `@opentui/react` hooks for terminal UI
- Follow OpenTUI component patterns (box, text, etc.)
- Handle keyboard events with `useKeyboard` hook
- Use theme context for consistent styling

```typescript
useKeyboard((key) => {
  if (key.name === 'escape') {
    onBack()
    return
  }
  
  if (key.name === 'enter') {
    handleStart()
    return
  }
})
```

### Theme System
- Use `ThemeProvider` for theme context
- Access theme via `useTheme()` hook
- Use theme properties for consistent styling
- Support multiple themes (Tokyo Night, Dark, Light)

```typescript
const { theme } = useTheme()
return (
  <box 
    backgroundColor={theme.background}
    borderColor={theme.primary}
  >
    <text fg={theme.primary}>Content</text>
  </box>
)
```

### Multiplayer Integration
- Use Convex for real-time multiplayer functionality
- Follow Convex pattern: `convex.operationName()`
- Handle subscription cleanup properly
- Use optimistic updates for better UX

```typescript
const startLobbySubscription = useCallback((id: string) => {
  // Stop any existing subscription
  if (lobbyUnsubscribeRef.current) {
    lobbyUnsubscribeRef.current()
    lobbyUnsubscribeRef.current = null
  }
  
  // Start new subscription
  const unsubscribe = convex.watchLobby(id, (data: any) => {
    // Handle updates
  }, (err: any) => {
    console.error('Lobby subscription error:', err)
  })
  
  lobbyUnsubscribeRef.current = unsubscribe
}, [convex])
```

## Development Workflow

### Branch Naming
- `feature/description` - New features
- `fix/description` - Bug fixes
- `docs/description` - Documentation updates
- `refactor/description` - Code refactoring

### Commit Style
Follow conventional commits:
```
feat: add new typing mode
fix: resolve race condition in multiplayer
docs: update README with new features
refactor: simplify lobby state management
```

### Before Committing
1. Run `bun run typecheck` to ensure type safety
2. Test changes manually (no automated tests currently)
3. Update documentation if needed
4. Follow code style guidelines above

## Architecture Notes

### Screen-Based Navigation
- Each game state is a separate screen component
- `App.tsx` manages screen transitions
- Use state machine pattern for screen management

### State Management
- Local state in components with React hooks
- Convex for real-time multiplayer state
- Centralized state in `App.tsx` for global data

### Terminal UI Considerations
- Minimum terminal size: 80x24
- Responsive design for different terminal sizes
- Keyboard-first navigation
- Multiple theme support

### Performance
- Use `useCallback` and `useMemo` for expensive operations
- Optimize re-renders with proper dependency arrays
- Clean up subscriptions and timeouts in `useEffect` cleanup

## Common Patterns

### Keyboard Navigation
```typescript
useKeyboard((key) => {
  // Global shortcuts
  if (key.ctrl && key.name === 'c') {
    handleExit()
    return
  }
  
  // Screen-specific handling
  if (screen === 'results') {
    if (key.name === 'r') handlePlayAgain()
    if (key.name === 'm') handleMainMenu()
  }
})
```

### Type-Safe Configuration
```typescript
const config: RaceConfig = {
  category: textCategories[selectedCategory]!.id,
  duration: durations[selectedDuration]!.value,
  difficulty: difficulties[selectedDifficulty]!.value,
}
```

### Error Boundaries
```typescript
const handleOperation = useCallback(async () => {
  try {
    const result = await convex.operation()
    if (result.success) {
      // Handle success
    } else {
      setMpError(result.error || 'Operation failed')
    }
  } catch (err) {
    setMpError('Error: ' + String(err))
  }
}, [convex])
```

## Notes for Agents

- This is a terminal application, not a web app
- Focus on keyboard navigation and terminal UI patterns
- Multiplayer functionality requires Convex backend
- No automated tests exist yet - manual testing is required
- Always run type checking before committing changes
- Follow the existing code patterns and conventions

## Common Patterns

### Keyboard Navigation
```typescript
useKeyboard((key) => {
  // Global shortcuts
  if (key.ctrl && key.name === 'c') {
    handleExit()
    return
  }
  
  // Screen-specific handling
  if (screen === 'results') {
    if (key.name === 'r') handlePlayAgain()
    if (key.name === 'm') handleMainMenu()
  }
})
```

### Type-Safe Configuration
```typescript
const config: RaceConfig = {
  category: textCategories[selectedCategory]!.id,
  duration: durations[selectedDuration]!.value,
  difficulty: difficulties[selectedDifficulty]!.value,
}
```

### Error Boundaries
```typescript
const handleOperation = useCallback(async () => {
  try {
    const result = await convex.operation()
    if (result.success) {
      // Handle success
    } else {
      setMpError(result.error || 'Operation failed')
    }
  } catch (err) {
    setMpError('Error: ' + String(err))
  }
}, [convex])
```

## Notes for Agents

- This is a terminal application, not a web app
- Focus on keyboard navigation and terminal UI patterns
- Multiplayer functionality requires Convex backend
- No automated tests exist yet - manual testing is required
- Always run type checking before committing changes
- Follow the existing code patterns and conventions

## Common Patterns

### Keyboard Navigation
```typescript
useKeyboard((key) => {
  // Global shortcuts
  if (key.ctrl && key.name === 'c') {
    handleExit()
    return
  }
  
  // Screen-specific handling
  if (screen === 'results') {
    if (key.name === 'r') handlePlayAgain()
    if (key.name === 'm') handleMainMenu()
  }
})
```

### Type-Safe Configuration
```typescript
const config: RaceConfig = {
  category: textCategories[selectedCategory]!.id,
  duration: durations[selectedDuration]!.value,
  difficulty: difficulties[selectedDifficulty]!.value,
}
```

### Error Boundaries
```typescript
const handleOperation = useCallback(async () => {
  try {
    const result = await convex.operation()
    if (result.success) {
      // Handle success
    } else {
      setMpError(result.error || 'Operation failed')
    }
  } catch (err) {
    setMpError('Error: ' + String(err))
  }
}, [convex])
```

## Notes for Agents

- This is a terminal application, not a web app
- Focus on keyboard navigation and terminal UI patterns
- Multiplayer functionality requires Convex backend
- No automated tests exist yet - manual testing is required
- Always run type checking before committing changes
- Follow the existing code patterns and conventions

## Notes for Agents

- This is a terminal application, not a web app
- Focus on keyboard navigation and terminal UI patterns
- Multiplayer functionality requires Convex backend
- No automated tests exist yet - manual testing is required
- Always run type checking before committing changes
- Follow the existing code patterns and conventions