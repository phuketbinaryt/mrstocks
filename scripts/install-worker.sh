#!/usr/bin/env bash
# scripts/install-worker.sh — one-shot installer for mrstocks-worker.service.
# Run from the local laptop as:
#   sshpass -e ssh root@<prod-ip> 'bash -s' < scripts/install-worker.sh
# The script writes the unit file, reloads systemd, enables + starts the
# service, and prints its status.
set -euo pipefail

SVC=/etc/systemd/system/mrstocks-worker.service

cat > "$SVC" <<'UNIT'
[Unit]
Description=MrStocks BullMQ worker
After=network.target redis-server.service postgresql.service mrstocks.service
Wants=redis-server.service postgresql.service

[Service]
Type=simple
User=mrstocks
Group=mrstocks
WorkingDirectory=/opt/mrstocks
EnvironmentFile=/opt/mrstocks/.env.local
ExecStart=/usr/bin/env pnpm worker:start
Restart=on-failure
RestartSec=5
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
UNIT

systemctl daemon-reload
systemctl enable mrstocks-worker
systemctl restart mrstocks-worker
sleep 2
systemctl status mrstocks-worker --no-pager | head -15 || true
echo "OK worker installed"
