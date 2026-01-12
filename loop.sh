#!/bin/bash
# Ralph Wiggum Loop Script
# Usage: ./loop.sh [plan|build] [max_iterations]

MODE="${1:-build}"
MAX_ITERATIONS="${2:-0}"  # 0 = infinite
ITERATION=0

if [ "$MODE" = "plan" ]; then
    PROMPT_FILE="PROMPT_plan.md"
    echo "🎯 Starting Ralph in PLAN mode..."
else
    PROMPT_FILE="PROMPT_build.md"
    echo "🔨 Starting Ralph in BUILD mode..."
fi

echo "Prompt file: $PROMPT_FILE"
echo "Max iterations: $MAX_ITERATIONS (0 = infinite)"
echo "---"

while true; do
    ITERATION=$((ITERATION + 1))
    echo ""
    echo "═══════════════════════════════════════"
    echo "🔄 ITERATION $ITERATION"
    echo "═══════════════════════════════════════"

    # Run Claude with the prompt
    cat "$PROMPT_FILE" | claude -p \
        --dangerously-skip-permissions \
        --verbose

    EXIT_CODE=$?

    # Push changes if in build mode
    if [ "$MODE" = "build" ]; then
        BRANCH=$(git branch --show-current 2>/dev/null)
        if [ -n "$BRANCH" ]; then
            git push origin "$BRANCH" 2>/dev/null || true
        fi
    fi

    # Check iteration limit
    if [ "$MAX_ITERATIONS" -gt 0 ] && [ "$ITERATION" -ge "$MAX_ITERATIONS" ]; then
        echo ""
        echo "✅ Reached max iterations ($MAX_ITERATIONS). Stopping."
        break
    fi

    # Small delay between iterations
    sleep 2
done

echo ""
echo "🏁 Ralph loop complete after $ITERATION iterations."
