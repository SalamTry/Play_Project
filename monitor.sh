#!/bin/bash
# Ralph Monitor - Watch progress

while true; do
    clear
    echo "=== RALPH MONITOR ==="
    echo ""
    echo "Branch: $(git branch --show-current 2>/dev/null)"
    echo ""

    if [ -f prd.json ]; then
        TOTAL=$(python3 -c "import json; print(len(json.load(open('prd.json')).get('stories',[])))" 2>/dev/null)
        DONE=$(python3 -c "import json; print(sum(1 for s in json.load(open('prd.json')).get('stories',[]) if s.get('passes')))" 2>/dev/null)
        echo "Progress: $DONE / $TOTAL stories"
        echo ""

        echo "Next:"
        python3 -c "
import json
for s in json.load(open('prd.json')).get('stories',[]):
    if not s.get('passes'):
        print(f\"  {s['id']}: {s['title']}\")
        break
" 2>/dev/null || echo "  (all done)"
        echo ""
    fi

    echo "Recent:"
    [ -f progress.txt ] && tail -6 progress.txt | sed 's/^/  /'
    echo ""

    echo "Commits:"
    git log --oneline -4 2>/dev/null | sed 's/^/  /'
    echo ""

    echo "---"
    echo "Ctrl+C to stop | Refresh: 3s"
    sleep 3
done
