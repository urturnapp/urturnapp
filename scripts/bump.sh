#!/bin/bash
# Gives a folder's files a new version number so phones load the new code (and open pages refresh by themselves).
# Usage: scripts/bump.sh beta     (or: scripts/bump.sh .  for the live site)
cd "$(dirname "$0")/.."; D="${1:-beta}"; V=$(date -u +%Y%m%d%H%M)
sed -i -E "s#\?v=[0-9]{12}#?v=$V#g; s#ver=\"[0-9]{12}\"#ver=\"$V\"#g" "$D/index.html"
echo "version $V -> $D"
