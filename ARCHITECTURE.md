# Architecture Decisions

> This file captures the WHY behind decisions. All iterations MUST follow these patterns.

## Project Type
React Todo Application with localStorage persistence

## Tech Stack
| Layer | Technology |
|-------|------------|
| Framework | React 19 (via Vite) |
| Styling | Tailwind CSS |
| Testing | Vitest + React Testing Library |
| Build | Vite |

## Quality Commands
```bash
npm run test:run    # All tests must pass
npm run build       # Build must succeed
```

---

## Code Patterns (MUST FOLLOW)

### File Structure
```
src/
├── components/     # React components (*.jsx)
├── hooks/          # Custom React hooks (use*.js)
├── utils/          # Pure utility functions
└── test/           # Test setup
```

### Naming Conventions
| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `TodoItem.jsx` |
| Hooks | camelCase + use | `useTodos.js` |
| Utils | camelCase | `storage.js` |
| Tests | *.test.jsx | `TodoItem.test.jsx` |

### Component Props
```jsx
// Callbacks: on + Verb
onSave, onDelete, onChange, onToggle

// Data: noun
todo, items, user

// NOT: handleSave, todoData
```

### State Management
- Use React hooks (useState, useEffect)
- Custom hooks for shared logic
- localStorage for persistence

---

## Design Tokens
```
Spacing: Tailwind default (p-2, p-4, m-2, etc.)
Colors: Tailwind defaults
  - Primary actions: blue-500
  - Danger/delete: red-500
  - Success/complete: green-500
```

---

## Decision Log

### DECISION-001: localStorage for persistence
- **Date:** 2024-01-15
- **Context:** Need client-side data persistence without backend
- **Decision:** Use localStorage via useTodos hook
- **Consequences:** Data limited to single browser, no sync across devices

### DECISION-002: Tailwind for styling
- **Date:** 2024-01-15
- **Context:** Need fast, consistent styling
- **Decision:** Use Tailwind CSS utility classes
- **Consequences:** No separate CSS files, all styles inline

### DECISION-003: Component test strategy
- **Date:** 2024-01-15
- **Context:** Need reliable tests for Ralph loops
- **Decision:** Test behavior, not implementation; use Testing Library best practices
- **Consequences:** Tests are stable across refactors
