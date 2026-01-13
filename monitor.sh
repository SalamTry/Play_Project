#!/bin/bash
# Ralph v3 Monitor - Watch progress in real-time

while true; do
    clear
    echo "═══════════════════════════════════════"
    echo "📊 RALPH v3 MONITOR"
    echo "═══════════════════════════════════════"
    echo ""

    # Progress from prd.json
    if [ -f prd.json ]; then
        TOTAL=$(python3 -c "import json; d=json.load(open('prd.json')); print(len(d.get('stories',[])))" 2>/dev/null || echo 0)
        DONE=$(python3 -c "import json; d=json.load(open('prd.json')); print(sum(1 for s in d.get('stories',[]) if s.get('passes')))" 2>/dev/null || echo 0)
        REMAINING=$((TOTAL - DONE))

        echo "📋 PROGRESS: $DONE / $TOTAL stories"
        echo ""

        # Progress bar
        if [ "$TOTAL" -gt 0 ]; then
            PCT=$((DONE * 100 / TOTAL))
            BAR_DONE=$((DONE * 20 / TOTAL))
            BAR_LEFT=$((20 - BAR_DONE))
            printf "   ["
            printf "%0.s█" $(seq 1 $BAR_DONE 2>/dev/null)
            printf "%0.s░" $(seq 1 $BAR_LEFT 2>/dev/null)
            printf "] %d%%\n" $PCT
        fi
        echo ""

        # Next story
        echo "📌 NEXT STORY"
        NEXT=$(python3 -c "
import json
d=json.load(open('prd.json'))
for s in d.get('stories',[]):
    if not s.get('passes'):
        print(f\"   {s['id']}: {s['title']}\")
        break
" 2>/dev/null || echo "   (none)")
        echo "$NEXT"
        echo ""
    else
        echo "❌ No prd.json found"
        echo ""
    fi

    # Recent progress
    echo "📝 RECENT PROGRESS"
    if [ -f progress.txt ]; then
        tail -8 progress.txt | sed 's/^/   /'
    else
        echo "   (no progress.txt)"
    fi
    echo ""

    # Recent commits
    echo "🔧 RECENT COMMITS"
    git log --oneline -5 2>/dev/null | sed 's/^/   /' || echo "   (no git)"
    echo ""

    echo "───────────────────────────────────────"
    echo "Press Ctrl+C to stop | Refreshes every 3s"
    sleep 3
done
