# TTyper - Terminal TypeRacer

[![Version](https://img.shields.io/npm/v/ttyper)](https://www.npmjs.com/package/ttyper)
[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)
[![Build Status](https://github.com/divquan/ttyper/workflows/CI/badge.svg)](https://github.com/divquan/ttyper/actions)

A terminal-based TypeRacer game built with React, OpenTUI, and Convex.

![TTyper Screenshot](https://via.placeholder.com/800x400/1a1a1a/ffffff?text=TTyper+Screenshot+Coming+Soon)

## Features

## Features

- 🎮 **Solo Practice Mode** - Race against the clock with different text categories
- 📝 **Multiple Text Categories** - Quotes, Code snippets, and Random words
- 🎨 **Configurable Themes** - Tokyo Night (default), Dark, and Light themes
- ⚡ **Real-time WPM Calculation** - Live stats as you type
- 🏆 **Detailed Results** - WPM, accuracy, consistency, and error tracking
- 🔔 **Sound Effects** - Terminal bell for errors and completion
- 🖥️ **Responsive Design** - Works in terminals as small as 80x24

## Installation

### Via NPM (Recommended)

```bash
# Install globally
npm install -g ttyper

# Or run without installing
npx ttyper
```

### Via Source

```bash
# Clone the repository
git clone https://github.com/divquan/ttyper.git
cd ttyper

# Install dependencies
bun install

# Run the game
bun run dev
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

### Phase 2 ✅ (Implemented)
- ✅ Multiplayer races via Convex
- ✅ Real-time lobby system
- ✅ Quick play matchmaking
- User statistics persistence (Coming Soon)
- Chat system (Coming Soon)
- Spectator mode (Coming Soon)

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

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details on how to get started.

## Code of Conduct

This project adheres to a [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for a history of changes.

## License

This project is licensed under the GNU General Public License v3.0 - see the [LICENSE](LICENSE) file for details.
