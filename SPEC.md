# Todo App Enhancement Spec

## Overview
Enhance the existing React Todo App with new features.

## Features

### 1. Due Dates & Priority
- Add due date picker to TodoForm
- Add priority dropdown (High/Medium/Low/None) to TodoForm
- Display due date on TodoItem (red if overdue)
- Display priority badge on TodoItem (rose=high, amber=medium, emerald=low)
- Allow editing due date and priority in EditTodoForm

### 2. Filter & Search
- Create FilterBar with tabs: All / Active / Completed
- Create SearchBar with text input and debounce
- Filter todos by status and search query
- Integrate in App.jsx

### 3. Dark Mode
- Create useTheme hook with localStorage persistence
- Respect system preference on first load
- Create ThemeToggle button with sun/moon icons
- Apply dark: variants to all components

### 4. Animations
- Install Framer Motion
- Add fade in/out animations for todo items
- Add hover/focus micro-interactions on buttons
- Polish overall visual design

## Tech Stack
- React 19 + Vite
- Tailwind CSS
- Vitest + React Testing Library
- Framer Motion (to be added)

## Quality Gates
```bash
npm run test:run   # Must pass
npm run build      # Must succeed
```
