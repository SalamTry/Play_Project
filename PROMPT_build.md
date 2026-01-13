# Build Mode

## Your Job
Complete ONE user story from prd.json.

## Steps

### 1. Select Story
- READ `prd.json`
- FIND first story where `"passes": false`
- IF all stories pass: output `ALL_STORIES_COMPLETE` and STOP

### 2. Implement
- READ existing code in story's files
- IMPLEMENT to meet ALL acceptance criteria
- WRITE tests if story has test files listed
- Follow existing code patterns

### 3. Validate (ALL MUST PASS)

```bash
# Check files exist
ls <each file in story.files>

# Run tests
npm run test:run

# Run build
npm run build
```

IF any fails:
- Try to fix (max 3 attempts)
- IF still failing after 3 attempts:
  - Append to progress.txt: `[TIME] US-XXX: BLOCKED - reason`
  - Output: `STORY_BLOCKED: US-XXX - reason`
  - STOP (do NOT update prd.json)

### 4. Complete
1. COMMIT: `feat(US-XXX): title`
2. UPDATE `prd.json`: set story's `"passes": true`
3. APPEND to `progress.txt`:
   ```
   [TIME] US-XXX: COMPLETE
   [TIME] Learned: any patterns or gotchas discovered
   ```
4. Output: `STORY_COMPLETE: US-XXX`
5. STOP

## Exit Codes (output exactly ONE, then STOP)

| Situation | Output |
|-----------|--------|
| Story completed | `STORY_COMPLETE: US-XXX` |
| Story failed 3x | `STORY_BLOCKED: US-XXX - reason` |
| No stories left | `ALL_STORIES_COMPLETE` |

## Forbidden
- Working on multiple stories
- Skipping validation
- Committing broken code
- Marking passes:true without validation passing

## Progress.txt Format

```
═══════════════════════════════════════
SESSION: YYYY-MM-DD HH:MM
═══════════════════════════════════════
[HH:MM] US-XXX: Started
[HH:MM] US-XXX: COMPLETE
[HH:MM] Learned: discovered pattern or gotcha
───────────────────────────────────────
[HH:MM] US-YYY: Started
[HH:MM] US-YYY: BLOCKED - reason
[HH:MM] Error: details of what went wrong
═══════════════════════════════════════
```
