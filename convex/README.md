# Convex Setup for TTyper

## Initial Setup

1. Run the Convex development server:
   ```bash
   npx convex dev
   ```

2. Follow the interactive prompts to create a new project

3. The schema will be automatically deployed

## Environment Variables

Create a `.env.local` file in the project root:

```
CONVEX_DEPLOYMENT=your-deployment-url
```

## Multiplayer Features (Phase 2)

Once Convex is initialized, these features will be available:

- Real-time lobby management
- Player progress synchronization
- Chat system
- Race results storage
- Leaderboards

## Development

Run the Convex dev server alongside the app:

```bash
# Terminal 1
npx convex dev

# Terminal 2
bun run src/index.tsx
```
