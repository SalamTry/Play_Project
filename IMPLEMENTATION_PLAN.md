# Implementation Plan

> Last updated: Task 6 completed

## Status: IN PROGRESS

## Task List (Priority Order)

### Phase 1: Foundation

- [x] **Task 1: Create localStorage utilities**
  - Create `src/utils/storage.js`
  - Implement `saveTodos(todos)` function
  - Implement `loadTodos()` function with error handling
  - Write tests in `src/utils/storage.test.js`

- [x] **Task 2: Create useTodos custom hook**
  - Create `src/hooks/useTodos.js`
  - State management for todos array
  - Implement addTodo, deleteTodo, toggleTodo, updateTodo
  - Integrate localStorage (save on change, load on mount)
  - Write tests in `src/hooks/useTodos.test.js`

### Phase 2: Components

- [x] **Task 3: Create TodoForm component**
  - Create `src/components/TodoForm.jsx`
  - Input for title
  - Date picker for optional due date
  - Add button
  - Form validation (no empty todos)
  - Write tests in `src/components/TodoForm.test.jsx`

- [x] **Task 4: Create TodoItem component**
  - Create `src/components/TodoItem.jsx`
  - Display todo with checkbox, title, due date
  - Edit and delete buttons
  - Completion styling (strikethrough)
  - Overdue styling (red highlight)
  - "Today" display for today's due dates
  - Write tests in `src/components/TodoItem.test.jsx`

- [x] **Task 5: Create TodoList component**
  - Create `src/components/TodoList.jsx`
  - Render list of TodoItem components
  - Empty state message
  - Write tests in `src/components/TodoList.test.jsx`

- [x] **Task 6: Create EditTodoForm component**
  - Create `src/components/EditTodoForm.jsx`
  - Edit mode for title and due date
  - Save/Cancel functionality
  - Keyboard shortcuts (Enter to save, Escape to cancel)
  - Write tests in `src/components/EditTodoForm.test.jsx`

### Phase 3: Integration

- [ ] **Task 7: Integrate components in App.jsx**
  - Wire up useTodos hook
  - Connect TodoForm to addTodo
  - Connect TodoList with todos data
  - Handle edit/delete/toggle callbacks
  - Clean up default Vite styling

### Phase 4: Polish

- [ ] **Task 8: Add responsive styling**
  - Mobile-friendly layout
  - Proper spacing and typography
  - Hover/focus states

- [ ] **Task 9: Final testing and cleanup**
  - Run all tests
  - Fix any failing tests
  - Remove unused code
  - Ensure build passes

## Completed Tasks

- **Task 1: Create localStorage utilities** - Added `src/utils/storage.js` with `saveTodos` and `loadTodos` functions, plus comprehensive tests.
- **Task 2: Create useTodos custom hook** - Added `src/hooks/useTodos.js` with addTodo, deleteTodo, toggleTodo, updateTodo functions and localStorage integration. Includes 21 tests.
- **Task 3: Create TodoForm component** - Added `src/components/TodoForm.jsx` with title input, date picker, and form validation. Includes 11 tests.
- **Task 4: Create TodoItem component** - Added `src/components/TodoItem.jsx` with checkbox, title, due date display, edit/delete buttons, completion and overdue styling. Includes 22 tests.
- **Task 5: Create TodoList component** - Added `src/components/TodoList.jsx` to render a list of TodoItem components with empty state handling. Includes 15 tests.
- **Task 6: Create EditTodoForm component** - Added `src/components/EditTodoForm.jsx` with pre-filled inputs for editing title and due date, save/cancel functionality, and keyboard shortcuts (Enter to save, Escape to cancel). Includes 17 tests.

## Notes

- Use `crypto.randomUUID()` for generating todo IDs
- Store dates as ISO strings
- Tailwind CSS for all styling
