# Planning Mode

## Your Job
Read SPEC.md and create/update prd.json with right-sized user stories.

## Steps

1. READ `SPEC.md` for requirements
2. READ `prd.json` (if exists) for current stories
3. For each feature in SPEC.md:
   - Break into small, atomic user stories
   - Each story should touch MAX 3 files
   - Each story should be completable in one AI session
   - Write clear acceptance criteria
4. UPDATE `prd.json` with new/modified stories
5. Output: `PLANNING_COMPLETE: X stories total`

## Story Size Rules

A story is RIGHT-SIZED if:
- Touches 1-3 files maximum
- Has 2-5 acceptance criteria
- Can be tested independently
- Does not depend on unwritten code

A story is TOO BIG if:
- Touches 4+ files
- Has vague acceptance criteria like "works well"
- Requires multiple features at once

Split big stories into smaller ones.

## prd.json Format

```json
{
  "project": "Project Name",
  "stories": [
    {
      "id": "US-001",
      "title": "Short title",
      "description": "What and why",
      "acceptance": ["Criteria 1", "Criteria 2"],
      "files": ["src/file1.js", "src/file2.js"],
      "tests": ["src/file1.test.js"],
      "passes": false
    }
  ]
}
```

## Constraints
- Do NOT write code
- Do NOT run commands
- ONLY update prd.json

## Exit
Output exactly: `PLANNING_COMPLETE: X stories total`
Then STOP.
