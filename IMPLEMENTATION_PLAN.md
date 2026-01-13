# Implementation Plan

> Last updated: Reset with stricter acceptance criteria

## Status: IN PROGRESS

## Progress
| Metric | Count |
|--------|-------|
| Total Tasks | 17 |
| Completed | 12 |
| Blocked | 0 |
| Remaining | 5 |

---

## Tasks

### Phase 1: Due Dates & Priority

- [x] **TASK-001:** Extend todo model with dueDate and priority fields
  - Files: `src/hooks/useTodos.js`
  - Tests: `src/hooks/useTodos.test.js`
  - Depends: none
  - **MUST:** Add `dueDate` (ISO string | null) and `priority` ('high' | 'medium' | 'low' | null) to todo object in useTodos hook. Update addTodo and updateTodo to accept these fields.

- [x] **TASK-002:** Update TodoForm with due date and priority inputs
  - Files: `src/components/TodoForm.jsx`
  - Tests: `src/components/TodoForm.test.jsx`
  - Depends: TASK-001
  - **MUST:** Add a priority dropdown (High/Medium/Low/None options) next to the due date picker. Pass priority to onAddTodo.

- [x] **TASK-003:** Update TodoItem to display due date and priority badge
  - Files: `src/components/TodoItem.jsx`
  - Tests: `src/components/TodoItem.test.jsx`
  - Depends: TASK-001
  - **MUST:** Show colored priority badge (rose for high, amber for medium, emerald for low). Show due date with red styling if overdue.

- [x] **TASK-004:** Update EditTodoForm for due date and priority editing
  - Files: `src/components/EditTodoForm.jsx`
  - Tests: `src/components/EditTodoForm.test.jsx`
  - Depends: TASK-001
  - **MUST:** Add priority dropdown and due date picker to edit form. Pre-fill with existing values.

### Phase 2: Filter & Search

- [x] **TASK-005:** Create useFilter hook for filtering and search logic
  - Files: `src/hooks/useFilter.js` (CREATE NEW FILE)
  - Tests: `src/hooks/useFilter.test.js` (CREATE NEW FILE)
  - Depends: none
  - **MUST:** Create new hook that exports { filter, setFilter, searchQuery, setSearchQuery, filterTodos }. Filter options: 'all', 'active', 'completed'. filterTodos function takes todos array and returns filtered results.

- [x] **TASK-006:** Create FilterBar component
  - Files: `src/components/FilterBar.jsx` (CREATE NEW FILE)
  - Tests: `src/components/FilterBar.test.jsx` (CREATE NEW FILE)
  - Depends: TASK-005
  - **MUST:** Create new component with 3 buttons/tabs: All, Active, Completed. Also include priority filter dropdown. Style with Tailwind.

- [x] **TASK-007:** Create SearchBar component
  - Files: `src/components/SearchBar.jsx` (CREATE NEW FILE)
  - Tests: `src/components/SearchBar.test.jsx` (CREATE NEW FILE)
  - Depends: none
  - **MUST:** Create new component with search input, magnifying glass icon, and clear button. Debounce input (300ms).

- [x] **TASK-008:** Integrate filter and search in App.jsx
  - Files: `src/App.jsx`
  - Tests: integration tests
  - Depends: TASK-005, TASK-006, TASK-007
  - **MUST:** Import and use useFilter hook, FilterBar, and SearchBar. Display filtered todos instead of all todos. Add components between header and todo list.

### Phase 3: Dark Mode

- [x] **TASK-009:** Create useTheme hook with localStorage persistence
  - Files: `src/hooks/useTheme.js` (CREATE NEW FILE)
  - Tests: `src/hooks/useTheme.test.js` (CREATE NEW FILE)
  - Depends: none
  - **MUST:** Create new hook that returns { theme, toggleTheme, isDark }. Store in localStorage key 'theme'. Respect prefers-color-scheme on first load.

- [x] **TASK-010:** Create ThemeToggle component
  - Files: `src/components/ThemeToggle.jsx` (CREATE NEW FILE)
  - Tests: `src/components/ThemeToggle.test.jsx` (CREATE NEW FILE)
  - Depends: TASK-009
  - **MUST:** Create new button component with sun/moon icons. Accessible (aria-label). Smooth icon transition.

- [x] **TASK-011:** Configure Tailwind for dark mode
  - Files: `tailwind.config.js`, `src/index.css`
  - Tests: visual inspection
  - Depends: none
  - **MUST:** Set darkMode: 'class' in tailwind config. Add CSS variables for theme colors if needed.

- [x] **TASK-012:** Apply dark mode styles to all components
  - Files: `src/App.jsx`, all components in `src/components/`
  - Tests: visual inspection
  - Depends: TASK-009, TASK-010, TASK-011
  - **MUST:** Add ThemeToggle to App header. Add dark: variants to ALL components (backgrounds, text, borders). App.jsx must add/remove 'dark' class on html element based on theme.

### Phase 4: Animations & Visual Polish

- [ ] **TASK-013:** Install and configure Framer Motion
  - Files: `package.json`, `src/components/AnimatedList.jsx` (CREATE NEW FILE)
  - Tests: `src/components/AnimatedList.test.jsx` (CREATE NEW FILE)
  - Depends: none
  - **MUST:** Run `npm install framer-motion`. Create AnimatedList wrapper component using AnimatePresence and motion.div.

- [ ] **TASK-014:** Add list animations (add/remove/reorder)
  - Files: `src/App.jsx` or `src/components/TodoList.jsx`
  - Tests: existing tests pass
  - Depends: TASK-013
  - **MUST:** Wrap todo items with AnimatedList. Items should fade in on add, fade out on delete, and animate position changes.

- [ ] **TASK-015:** Add micro-interactions (hover, focus, buttons)
  - Files: all components
  - Tests: visual inspection
  - Depends: TASK-013
  - **MUST:** Add hover:scale, active:scale effects to buttons. Add focus-visible rings. Add transition-all to interactive elements.

- [ ] **TASK-016:** Visual polish and color scheme refinement
  - Files: `tailwind.config.js`, all components
  - Tests: visual inspection
  - Depends: TASK-012, TASK-015
  - **MUST:** Use consistent color palette (slate for neutrals, indigo for primary). Add subtle gradients. Improve typography hierarchy.

- [ ] **TASK-017:** Final testing and cleanup
  - Files: all files
  - Tests: run full suite
  - Depends: TASK-016
  - **MUST:** All tests pass. Build succeeds. No console errors. Verify all features work in browser.

---

## Blocked

(none)

---

## Notes

- **IMPORTANT:** Tasks are NOT complete until the specified files actually exist and contain the required functionality
- Priority levels: high (rose), medium (amber), low (emerald)
- Dark mode: use Tailwind 'class' strategy
- Animations: use Framer Motion for list transitions
- See ARCHITECTURE.md for patterns
