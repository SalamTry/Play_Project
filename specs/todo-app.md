# Todo App Specification

## Overview

A simple, clean Todo application built with React, Tailwind CSS, and localStorage persistence.

## Features

### 1. Todo CRUD Operations

#### 1.1 Add Todo
- User can type a todo title in an input field
- User can press Enter or click "Add" button to create todo
- New todos start as incomplete
- Input field clears after adding
- Empty todos should not be added (validation)

#### 1.2 View Todos
- Display all todos in a list
- Each todo shows:
  - Checkbox for completion status
  - Title text
  - Due date (if set)
  - Edit button
  - Delete button
- Completed todos should have strikethrough text
- Completed todos can be visually distinguished (e.g., faded)

#### 1.3 Edit Todo
- User can click edit button to enter edit mode
- In edit mode, title becomes an input field
- User can save or cancel edits
- Pressing Enter saves the edit
- Pressing Escape cancels the edit

#### 1.4 Delete Todo
- User can click delete button to remove a todo
- Deletion is immediate (no confirmation needed for MVP)

#### 1.5 Toggle Completion
- User can click checkbox to toggle todo completion
- Completed todos should appear visually different

### 2. Due Dates

#### 2.1 Set Due Date
- Each todo can have an optional due date
- Date picker input for selecting due date
- Can set due date when creating todo
- Can set/change due date when editing todo

#### 2.2 Due Date Display
- Show due date next to todo (formatted nicely, e.g., "Jan 15")
- Overdue todos (past due date, incomplete) should be highlighted in red
- Today's due date should show "Today" instead of date

### 3. Local Storage Persistence

#### 3.1 Save to Storage
- Todos automatically save to localStorage on any change
- Storage key: `todos`

#### 3.2 Load from Storage
- On app load, retrieve todos from localStorage
- If no data exists, start with empty list
- Handle corrupted data gracefully (fall back to empty list)

## Data Model

```typescript
interface Todo {
  id: string;          // Unique identifier (use crypto.randomUUID())
  title: string;       // Todo text
  completed: boolean;  // Completion status
  dueDate: string | null;  // ISO date string or null
  createdAt: string;   // ISO timestamp
}
```

## UI Layout

```
┌─────────────────────────────────────────────┐
│              📝 My Todos                     │
├─────────────────────────────────────────────┤
│ [____________input____________] [date] [Add] │
├─────────────────────────────────────────────┤
│ ☐ Buy groceries          Jan 15  [✎] [🗑]   │
│ ☑ Finish report          Today   [✎] [🗑]   │
│ ☐ Call dentist           Jan 20  [✎] [🗑]   │
│ ☐ OVERDUE: Pay bills     Jan 10  [✎] [🗑]   │
└─────────────────────────────────────────────┘
```

## Styling Requirements

- Clean, modern design using Tailwind CSS
- Responsive (works on mobile)
- Light mode (dark mode optional/stretch)
- Hover states on interactive elements
- Focus states for accessibility

## Component Structure (Suggested)

```
src/
├── App.jsx              # Main app component
├── components/
│   ├── TodoList.jsx     # List of todos
│   ├── TodoItem.jsx     # Single todo item
│   ├── TodoForm.jsx     # Add new todo form
│   └── EditTodoForm.jsx # Edit existing todo
├── hooks/
│   └── useTodos.js      # Custom hook for todo state + localStorage
└── utils/
    └── storage.js       # localStorage helpers
```

## Testing Requirements

Each component and hook should have tests:

1. **TodoForm tests**
   - Renders input and button
   - Calls onAdd with input value when submitted
   - Clears input after submit
   - Does not submit empty todos

2. **TodoItem tests**
   - Renders todo title
   - Shows checkbox with correct state
   - Calls onToggle when checkbox clicked
   - Calls onDelete when delete clicked
   - Shows due date when present
   - Shows "Today" for today's date
   - Shows overdue styling for past dates

3. **TodoList tests**
   - Renders list of todos
   - Shows empty state when no todos

4. **useTodos hook tests**
   - Adds new todos
   - Deletes todos
   - Toggles completion
   - Updates todos
   - Persists to localStorage
   - Loads from localStorage on mount

## Acceptance Criteria

- [ ] Can add a new todo with title
- [ ] Can add a new todo with title and due date
- [ ] Can view all todos in a list
- [ ] Can mark todo as complete/incomplete
- [ ] Can edit todo title
- [ ] Can edit todo due date
- [ ] Can delete todo
- [ ] Todos persist across page refreshes
- [ ] Overdue todos are visually highlighted
- [ ] All tests pass
- [ ] Build succeeds
- [ ] Responsive on mobile
