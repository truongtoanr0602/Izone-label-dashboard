#!/usr/bin/env bash
# One-shot dev bootstrap that skips the local Postgres Docker container and
# connects the backend directly to the VPS database instead.
# Backend (NestJS) + dashboard (Vite) still run locally.
# See docs/DEV-TESTING-GUIDE.md for the manual step-by-step version and troubleshooting.
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

VPS_DB_HOST="${VPS_DB_HOST:-160.187.146.127}"
VPS_DB_PORT="${VPS_DB_PORT:-5432}"
VPS_DB_USER="${DB_USER:-postgres}"
VPS_DB_PASSWORD="${DB_PASSWORD:-Izone@2026!}"
VPS_DB_NAME="${DB_NAME:-izone_dashboard}"
VPS_DB_SCHEMA="${DB_SCHEMA:-izone}"

# URL-encode the password (it contains '@').
ENCODED_PASSWORD="${VPS_DB_PASSWORD//@/%40}"
export DATABASE_URL="postgresql://${VPS_DB_USER}:${ENCODED_PASSWORD}@${VPS_DB_HOST}:${VPS_DB_PORT}/${VPS_DB_NAME}?schema=${VPS_DB_SCHEMA}"

echo "==> Using remote VPS database at ${VPS_DB_HOST}:${VPS_DB_PORT}/${VPS_DB_NAME} (schema=${VPS_DB_SCHEMA})"

echo "==> [1/3] Preparing backend..."
cd "$ROOT_DIR/backend"
[ -d node_modules ] || npm install
npx prisma generate

echo "==> [2/3] Preparing dashboard..."
cd "$ROOT_DIR/dashboard"
[ -d node_modules ] || npm install

echo "==> [3/3] Starting backend + dashboard dev servers (Ctrl+C to stop both)..."
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
