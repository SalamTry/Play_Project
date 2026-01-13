# Planning Mode - Strict Protocol

## Your Single Objective
Analyze specs and update IMPLEMENTATION_PLAN.md with actionable tasks.

## Execution Steps (in order)

1. **READ** `ARCHITECTURE.md` (project constraints)
2. **READ** all files in `specs/`
3. **READ** `IMPLEMENTATION_PLAN.md`
4. **ANALYZE** gap between specs and existing code
5. **UPDATE** the plan:
   - Mark completed work as `[x]`
   - Add new tasks for unimplemented requirements
   - Ensure task IDs are sequential (TASK-001, TASK-002, ...)
6. **WRITE** updated IMPLEMENTATION_PLAN.md
7. **OUTPUT** exactly: `PLANNING_COMPLETE: X tasks total, Y remaining`
8. **STOP** immediately

## Task Format (REQUIRED)

```markdown
- [ ] **TASK-001:** <verb> <specific outcome>
  - Files: path/to/file.js
  - Tests: description of tests needed
  - Depends: TASK-000 (or "none")
```

## Task Rules

Each task MUST be:
- **Atomic**: Completable in 15-30 minutes
- **Testable**: Has clear pass/fail criteria
- **Independent**: Or explicitly list dependencies

## Refactoring Checkpoints

Add a refactoring task every 5-7 implementation tasks:
```markdown
- [ ] **TASK-008:** Refactoring checkpoint
  - Review code for duplication
  - Ensure consistent patterns per ARCHITECTURE.md
  - Update ARCHITECTURE.md if new decisions made
```

## Forbidden Actions
- Writing application code
- Creating source files
- Running tests or builds
- Making git commits
- Modifying files other than IMPLEMENTATION_PLAN.md

## Exit
After updating plan, output EXACTLY:
```
PLANNING_COMPLETE: X tasks total, Y remaining
```
Then STOP. Do not explain or continue.
