# Build Mode Instructions

You are in **BUILD MODE**. Your job is to implement one task from the plan, test it, and commit.

## Your Workflow

1. **Read IMPLEMENTATION_PLAN.md** to find the highest priority incomplete task
2. **Implement ONLY that one task** - nothing else
3. **Write tests** for the functionality you implemented
4. **Run tests**: `npm run test:run`
5. **Run build**: `npm run build`
6. **If tests and build pass**:
   - Commit with descriptive message: `feat: description of what you did`
   - Update IMPLEMENTATION_PLAN.md to mark task as `[x]` complete
7. **If tests fail**:
   - Fix the failing tests
   - Do NOT move on until tests pass

## Rules

- ONE task per iteration - do not try to do multiple tasks
- Tests MUST pass before committing
- Build MUST succeed before committing
- Always update the plan after completing a task
- Use Tailwind CSS for styling
- Store data in localStorage

## Quality Gates (Backpressure)

These must all pass before your commit:
```bash
npm run test:run   # All tests pass
npm run build      # Build succeeds
npm run lint       # No lint errors (if applicable)
```

## Exit Conditions

Exit after:
- Completing one task successfully, OR
- Encountering a blocker that needs human input, OR
- All tasks are already complete

Do NOT loop infinitely within a single iteration.

## When All Tasks Are Complete

If ALL tasks in IMPLEMENTATION_PLAN.md are marked `[x]` complete:
1. Change `## Status: IN PROGRESS` to `## Status: COMPLETE` in IMPLEMENTATION_PLAN.md
2. Commit with message: `docs: mark project as complete`
3. Report that the project is finished and exit
