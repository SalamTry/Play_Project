# Todo App Phase 2 Spec

## Overview
Enhance the Todo App with productivity features and UX polish.

## Features

### 1. Categories/Tags
- Add tags field to todo model (array of tag objects)
- Create TagInput component for adding/removing tags
- Each tag has: id, name, color
- Display tags as colored pills on TodoItem
- Predefined color palette (8 colors)
- Tags persist to localStorage
- Filter todos by tag (multi-select)

### 2. Subtasks
- Add subtasks field to todo model (array of subtask objects)
- Each subtask has: id, text, completed
- Create SubtaskList component with checkboxes
- Show subtask progress on TodoItem (e.g., "2/5")
- Add/remove subtasks in EditTodoForm
- Parent todo auto-completes when all subtasks done (optional)

### 3. Keyboard Shortcuts
- Create useKeyboardShortcuts hook
- Shortcuts:
  - `Ctrl/Cmd + N`: Focus new todo input
  - `Ctrl/Cmd + F`: Focus search input
  - `Ctrl/Cmd + 1/2/3`: Switch filter tabs
  - `Escape`: Clear selection / close edit form
  - `Delete/Backspace`: Delete selected todo
- Show keyboard shortcut hints in UI
- Create KeyboardShortcutsHelp modal (toggle with `?`)

### 4. Drag & Drop Reordering
- Install @dnd-kit/core and @dnd-kit/sortable
- Add order/position field to todo model
- Create DraggableTodoItem wrapper
- Visual feedback during drag (shadow, scale)
- Persist order to localStorage
- Respect current sort when not in custom order mode

### 5. Bulk Actions
- Add selection state (Set of selected todo IDs)
- Create SelectionToolbar component
- Checkbox on each TodoItem for selection
- "Select All" / "Deselect All" buttons
- Bulk actions: Complete, Delete, Set Priority, Add Tag
- Visual highlight for selected items
- Clear selection after bulk action

### 6. Sorting Options
- Create useSorting hook
- Sort options:
  - Custom (drag & drop order)
  - Date Created (newest/oldest)
  - Priority (high to low / low to high)
  - Alphabetical (A-Z / Z-A)
  - Due Date (if exists)
- Create SortDropdown component
- Persist sort preference to localStorage

## Tech Stack
- React 19 + Vite
- Tailwind CSS
- Vitest + React Testing Library
- Framer Motion
- @dnd-kit/core, @dnd-kit/sortable (to be added)

## Quality Gates
```bash
npm run test:run   # Must pass
npm run build      # Must succeed
```
