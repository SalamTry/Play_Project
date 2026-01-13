#!/bin/bash
# Ralph v3 Simple - Autonomous Coding Loop
# Usage: ./loop.sh <iterations> [plan|build]

set -e

# ═══════════════════════════════════════
# Configuration
# ═══════════════════════════════════════
MAX_RETRIES=3
RETRY_COUNT=0
LAST_STORY=""

# ═══════════════════════════════════════
# Arguments
# ═══════════════════════════════════════
if [ -z "$1" ]; then
    echo "Ralph v3 - Simple Autonomous Loop"
    echo ""
    echo "Usage: ./loop.sh <iterations> [plan|build]"
    echo ""
    echo "Examples:"
    echo "  ./loop.sh 10        # 10 iterations, build mode"
    echo "  ./loop.sh 1 plan    # 1 iteration, plan mode"
    exit 1
fi

MAX_ITERATIONS="$1"
MODE="${2:-build}"

if ! [[ "$MAX_ITERATIONS" =~ ^[0-9]+$ ]] || [ "$MAX_ITERATIONS" -eq 0 ]; then
    echo "Error: iterations must be a positive number"
    exit 1
fi

# ═══════════════════════════════════════
# Select Prompt
# ═══════════════════════════════════════
if [ "$MODE" = "plan" ]; then
    PROMPT_FILE="PROMPT_plan.md"
    echo "📋 Ralph v3: PLAN mode"
else
    PROMPT_FILE="PROMPT_build.md"
    echo "🔨 Ralph v3: BUILD mode"
fi

echo "Max iterations: $MAX_ITERATIONS"
echo "═══════════════════════════════════════"

# Log session start
echo "" >> progress.txt
echo "═══════════════════════════════════════" >> progress.txt
echo "SESSION: $(date '+%Y-%m-%d %H:%M') | MODE: $MODE" >> progress.txt
echo "═══════════════════════════════════════" >> progress.txt

# ═══════════════════════════════════════
# Main Loop
# ═══════════════════════════════════════
ITERATION=0

while [ $ITERATION -lt $MAX_ITERATIONS ]; do
    ITERATION=$((ITERATION + 1))

    echo ""
    echo "═══════════════════════════════════════"
    echo "🔄 ITERATION $ITERATION / $MAX_ITERATIONS"
    echo "═══════════════════════════════════════"

    # Run Claude with prompt
    OUTPUT=$(cat "$PROMPT_FILE" | claude -p --dangerously-skip-permissions 2>&1) || true

    echo "$OUTPUT"

    # ─────────────────────────────────────
    # Check: ALL_STORIES_COMPLETE
    # ─────────────────────────────────────
    if echo "$OUTPUT" | grep -q "ALL_STORIES_COMPLETE"; then
        echo ""
        echo "🎉 ALL STORIES COMPLETE!"
        echo "Total iterations: $ITERATION"
        echo "[$(date '+%H:%M')] ALL_STORIES_COMPLETE" >> progress.txt
        exit 0
    fi

    # ─────────────────────────────────────
    # Check: PLANNING_COMPLETE
    # ─────────────────────────────────────
    if echo "$OUTPUT" | grep -q "PLANNING_COMPLETE"; then
        PLAN_INFO=$(echo "$OUTPUT" | grep -o "PLANNING_COMPLETE:.*" | head -1)
        echo ""
        echo "📋 $PLAN_INFO"
        echo "[$(date '+%H:%M')] $PLAN_INFO" >> progress.txt
        exit 0
    fi

    # ─────────────────────────────────────
    # Check: STORY_COMPLETE
    # ─────────────────────────────────────
    if echo "$OUTPUT" | grep -q "STORY_COMPLETE"; then
        COMPLETED=$(echo "$OUTPUT" | grep -o "STORY_COMPLETE: US-[0-9]*" | tail -1)
        echo "✅ $COMPLETED"
        echo "[$(date '+%H:%M')] $COMPLETED" >> progress.txt
        RETRY_COUNT=0
        LAST_STORY=""
    fi

    # ─────────────────────────────────────
    # Check: STORY_BLOCKED
    # ─────────────────────────────────────
    if echo "$OUTPUT" | grep -q "STORY_BLOCKED"; then
        BLOCKED_INFO=$(echo "$OUTPUT" | grep -o "STORY_BLOCKED: US-[0-9]* - .*" | tail -1)
        echo "❌ $BLOCKED_INFO"
        echo "[$(date '+%H:%M')] $BLOCKED_INFO" >> progress.txt
        echo ""
        echo "🛑 STOPPED: Story blocked after $MAX_RETRIES attempts"
        exit 1
    fi

    # ─────────────────────────────────────
    # Stuck Detection (same story repeated)
    # ─────────────────────────────────────
    CURRENT_STORY=$(cat prd.json 2>/dev/null | grep -o '"id": "US-[0-9]*"' | head -1 | grep -o 'US-[0-9]*' || echo "")

    # Find first story with passes:false
    NEXT_STORY=$(python3 -c "
import json
try:
    with open('prd.json') as f:
        data = json.load(f)
    for s in data.get('stories', []):
        if not s.get('passes', False):
            print(s['id'])
            break
except: pass
" 2>/dev/null || echo "")

    if [ -n "$NEXT_STORY" ]; then
        if [ "$NEXT_STORY" = "$LAST_STORY" ]; then
            RETRY_COUNT=$((RETRY_COUNT + 1))
            echo "⚡ Retry $RETRY_COUNT/$MAX_RETRIES for $NEXT_STORY"

            if [ $RETRY_COUNT -ge $MAX_RETRIES ]; then
                echo ""
                echo "🛑 STOPPED: $NEXT_STORY stuck after $MAX_RETRIES iterations"
                echo "[$(date '+%H:%M')] STUCK: $NEXT_STORY after $MAX_RETRIES iterations" >> progress.txt
                exit 1
            fi
        else
            LAST_STORY="$NEXT_STORY"
            RETRY_COUNT=0
        fi
    fi

    # ─────────────────────────────────────
    # Git Push
    # ─────────────────────────────────────
    if [ "$MODE" = "build" ]; then
        BRANCH=$(git branch --show-current 2>/dev/null || echo "")
        if [ -n "$BRANCH" ]; then
            git push origin "$BRANCH" 2>/dev/null || true
        fi
    fi

    sleep 2
done

echo ""
echo "✅ Reached max iterations ($MAX_ITERATIONS)"
echo "Progress saved. Run again to continue."
exit 0
