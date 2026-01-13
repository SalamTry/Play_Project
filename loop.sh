#!/bin/bash
# Ralph Wiggum v2 - With Expert Improvements
# Usage: ./loop.sh <iterations> [plan|build]

set -e

# ═══════════════════════════════════════
# Configuration
# ═══════════════════════════════════════
MAX_RETRIES_PER_TASK=3
BLOCKED_THRESHOLD=3

# ═══════════════════════════════════════
# Argument Parsing
# ═══════════════════════════════════════
if [ -z "$1" ]; then
    echo "Ralph Wiggum v2 - Autonomous Coding Loop"
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
# State Tracking
# ═══════════════════════════════════════
ITERATION=0
CURRENT_TASK=""
TASK_ATTEMPTS=0
BLOCKED_COUNT=0
LOG_FILE="ralph.log"

# ═══════════════════════════════════════
# Prompt Selection
# ═══════════════════════════════════════
if [ "$MODE" = "plan" ]; then
    PROMPT_FILE="PROMPT_plan.md"
    echo "🎯 Ralph v2: PLAN mode"
else
    PROMPT_FILE="PROMPT_build.md"
    echo "🔨 Ralph v2: BUILD mode"
fi

echo "Max iterations: $MAX_ITERATIONS"
echo "Max retries per task: $MAX_RETRIES_PER_TASK"
echo "Log file: $LOG_FILE"
echo "═══════════════════════════════════════"

# ═══════════════════════════════════════
# Main Loop
# ═══════════════════════════════════════
while [ $ITERATION -lt $MAX_ITERATIONS ]; do
    ITERATION=$((ITERATION + 1))

    echo ""
    echo "═══════════════════════════════════════"
    echo "🔄 ITERATION $ITERATION / $MAX_ITERATIONS"
    echo "═══════════════════════════════════════"

    # Run Claude and capture output
    OUTPUT=$(cat "$PROMPT_FILE" | claude -p \
        --dangerously-skip-permissions \
        --verbose 2>&1) || true

    echo "$OUTPUT"
    echo "$OUTPUT" >> "$LOG_FILE"

    # ─────────────────────────────────────
    # Parse Exit Codes
    # ─────────────────────────────────────

    # Check: ALL_TASKS_COMPLETE
    if echo "$OUTPUT" | grep -q "ALL_TASKS_COMPLETE"; then
        echo ""
        echo "🎉 ALL TASKS COMPLETE!"
        echo "Total iterations: $ITERATION"
        exit 0
    fi

    # Check: Status: COMPLETE in plan
    if grep -q "^## Status: COMPLETE" IMPLEMENTATION_PLAN.md 2>/dev/null; then
        echo ""
        echo "🎉 Project marked COMPLETE!"
        echo "Total iterations: $ITERATION"
        exit 0
    fi

    # Check: TASK_COMPLETE
    if echo "$OUTPUT" | grep -q "TASK_COMPLETE:"; then
        COMPLETED=$(echo "$OUTPUT" | grep -o "TASK_COMPLETE: TASK-[0-9]*" | tail -1)
        echo "✅ $COMPLETED"
        TASK_ATTEMPTS=0
        BLOCKED_COUNT=0
        CURRENT_TASK=""
    fi

    # Check: TASK_BLOCKED
    if echo "$OUTPUT" | grep -q "TASK_BLOCKED:"; then
        BLOCKED=$(echo "$OUTPUT" | grep -o "TASK_BLOCKED: TASK-[0-9]*" | tail -1)
        echo "⚠️  $BLOCKED"
        BLOCKED_COUNT=$((BLOCKED_COUNT + 1))
        TASK_ATTEMPTS=0
        CURRENT_TASK=""

        if [ $BLOCKED_COUNT -ge $BLOCKED_THRESHOLD ]; then
            echo ""
            echo "🛑 STOPPED: $BLOCKED_COUNT tasks blocked"
            echo "Review BLOCKED.md for details"
            exit 1
        fi
    fi

    # ─────────────────────────────────────
    # Retry Detection (same task stuck)
    # ─────────────────────────────────────
    NEW_TASK=$(grep -m1 "^\- \[ \] \*\*TASK-" IMPLEMENTATION_PLAN.md 2>/dev/null | grep -o "TASK-[0-9]*" || echo "")

    if [ -n "$NEW_TASK" ]; then
        if [ "$NEW_TASK" = "$CURRENT_TASK" ]; then
            TASK_ATTEMPTS=$((TASK_ATTEMPTS + 1))
            echo "⚡ Retry $TASK_ATTEMPTS/$MAX_RETRIES_PER_TASK for $CURRENT_TASK"

            if [ $TASK_ATTEMPTS -ge $MAX_RETRIES_PER_TASK ]; then
                echo ""
                echo "🛑 STUCK: $CURRENT_TASK failed $MAX_RETRIES_PER_TASK times"
                echo "- [$CURRENT_TASK] BLOCKED after $MAX_RETRIES_PER_TASK attempts" >> BLOCKED.md

                # Mark as blocked in plan
                sed -i.bak "s/- \[ \] \*\*$CURRENT_TASK/- [BLOCKED] **$CURRENT_TASK/" IMPLEMENTATION_PLAN.md

                BLOCKED_COUNT=$((BLOCKED_COUNT + 1))
                TASK_ATTEMPTS=0
                CURRENT_TASK=""

                if [ $BLOCKED_COUNT -ge $BLOCKED_THRESHOLD ]; then
                    echo "🛑 STOPPED: Too many blocked tasks"
                    exit 1
                fi
            fi
        else
            CURRENT_TASK="$NEW_TASK"
            TASK_ATTEMPTS=0
        fi
    fi

    # ─────────────────────────────────────
    # Git Push (if in build mode)
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
