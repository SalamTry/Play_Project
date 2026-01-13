#!/bin/bash
# Ralph Wiggum Loop Script
# Usage: ./loop.sh <max_iterations> [plan|build]

# Check if iteration count is provided
if [ -z "$1" ]; then
    echo "Error: iteration count is required"
    echo ""
    echo "Usage: ./loop.sh <max_iterations> [plan|build]"
    echo ""
    echo "Examples:"
    echo "  ./loop.sh 5          # Run 5 iterations in build mode"
    echo "  ./loop.sh 3 plan     # Run 3 iterations in plan mode"
    echo "  ./loop.sh 10 build   # Run 10 iterations in build mode"
    exit 1
fi

MAX_ITERATIONS="$1"
MODE="${2:-build}"
ITERATION=0

# Validate iteration count is a number
if ! [[ "$MAX_ITERATIONS" =~ ^[0-9]+$ ]] || [ "$MAX_ITERATIONS" -eq 0 ]; then
    echo "Error: iteration count must be a positive number"
    exit 1
fi

if [ "$MODE" = "plan" ]; then
    PROMPT_FILE="PROMPT_plan.md"
    echo "🎯 Starting Ralph in PLAN mode..."
else
    PROMPT_FILE="PROMPT_build.md"
    echo "🔨 Starting Ralph in BUILD mode..."
fi

echo "Prompt file: $PROMPT_FILE"
echo "Max iterations: $MAX_ITERATIONS"
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

    # Check for completion marker (auto-stop)
    if grep -q "^## Status: COMPLETE" IMPLEMENTATION_PLAN.md 2>/dev/null; then
        echo ""
        echo "🎉 ALL TASKS COMPLETE! Auto-stopping."
        break
    fi

    # Check iteration limit
    if [ "$ITERATION" -ge "$MAX_ITERATIONS" ]; then
        echo ""
        echo "✅ Reached max iterations ($MAX_ITERATIONS). Stopping."
        break
    fi

    # Small delay between iterations
    sleep 2
done

echo ""
echo "🏁 Ralph loop complete after $ITERATION iterations."
