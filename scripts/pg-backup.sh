#!/usr/bin/env bash
# /opt/mrstocks/scripts/pg-backup.sh — nightly Postgres backup.
#
# Reads DATABASE_URL from /opt/mrstocks/.env.local, extracts the password,
# pg_dumps the mrstocks DB, gzips to /var/backups/mrstocks/, and prunes
# files older than 14 days.
#
# Intended to run via /etc/cron.d/mrstocks-pg-backup at 03:15 UTC nightly.
# Safe to invoke manually for a smoke test.
set -euo pipefail

BACKUP_DIR=/var/backups/mrstocks
ENV_FILE=/opt/mrstocks/.env.local
RETENTION_DAYS=14

mkdir -p "$BACKUP_DIR"

if [[ ! -r "$ENV_FILE" ]]; then
  echo "[pg-backup] FATAL: $ENV_FILE not readable" >&2
  exit 1
fi

# Pull DATABASE_URL out of .env.local. Strip optional quotes + trailing
# whitespace. Example: DATABASE_URL=postgres://user:pass@host:5432/db
DB_URL=$(grep -E '^DATABASE_URL=' "$ENV_FILE" \
  | head -1 \
  | sed -E 's/^DATABASE_URL=//; s/^"//; s/"$//' )

if [[ -z "$DB_URL" ]]; then
  echo "[pg-backup] FATAL: no DATABASE_URL in $ENV_FILE" >&2
  exit 1
fi

# Parse the URL: postgres://user:pass@host:port/dbname
# Bash regex extraction.
re='^postgres(ql)?://([^:]+):([^@]+)@([^:/]+)(:([0-9]+))?/([^?]+)'
if [[ ! "$DB_URL" =~ $re ]]; then
  echo "[pg-backup] FATAL: cannot parse DATABASE_URL" >&2
  exit 1
fi

DB_USER="${BASH_REMATCH[2]}"
DB_PASS="${BASH_REMATCH[3]}"
DB_HOST="${BASH_REMATCH[4]}"
DB_PORT="${BASH_REMATCH[6]:-5432}"
DB_NAME="${BASH_REMATCH[7]}"

TS=$(date -u +%Y%m%d-%H%M%S)
FILE="$BACKUP_DIR/mrstocks-$TS.sql.gz"

echo "[pg-backup] dumping $DB_NAME @ $DB_HOST:$DB_PORT → $FILE"

PGPASSWORD="$DB_PASS" pg_dump \
  -U "$DB_USER" \
  -h "$DB_HOST" \
  -p "$DB_PORT" \
  --no-owner --no-privileges \
  "$DB_NAME" \
  | gzip > "$FILE"

# Verify the dump is non-trivial (> 1KB).
SIZE_BYTES=$(stat -c '%s' "$FILE" 2>/dev/null || stat -f '%z' "$FILE")
if (( SIZE_BYTES < 1024 )); then
  echo "[pg-backup] FATAL: dump suspiciously small ($SIZE_BYTES bytes)" >&2
  exit 1
fi

# Prune. Logs the deletions for transparency in the daily journal entry.
echo "[pg-backup] pruning files older than ${RETENTION_DAYS}d"
find "$BACKUP_DIR" -name 'mrstocks-*.sql.gz' -mtime "+${RETENTION_DAYS}" -print -delete

echo "[pg-backup] OK $(date -Is) $FILE $(du -h "$FILE" | cut -f1)"
