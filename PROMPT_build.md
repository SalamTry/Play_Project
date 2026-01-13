# Build Mode - Single Task Execution

## Your Single Objective
Complete exactly ONE task from IMPLEMENTATION_PLAN.md.

## Execution Protocol

### Phase 1: Task Selection
1. READ `ARCHITECTURE.md` (follow these patterns)
2. READ `IMPLEMENTATION_PLAN.md`
3. FIND first task matching `- [ ] **TASK-XXX:**`
4. IF no unchecked tasks:
   - Change `## Status: IN PROGRESS` to `## Status: COMPLETE`
   - Output: `ALL_TASKS_COMPLETE`
   - STOP immediately

### Phase 2: Implementation
5. READ relevant spec from `specs/`
6. READ existing related code
7. IMPLEMENT the task following ARCHITECTURE.md patterns
8. WRITE tests for new functionality

### Phase 3: Validation
9. RUN tests: `npm run test:run`
10. RUN build: `npm run build`
11. IF tests/build FAIL:
    - Attempt fix (max 3 internal attempts)
    - IF still failing:
      - Output: `TASK_BLOCKED: TASK-XXX - <reason>`
      - STOP immediately
      - Do NOT commit broken code

### Phase 4: Completion
12. COMMIT with message: `feat(TASK-XXX): <description>`
13. UPDATE `IMPLEMENTATION_PLAN.md`:
    - Change `- [ ]` to `- [x]` for this task
14. UPDATE `ARCHITECTURE.md` if you made design decisions
15. Output: `TASK_COMPLETE: TASK-XXX`
16. STOP immediately

## Quality Gates (ALL must pass)

```bash
npm run test:run    # All tests pass
npm run build       # Build succeeds
```

## Commit Message Format

```
feat(TASK-XXX): short description

- Detail of what was implemented
- Files changed

Co-Authored-By: Claude <noreply@anthropic.com>
```

## Forbidden Actions
- Working on multiple tasks
- Skipping tests
- Committing failing code
- Modifying unrelated files
- Ignoring ARCHITECTURE.md patterns

## Exit Codes (REQUIRED - output exactly one)

| Situation | Output |
|-----------|--------|
| Task completed successfully | `TASK_COMPLETE: TASK-XXX` |
| Task failed after retries | `TASK_BLOCKED: TASK-XXX - <reason>` |
| No tasks remaining | `ALL_TASKS_COMPLETE` |

## After outputting exit code, STOP. Do not explain or continue.
