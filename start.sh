#!/usr/bin/env bash
set -euo pipefail

PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$PROJECT_DIR"

if [ ! -f config.local.js ]; then
  cp config.example.js config.local.js
fi

open_local_url() {
  if command -v open >/dev/null 2>&1; then
    open "http://localhost:5173"
  fi
}

if command -v node >/dev/null 2>&1 && command -v npm >/dev/null 2>&1; then
  if [ ! -d node_modules ]; then
    npm install
  fi
  open_local_url
  exec npm run dev
fi

if command -v python3 >/dev/null 2>&1 && [ -f dist/index.html ]; then
  echo "Node.js is unavailable; serving the most recently built site with Python."
  open_local_url
  exec python3 -m http.server 5173 --bind 127.0.0.1 --directory dist
fi

echo "Node.js/npm is unavailable and no built dist/ folder exists. Install Node.js, then run start.command again." >&2
exit 1
