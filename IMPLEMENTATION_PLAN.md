# Implementation Plan

> Last updated: Initial creation

## Status: IN PROGRESS

## Task List (Priority Order)

### Phase 1: Foundation

- [ ] **Task 1: Create localStorage utilities**
  - Create `src/utils/storage.js`
  - Implement `saveTodos(todos)` function
  - Implement `loadTodos()` function with error handling
  - Write tests in `src/utils/storage.test.js`

- [ ] **Task 2: Create useTodos custom hook**
  - Create `src/hooks/useTodos.js`
  - State management for todos array
  - Implement addTodo, deleteTodo, toggleTodo, updateTodo
  - Integrate localStorage (save on change, load on mount)
  - Write tests in `src/hooks/useTodos.test.js`

### Phase 2: Components

- [ ] **Task 3: Create TodoForm component**
  - Create `src/components/TodoForm.jsx`
  - Input for title
  - Date picker for optional due date
  - Add button
  - Form validation (no empty todos)
  - Write tests in `src/components/TodoForm.test.jsx`

- [ ] **Task 4: Create TodoItem component**
  - Create `src/components/TodoItem.jsx`
  - Display todo with checkbox, title, due date
  - Edit and delete buttons
  - Completion styling (strikethrough)
  - Overdue styling (red highlight)
  - "Today" display for today's due dates
  - Write tests in `src/components/TodoItem.test.jsx`

- [ ] **Task 5: Create TodoList component**
  - Create `src/components/TodoList.jsx`
  - Render list of TodoItem components
  - Empty state message
  - Write tests in `src/components/TodoList.test.jsx`

- [ ] **Task 6: Create EditTodoForm component**
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

(Tasks will be moved here when complete)

## Notes

- Use `crypto.randomUUID()` for generating todo IDs
- Store dates as ISO strings
- Tailwind CSS for all styling
