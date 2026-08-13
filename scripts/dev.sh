#!/usr/bin/env bash
# One-shot dev bootstrap: Postgres (Docker) + backend (NestJS) + dashboard (Vite).
# See docs/DEV-TESTING-GUIDE.md for the manual step-by-step version and troubleshooting.
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

echo "==> [1/4] Starting Postgres via Docker Compose..."
cd "$ROOT_DIR/database"
[ -f .env ] || cp .env.example .env
docker compose up -d

echo "==> Waiting for Postgres to be ready..."
for i in $(seq 1 30); do
  if docker exec izone_postgres pg_isready -U postgres -d izone_dashboard >/dev/null 2>&1; then
    echo "    Postgres ready."
    break
  fi
  [ "$i" -eq 30 ] && { echo "    Postgres did not become ready in time." >&2; exit 1; }
  sleep 1
done

echo "==> [2/4] Preparing backend..."
cd "$ROOT_DIR/backend"
[ -d node_modules ] || npm install
npx prisma generate

echo "==> [3/4] Preparing dashboard..."
cd "$ROOT_DIR/dashboard"
[ -d node_modules ] || npm install

echo "==> [4/4] Starting backend + dashboard dev servers (Ctrl+C to stop both)..."
cd "$ROOT_DIR"

cleanup() {
  echo
  echo "==> Stopping dev servers..."
  kill 0 2>/dev/null
}
trap cleanup INT TERM EXIT

( cd "$ROOT_DIR/backend" && npm run start:dev 2>&1 | sed -e "s/^/[backend] /" ) &
( cd "$ROOT_DIR/dashboard" && npm run dev 2>&1 | sed -e "s/^/[dashboard] /" ) &

wait
