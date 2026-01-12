# Agent Guidelines

## Project Context

This is a React Todo application built with Vite, Tailwind CSS, and Vitest.

## Key Files

- `specs/todo-app.md` - Full specification for the app
- `IMPLEMENTATION_PLAN.md` - Current task list and progress

## Commands

```bash
npm run dev        # Start dev server
npm run build      # Production build
npm run test:run   # Run tests once
npm run test       # Run tests in watch mode
npm run lint       # Run linter
```

## Quality Gates

Before committing, ALL must pass:
1. `npm run test:run` - Zero test failures
2. `npm run build` - Build succeeds

## Conventions

### File Structure
```
src/
├── components/    # React components
├── hooks/         # Custom React hooks
├── utils/         # Utility functions
└── test/          # Test setup
```

### Naming
- Components: PascalCase (`TodoItem.jsx`)
- Hooks: camelCase with `use` prefix (`useTodos.js`)
- Utils: camelCase (`storage.js`)
- Tests: Same name + `.test` (`storage.test.js`)

### Testing
- Colocate tests with source OR in `__tests__` folder
- Use React Testing Library best practices
- Test behavior, not implementation details

### Styling
- Use Tailwind CSS classes
- No inline styles
- No separate CSS files (except index.css for Tailwind import)

## Common Issues

1. **Test fails with "document is not defined"**
   - Ensure `jsdom` environment is set in vite.config.js

2. **localStorage not available in tests**
   - jsdom provides localStorage mock

3. **Build fails**
   - Check for TypeScript errors if using TS
   - Ensure all imports are correct
