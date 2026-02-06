# Contributing to TTyper

Thank you for your interest in contributing to TTyper! We welcome contributions from the community.

## Prerequisites

- [Bun](https://bun.sh/) >= 1.0.0
- [Node.js](https://nodejs.org/) >= 18.0.0 (for Convex CLI)
- A [Convex](https://convex.dev/) account (free tier works fine)

## Setting Up Development Environment

1. **Fork the repository** on GitHub

2. **Clone your fork:**
   ```bash
   git clone https://github.com/your-username/ttyper.git
   cd ttyper
   ```

3. **Install dependencies:**
   ```bash
   bun install
   ```

4. **Set up Convex:**
   ```bash
   npx convex dev
   ```
   This will create a `.env` file with your Convex deployment URL.

5. **Start the development server:**
   ```bash
   bun run dev
   ```

## Development Workflow

### Branch Naming
- `feature/description` - New features
- `fix/description` - Bug fixes
- `docs/description` - Documentation updates
- `refactor/description` - Code refactoring

### Commit Style
We follow conventional commits:
```
feat: add new typing mode
fix: resolve race condition in multiplayer
docs: update README with new features
refactor: simplify lobby state management
```

### Pull Request Process

1. **Before submitting:**
   - Run type checking: `bun run typecheck`
   - Test your changes thoroughly
   - Update documentation if needed

2. **PR Description should include:**
   - What changes were made
   - Why the changes were made
   - How to test the changes
   - Screenshots (if applicable)

3. **Review Process:**
   - All PRs require review before merging
   - Address review feedback promptly
   - Keep discussions constructive

## Code Style Guidelines

### TypeScript
- Use strict TypeScript settings
- Avoid `any` types when possible
- Add proper type annotations to functions

### React Components
- Use functional components with hooks
- Keep components focused and modular
- Use meaningful component and variable names

### File Organization
- Components: `src/components/`
- Hooks: `src/hooks/`
- Utilities: `src/utils/`
- Types: `src/types/`

## Testing

Currently, we rely on manual testing. When running the app:
- Test solo practice mode
- Test multiplayer functionality
- Verify keyboard navigation works
- Check that the UI renders correctly

## Reporting Issues

When reporting bugs, please include:
- Operating system and version
- Bun version (`bun --version`)
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots (if applicable)

## Questions?

Feel free to:
- Open an issue for questions
- Join discussions in existing issues
- Reach out to maintainers

## License

By contributing to TTyper, you agree that your contributions will be licensed under the GPL-3.0 License.
