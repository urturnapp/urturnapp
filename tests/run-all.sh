#!/bin/bash
# Runs every UR TURN check against a folder (default: the live files in the repo root).
# Usage: tests/run-all.sh [folder]      e.g.  tests/run-all.sh beta
cd "$(dirname "$0")/.."
ROOT="$(pwd)/${1:-.}"; export ROOT
fail=0
for f in tests/*.test.js; do
  name=$(basename "$f")
  out=$(timeout 180 node "$f" 2>&1 | grep -v "agent-proxy\|test.local:443\|For details\|Failed to load resource")
  miss=""
  while IFS='|' read -r file rx; do
    [ "$file" = "$name" ] || continue
    echo "$out" | grep -Eq -- "$rx" || miss="$miss\n   missing: $rx"
  done < <(grep -v '^#' tests/expected.txt)
  if echo "$out" | grep -Eq "^ERR|pageerror|Error:"; then miss="$miss\n   page error"; fi
  if [ -n "$miss" ]; then echo "❌ $name"; echo -e "$miss"; echo "$out" | sed 's/^/   | /' | head -20; fail=1; else echo "✅ $name"; fi
done
[ $fail = 0 ] && echo "ALL PASSED" || echo "SOME FAILED"
exit $fail
