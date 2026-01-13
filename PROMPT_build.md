# Build Mode

## Your Job
Complete ONE user story from prd.json with high-quality, production-ready code.

You will operate in **two phases**:
1. **DEVELOPER PHASE**: Implement the story
2. **REVIEWER PHASE**: Review as a strict senior engineer

---

## PHASE 1: DEVELOPER

### 1.1 Select Story
- READ `prd.json`
- FIND first story where `"passes": false`
- IF all stories pass: output `ALL_STORIES_COMPLETE` and STOP

### 1.2 Implement
- READ existing code in story's files
- IMPLEMENT to meet ALL acceptance criteria
- WRITE tests if story has test files listed
- Follow existing code patterns

### 1.3 Validate

```bash
# Run tests
npm run test:run

# Run build
npm run build
```

IF any fails:
- Try to fix (max 3 attempts)
- IF still failing: go to BLOCKED state (see Exit Codes)

---

## PHASE 2: STRICT SENIOR REVIEWER

Now switch mindset. You are a **strict senior engineer** doing a thorough code review.
Your job is to find EVERY issue before this code ships.

### 2.1 Visual Check

Run the visual check script:

```bash
npm run visual-check
```

Then READ `visual-report/summary.md` to review:
- Screenshots for visual correctness
- Accessibility tree for proper semantics
- Interactive elements are keyboard accessible

### 2.2 Code Review Checklist

Go through the code you just wrote and check EACH item:

**CORRECTNESS**
- [ ] All acceptance criteria are met (verify each one)
- [ ] Edge cases handled (empty arrays, null, undefined)
- [ ] No hardcoded values that should be configurable
- [ ] Error states are handled gracefully

**CODE QUALITY**
- [ ] No console.log or debug code left behind
- [ ] No commented-out code
- [ ] Functions are single-purpose (< 30 lines ideal)
- [ ] Variables have clear, descriptive names
- [ ] No code duplication (DRY)
- [ ] No unnecessary complexity

**REACT BEST PRACTICES**
- [ ] Components properly memoized where needed (useMemo, useCallback, React.memo)
- [ ] useEffect has correct dependency array
- [ ] No state updates in render
- [ ] Event handlers don't cause unnecessary re-renders
- [ ] Keys are stable and unique in lists
- [ ] Props are destructured

**SECURITY**
- [ ] No XSS vulnerabilities (user input sanitized/escaped)
- [ ] No sensitive data in localStorage without encryption
- [ ] No eval() or dangerouslySetInnerHTML with user input

**PERFORMANCE**
- [ ] No memory leaks (cleanup in useEffect)
- [ ] No expensive operations in render
- [ ] Large lists consider virtualization
- [ ] Images are optimized (lazy loading, proper sizing)

**ACCESSIBILITY**
- [ ] Interactive elements have proper roles
- [ ] Buttons have accessible labels
- [ ] Form inputs have labels
- [ ] Focus management is correct
- [ ] Color contrast is sufficient

**TESTING**
- [ ] Tests cover happy path
- [ ] Tests cover edge cases
- [ ] Tests are readable and maintainable
- [ ] No flaky tests

### 2.3 Review Decision

**IF issues found:**
1. List each issue clearly
2. FIX them immediately
3. Re-run validation (`npm run test:run && npm run build`)
4. Re-run visual check (`npm run visual-check`)
5. Go back to 2.2 and re-review (max 3 review cycles)

**IF clean after 3 review cycles but minor issues remain:**
- Document them in progress.txt as tech debt
- Continue to completion

---

## PHASE 3: COMPLETE

Only reach here if:
- All tests pass
- Build succeeds
- Code review checklist passed
- Visual check passed

### 3.1 Commit & Update

```bash
git add -A
git commit -m "feat(US-XXX): title"
```

UPDATE `prd.json`: set story's `"passes": true`

### 3.2 Log Progress

APPEND to `progress.txt`:
```
[HH:MM] US-XXX: COMPLETE
[HH:MM] Review: Passed (N review cycles)
[HH:MM] Visual: Passed
[HH:MM] Learned: <any patterns or gotchas discovered>
```

### 3.3 Exit

Output: `STORY_COMPLETE: US-XXX`
Then STOP.

---

## Exit Codes

| Situation | Output |
|-----------|--------|
| Story completed | `STORY_COMPLETE: US-XXX` |
| Story failed 3x | `STORY_BLOCKED: US-XXX - reason` |
| No stories left | `ALL_STORIES_COMPLETE` |

## BLOCKED State

IF implementation fails after 3 attempts OR review fails after 3 cycles:
1. APPEND to `progress.txt`: `[HH:MM] US-XXX: BLOCKED - reason`
2. Output: `STORY_BLOCKED: US-XXX - reason`
3. STOP (do NOT update prd.json passes to true)

---

## Forbidden

- Working on multiple stories
- Skipping validation
- Skipping code review phase
- Skipping visual check
- Committing broken code
- Marking passes:true without all checks passing
- Ignoring review findings

---

## Progress.txt Format

```
═══════════════════════════════════════
SESSION: YYYY-MM-DD HH:MM
═══════════════════════════════════════
[HH:MM] US-XXX: Started
[HH:MM] US-XXX: Implementing...
[HH:MM] US-XXX: Validation passed
[HH:MM] US-XXX: Review cycle 1 - found 3 issues, fixing...
[HH:MM] US-XXX: Review cycle 2 - clean
[HH:MM] US-XXX: Visual check passed
[HH:MM] US-XXX: COMPLETE
[HH:MM] Review: Passed (2 cycles)
[HH:MM] Visual: Passed
[HH:MM] Learned: Use useCallback for event handlers passed to memoized children
───────────────────────────────────────
[HH:MM] US-YYY: Started
[HH:MM] US-YYY: BLOCKED - Cannot resolve circular dependency
[HH:MM] Error: Module A imports B, B imports A
═══════════════════════════════════════
```
