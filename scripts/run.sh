#!/bin/bash

# GSC Admin Management Scripts
# Usage: ./scripts/run.sh [command]

set -e

case "$1" in
  "admin:create")
    echo "🏗️  Creating admin user..."
    tsx scripts/create-admin.ts
    ;;
  "admin:reset-password")
    echo "🔑 Resetting admin password..."
    tsx scripts/reset-admin-password.ts "${@:2}"
    ;;
  "seed:demo")
    echo "🌱 Seeding demo data..."
    tsx scripts/seed-demo-data.ts
    ;;
  "preflight")
    echo "🚀 Running preflight checks..."
    tsx scripts/preflight-check.ts
    ;;
  "db:migrate")
    echo "📊 Running database migrations..."
    drizzle-kit migrate
    ;;
  *)
    echo "GSC Admin Management Scripts"
    echo ""
    echo "Usage: ./scripts/run.sh [command]"
    echo ""
    echo "Commands:"
    echo "  admin:create           Create or update admin user"
    echo "  admin:reset-password   Reset admin password (interactive)"
    echo "  seed:demo             Seed demo data for development"
    echo "  preflight             Run system health checks"
    echo "  db:migrate            Run database migrations"
    echo ""
    echo "Examples:"
    echo "  ./scripts/run.sh admin:create"
    echo "  ./scripts/run.sh admin:reset-password"
    echo "  ./scripts/run.sh admin:reset-password newSecurePassword123!"
    echo "  ./scripts/run.sh seed:demo"
    echo ""
    ;;
esac