#!/bin/bash
# Moves the tested beta version to the live site. Stops if any check fails.
# Usage: scripts/promote.sh
set -e
cd "$(dirname "$0")/.."
echo "1) checking beta..."; tests/run-all.sh beta
echo "2) copying beta -> live"
for f in index.html core.js customer.js cashier.js admin.js home.js style.css sw.js manifest.json qrcode.js jsqr.js; do cp "beta/$f" "./$f"; done
rm -f app.js
scripts/bump.sh .
echo "3) checking live files..."; tests/run-all.sh .
echo "OK: ready to commit and push"
