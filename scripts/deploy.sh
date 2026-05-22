#!/usr/bin/env bash
# MrStocks deploy script — pulls, installs, migrates, builds, stitches standalone, restarts.
# Run as the mrstocks user (or via: sudo -u mrstocks /opt/mrstocks/scripts/deploy.sh)
set -euo pipefail

cd /opt/mrstocks

echo "[deploy] git pull"
git pull --ff-only || echo "[deploy] git pull failed or no remote — continuing"

echo "[deploy] pnpm install"
pnpm install --frozen-lockfile

echo "[deploy] loading env"
set -a
. ./.env.local
set +a

echo "[deploy] pnpm db:migrate"
pnpm db:migrate

echo "[deploy] pnpm build"
pnpm build

echo "[deploy] stitching standalone output"
rm -rf .next/standalone/.next/static .next/standalone/public
cp -r .next/static .next/standalone/.next/static
cp -r public .next/standalone/public

echo "[deploy] restarting systemd service (sudo)"
sudo /bin/systemctl restart mrstocks
sleep 2
sudo /bin/systemctl status mrstocks --no-pager | head -10

echo "[deploy] restarting worker"
sudo /bin/systemctl restart mrstocks-worker || echo "[deploy] worker not installed yet, skipping"
sleep 1
sudo /bin/systemctl status mrstocks-worker --no-pager 2>/dev/null | head -10 || true
