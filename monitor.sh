#!/bin/bash
# Ralph v2 Monitor - Watch progress in real-time

while true; do
    clear
    echo "═══════════════════════════════════════"
    echo "📊 RALPH v2 MONITOR"
    echo "═══════════════════════════════════════"
    echo ""

    # Status
    STATUS=$(grep "^## Status:" IMPLEMENTATION_PLAN.md 2>/dev/null | cut -d: -f2 | xargs)
    echo "Status: $STATUS"
    echo ""

    # Progress
    TOTAL=$(grep -c "^\- \[.\] \*\*TASK-" IMPLEMENTATION_PLAN.md 2>/dev/null | tr -d '\n' || echo 0)
    DONE=$(grep -c "^\- \[x\] \*\*TASK-" IMPLEMENTATION_PLAN.md 2>/dev/null | tr -d '\n' || echo 0)
    BLOCKED=$(grep -c "^\- \[BLOCKED\]" IMPLEMENTATION_PLAN.md 2>/dev/null | tr -d '\n' || echo 0)
    [ -z "$TOTAL" ] && TOTAL=0
    [ -z "$DONE" ] && DONE=0
    [ -z "$BLOCKED" ] && BLOCKED=0
    REMAINING=$((TOTAL - DONE - BLOCKED))

    echo "📋 PROGRESS"
    echo "   Total:     $TOTAL"
    echo "   Completed: $DONE ✅"
    echo "   Blocked:   $BLOCKED ⚠️"
    echo "   Remaining: $REMAINING"
    echo ""

    # Current task
    echo "📌 NEXT TASK"
    grep -m1 "^\- \[ \] \*\*TASK-" IMPLEMENTATION_PLAN.md 2>/dev/null || echo "   (none)"
    echo ""

    # Recent commits
    echo "📝 RECENT COMMITS"
    git log --oneline -5 2>/dev/null | sed 's/^/   /' || echo "   (no git)"
    echo ""

    # Blocked tasks
    if [ -f BLOCKED.md ] && [ -s BLOCKED.md ]; then
        echo "⚠️  BLOCKED TASKS"
        cat BLOCKED.md | sed 's/^/   /'
        echo ""
    fi

    echo "───────────────────────────────────────"
    echo "Press Ctrl+C to stop"
    sleep 3
done
