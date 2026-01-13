#!/bin/bash
set -e

cd "$(dirname "$0")"

[ ! -f prd.json ] && echo "No prd.json to archive" && exit 0

DATE=$(date '+%Y-%m-%d-%H%M')
ARCHIVE="archive/$DATE"

mkdir -p "$ARCHIVE"
mv prd.json "$ARCHIVE/"
[ -f SPEC.md ] && mv SPEC.md "$ARCHIVE/"
[ -f progress.txt ] && mv progress.txt "$ARCHIVE/"

echo "Archived to $ARCHIVE"

# Reset
echo '{"project":"New Project","created":"'$(date '+%Y-%m-%d')'","stories":[]}' > prd.json
echo "# SPEC" > SPEC.md
touch progress.txt

echo "Reset complete. Edit SPEC.md to start new loop."
