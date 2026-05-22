#!/usr/bin/env bash
# scripts/install-backup-cron.sh — installs the nightly pg-backup cron
# on the production server.
#
# Run this LOCALLY by piping it over SSH:
#   sshpass -e ssh root@<IP> 'bash -s' < scripts/install-backup-cron.sh
#
# Assumes the mrstocks repo is checked out at /opt/mrstocks on the
# server (Phase 5 deploy.sh runs `git pull` there).
set -euo pipefail

SRC=/opt/mrstocks/scripts/pg-backup.sh
DST=/usr/local/bin/mrstocks-pg-backup.sh
CRON_FILE=/etc/cron.d/mrstocks-pg-backup
BACKUP_DIR=/var/backups/mrstocks
LOG_FILE=/var/log/mrstocks-pg-backup.log

if [[ ! -f "$SRC" ]]; then
  echo "FATAL: $SRC not found. Did /opt/mrstocks/scripts/ pull cleanly?" >&2
  exit 1
fi

cp "$SRC" "$DST"
chmod +x "$DST"

cat > "$CRON_FILE" <<EOF
# MR/STOCKS nightly Postgres backup — 03:15 UTC daily.
# Installed by scripts/install-backup-cron.sh.
SHELL=/bin/bash
PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
15 3 * * * root $DST >> $LOG_FILE 2>&1
EOF
chmod 0644 "$CRON_FILE"

mkdir -p "$BACKUP_DIR"
chmod 0750 "$BACKUP_DIR"

# Touch log file so first cron run can append.
touch "$LOG_FILE"
chmod 0640 "$LOG_FILE"

echo "OK: backup cron installed."
echo "  script : $DST"
echo "  cron   : $CRON_FILE"
echo "  output : $BACKUP_DIR"
echo "  log    : $LOG_FILE"
echo ""
ls -la "$CRON_FILE"
