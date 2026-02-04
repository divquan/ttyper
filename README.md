# TTyper - Terminal TypeRacer

A terminal-based TypeRacer game built with React, OpenTUI, and Convex.

## Features

- 🎮 **Solo Practice Mode** - Race against the clock with different text categories
- 📝 **Multiple Text Categories** - Quotes, Code snippets, and Random words
- 🎨 **Configurable Themes** - Tokyo Night (default), Dark, and Light themes
- ⚡ **Real-time WPM Calculation** - Live stats as you type
- 🏆 **Detailed Results** - WPM, accuracy, consistency, and error tracking
- 🔔 **Sound Effects** - Terminal bell for errors and completion
- 🖥️ **Responsive Design** - Works in terminals as small as 80x24

## Quick Start

```bash
# Install dependencies
bun install

# Run the game
bun run src/index.tsx
```

## Gameplay

1. **Splash Screen** - Watch the animated logo and progress bar
2. **Main Menu** - Navigate with arrow keys, Enter to select
3. **Solo Practice** - Configure your race:
   - Text category (Quotes, Code, Random Words)
   - Duration (15s, 30s, 60s, Unlimited)
   - Difficulty (Easy, Medium, Hard)
4. **Race** - Type the displayed text as fast and accurately as possible
   - Green = Correct
   - Red = Error
   - Yellow = Current position
5. **Results** - View your performance stats
   - Press `R` to race again
   - Press `M` for main menu

## Controls

- **Navigation**: Arrow keys (↑↓), Enter to select
- **Typing**: Any printable characters, Backspace to delete
- **Quit Race**: ESC
- **Exit App**: ESC from menu, or Ctrl+C

## Convex Setup (Multiplayer Phase 2)

To enable multiplayer features:

1. Run Convex initialization:
   ```bash
   npx convex dev
   ```

2. Follow the prompts to create a new project

3. The schema will be automatically deployed

4. Multiplayer features will be available in Phase 2

## Project Structure

```
src/
├── components/
│   ├── screens/        # Screen components (Splash, Menu, Race, etc.)
│   ├── ui/            # Reusable UI components
│   └── shared/        # Shared components (ThemeProvider, etc.)
├── hooks/             # Custom React hooks
├── types/             # TypeScript type definitions
├── utils/             # Utility functions
convex/
├── schema.ts          # Convex database schema
└── README.md          # Convex setup instructions
```

## Customization

### Adding New Text Categories

Edit `src/utils/textGenerators.ts`:

```typescript
export const textCategories: TextCategory[] = [
  // ... existing categories
  {
    id: 'poetry',
    name: 'Poetry',
    icon: '📜',
    description: 'Classic poetry excerpts',
    difficulty: 'medium',
    generator: generatePoetry
  }
]
```

### Adding New Themes

Edit `src/utils/themes.ts`:

```typescript
export const myTheme: GameTheme = {
  background: '#000000',
  foreground: '#ffffff',
  // ... other colors
}

export const themes = {
  // ... existing themes
  myTheme: myTheme
}
```

## Roadmap

### Phase 1 (Current) ✅
- Solo practice mode
- Multiple text categories
- Configurable themes
- WPM/accuracy tracking
- Sound effects

### Phase 2 (Coming Soon)
- Multiplayer races via Convex
- Real-time leaderboards
- User statistics persistence
- Chat system
- Spectator mode

### Phase 3 (Future)
- Achievement system
- Custom text upload
- API integration for quotes
- Advanced animations
- Sound pack options

## Built With

- [OpenTUI](https://github.com/anomalyco/opentui) - Terminal UI framework
- [React](https://react.dev) - UI library
- [Convex](https://convex.dev) - Backend and real-time sync
- [Bun](https://bun.sh) - JavaScript runtime

## License

MIT
