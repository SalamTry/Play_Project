#!/bin/bash
# Ralph Loop - Autonomous Coding with Branch/PR Support
# Usage: ./loop.sh <iterations> [plan|build]

set -e

MAX_RETRIES=3
RETRY_COUNT=0
LAST_STORY=""
SESSION_BRANCH=""
FIRST_STORY=""
LAST_COMPLETED_STORY=""

get_base_branch() {
    git show-ref --verify --quiet refs/heads/main 2>/dev/null && echo "main" && return
    git show-ref --verify --quiet refs/heads/master 2>/dev/null && echo "master" && return
    git branch --show-current
}

get_first_pending_story() {
    python3 -c "
import json
with open('prd.json') as f:
    for s in json.load(f).get('stories', []):
        if not s.get('passes', False):
            print(s['id'])
            break
" 2>/dev/null || echo ""
}

get_last_completed_story() {
    python3 -c "
import json
last = None
for s in json.load(open('prd.json')).get('stories', []):
    if s.get('passes', False): last = s['id']
if last: print(last)
" 2>/dev/null || echo ""
}

create_session_branch() {
    SESSION_BRANCH="feature/$1-$(date '+%Y%m%d-%H%M')"
    git checkout -b "$SESSION_BRANCH" "$(get_base_branch)" 2>/dev/null || SESSION_BRANCH=$(git branch --show-current)
    echo "Branch: $SESSION_BRANCH"
}

create_pull_request() {
    local base=$(get_base_branch)
    local commits=$(git log "$base"..HEAD --oneline 2>/dev/null | head -15)
    [ -z "$commits" ] && echo "No commits to PR" && return

    if ! command -v gh &>/dev/null; then
        echo "Install gh CLI for auto-PR: https://cli.github.com/"
        echo "Or create PR manually for: $SESSION_BRANCH"
        return
    fi

    gh pr create \
        --title "feat: $1 to $2" \
        --body "## Stories: $1 to $2

\`\`\`
$commits
\`\`\`" \
        --base "$base" 2>&1 && echo "PR created!" || echo "PR failed (may exist)"
}

# Args
[ -z "$1" ] && echo "Usage: ./loop.sh <iterations> [plan|build]" && exit 1
MAX_ITERATIONS="$1"
MODE="${2:-build}"
[[ ! "$MAX_ITERATIONS" =~ ^[0-9]+$ ]] && echo "Error: iterations must be a number" && exit 1

# Setup
if [ "$MODE" = "plan" ]; then
    PROMPT_FILE="PROMPT_plan.md"
    echo "PLAN mode - $MAX_ITERATIONS iterations"
else
    PROMPT_FILE="PROMPT_build.md"
    echo "BUILD mode - $MAX_ITERATIONS iterations"
    FIRST_STORY=$(get_first_pending_story)
    [ -n "$FIRST_STORY" ] && create_session_branch "$FIRST_STORY"
fi

echo "" >> progress.txt
echo "SESSION: $(date '+%Y-%m-%d %H:%M') | $MODE | ${SESSION_BRANCH:-$(git branch --show-current)}" >> progress.txt

# Main Loop
for ((i=1; i<=MAX_ITERATIONS; i++)); do
    echo ""
    echo "=== ITERATION $i / $MAX_ITERATIONS ==="

    OUTPUT=$(cat "$PROMPT_FILE" | claude -p --dangerously-skip-permissions 2>&1) || true
    echo "$OUTPUT"

    # ALL_STORIES_COMPLETE
    if echo "$OUTPUT" | grep -q "ALL_STORIES_COMPLETE"; then
        echo "ALL DONE!"
        echo "[$(date '+%H:%M')] ALL_STORIES_COMPLETE" >> progress.txt
        [ "$MODE" = "build" ] && [ -n "$SESSION_BRANCH" ] && create_pull_request "${FIRST_STORY:-US-001}" "$(get_last_completed_story)"
        exit 0
    fi

    # PLANNING_COMPLETE
    if echo "$OUTPUT" | grep -q "PLANNING_COMPLETE"; then
        echo "$OUTPUT" | grep "PLANNING_COMPLETE" >> progress.txt
        exit 0
    fi

    # STORY_COMPLETE
    if echo "$OUTPUT" | grep -q "STORY_COMPLETE"; then
        COMPLETED_ID=$(echo "$OUTPUT" | grep -oE 'US-[0-9]+' | tail -1)
        echo "Done: $COMPLETED_ID"
        echo "[$(date '+%H:%M')] STORY_COMPLETE: $COMPLETED_ID" >> progress.txt
        LAST_COMPLETED_STORY="$COMPLETED_ID"
        RETRY_COUNT=0
        LAST_STORY=""
    fi

    # STORY_BLOCKED
    if echo "$OUTPUT" | grep -q "STORY_BLOCKED"; then
        echo "$OUTPUT" | grep "STORY_BLOCKED" >> progress.txt
        echo "BLOCKED - stopping"
        exit 1
    fi

    # Stuck detection
    NEXT_STORY=$(get_first_pending_story)
    if [ -n "$NEXT_STORY" ] && [ "$NEXT_STORY" = "$LAST_STORY" ]; then
        RETRY_COUNT=$((RETRY_COUNT + 1))
        echo "Retry $RETRY_COUNT/$MAX_RETRIES for $NEXT_STORY"
        if [ $RETRY_COUNT -ge $MAX_RETRIES ]; then
            echo "STUCK on $NEXT_STORY - stopping"
            echo "[$(date '+%H:%M')] STUCK: $NEXT_STORY" >> progress.txt
            exit 1
        fi
    else
        LAST_STORY="$NEXT_STORY"
        RETRY_COUNT=0
    fi

    # Push
    [ "$MODE" = "build" ] && git push origin "$(git branch --show-current)" 2>/dev/null || true

    sleep 2
done

echo "Max iterations reached"
[ "$MODE" = "build" ] && [ -n "$LAST_COMPLETED_STORY" ] && create_pull_request "${FIRST_STORY:-US-001}" "$LAST_COMPLETED_STORY"
exit 0
