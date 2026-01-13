# Play Project

## Purpose

This project serves as a testing ground for exploring the **Ralph way** to interact with Claude Code.

The Ralph method is an approach to working with Claude Code that emphasizes a particular workflow and interaction style for building software projects efficiently.

---

## Ralph v3: Key Discoveries

### Two-Phase Build System

The biggest innovation in Ralph v3 is the **two-phase build system** that combines development and code review in a single iteration:

```
PHASE 1: DEVELOPER
  - Select story from prd.json
  - Implement to meet acceptance criteria
  - Run tests and build validation

PHASE 2: STRICT SENIOR REVIEWER
  - Run visual checks
  - Code review checklist (7 categories)
  - Fix issues and re-review (max 3 cycles)

PHASE 3: COMPLETE
  - Commit, update prd.json, log progress
```

This approach eliminates the need for separate review iterations, saving context and producing higher quality code in fewer cycles.

### Playwriter-Style Visual Testing

Inspired by [playwriter](https://github.com/remorses/playwriter), we implemented a lightweight visual testing approach that works within the agent's context:

- **Vimium-style labels** (a, b, c...) overlaid on interactive elements
- **Accessibility snapshots** for semantic verification
- **Element mapping** with bounds for layout checks
- **AI-optimized summary** in markdown format

Run visual checks:
```bash
npm run visual-check
```

Outputs:
- `visual-report/summary.md` - AI-readable summary
- `visual-report/*-labeled.png` - Screenshots with Vimium labels
- `visual-report/*-elements.json` - Element data with bounds

### JSON-Based PRD Format

User stories are defined in `prd.json` with:
- Unique ID (US-XXX)
- Acceptance criteria (testable requirements)
- Target files and test files
- Pass/fail status for iteration tracking

Example:
```json
{
  "id": "US-001",
  "title": "Add tags field to todo model",
  "acceptance": [
    "useTodos hook accepts tags array in addTodo",
    "Each tag has id, name, and color properties"
  ],
  "files": ["src/hooks/useTodos.js"],
  "tests": ["src/hooks/useTodos.test.js"],
  "passes": true
}
```

### Code Review Checklist

Seven categories of review criteria integrated into the build phase:

1. **Correctness** - Acceptance criteria, edge cases
2. **Code Quality** - No debug code, single-purpose functions
3. **React Best Practices** - Memoization, effects, keys
4. **Security** - XSS prevention, input sanitization
5. **Performance** - Memory leaks, expensive operations
6. **Accessibility** - Roles, labels, focus management
7. **Testing** - Happy path, edge cases, readability

---

## Results

### Phase 1: Foundation
- 14 user stories
- 204 tests passing
- Basic Todo App with CRUD, filters, search, priorities

### Phase 2: Advanced Features
- 24 user stories
- 377 tests passing
- 6 major features:
  - **Categories/Tags** - Colored tag pills, filtering
  - **Subtasks** - Progress tracking, inline editing
  - **Keyboard Shortcuts** - 10+ shortcuts with help modal
  - **Drag & Drop** - Custom ordering with dnd-kit
  - **Bulk Actions** - Multi-select with toolbar
  - **Sorting Options** - 5 sort modes with persistence

---

## Running Ralph

### Plan Mode
```bash
# Start planning session
cat PROMPT_plan.md | pbcopy
# Paste into Claude Code
```

### Build Mode
```bash
# Start build session
cat PROMPT_build.md | pbcopy
# Paste into Claude Code
```

### Monitor Progress
```bash
./monitor.sh
```

---

## Tech Stack

- React 19 + Vite
- Tailwind CSS
- Vitest + React Testing Library
- Framer Motion (animations)
- @dnd-kit (drag and drop)
- Playwright (visual testing)

---

## Key Files

| File | Purpose |
|------|---------|
| `PROMPT_plan.md` | Plan mode instructions |
| `PROMPT_build.md` | Build mode with code review |
| `prd.json` | User stories and status |
| `progress.txt` | Execution log |
| `SPEC.md` | Feature specifications |
| `scripts/visual-check.js` | Playwriter-style testing |
| `monitor.sh` | Progress monitoring |

---

## Learnings

Key patterns discovered during development:

1. **useCallback for memoized children** - Event handlers passed to React.memo components need useCallback
2. **Cleanup in useEffect** - Always return cleanup function for event listeners
3. **Stable keys in lists** - Use item IDs, not array indices
4. **Accessibility first** - aria-labels and roles prevent rework
5. **Test edge cases early** - Empty states, null values, boundary conditions
