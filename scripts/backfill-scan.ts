#!/usr/bin/env -S node --import tsx
// Usage:
//   tsx scripts/backfill-scan.ts path/to/latest_scan.json [more.json ...]
//
// Posts each file to the configured INGEST_URL with a valid HMAC. Honors
// the API's idempotency, so re-running is safe.

import { readFile } from 'node:fs/promises';
import { createHmac } from 'node:crypto';
import 'dotenv/config';

const url = process.env.INGEST_URL ?? 'http://127.0.0.1:3200/api/ingest/scan';
const secret = process.env.INGEST_SHARED_SECRET;
if (!secret) {
  console.error('INGEST_SHARED_SECRET is required');
  process.exit(1);
}

const files = process.argv.slice(2);
if (files.length === 0) {
  console.error('usage: tsx scripts/backfill-scan.ts <file.json> [more.json ...]');
  process.exit(1);
}

let okCount = 0;
let failCount = 0;
for (const file of files) {
  try {
    const body = await readFile(file, 'utf8');
    const sig = createHmac('sha256', secret).update(body).digest('hex');
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-signature': `sha256=${sig}` },
      body,
    });
    const text = await res.text();
    console.log(`${file} -> HTTP ${res.status} ${text}`);
    if (res.ok) okCount += 1;
    else failCount += 1;
  } catch (err) {
    failCount += 1;
    console.error(`${file} -> FAILED ${err instanceof Error ? err.message : err}`);
  }
}

console.log(`\n--- ${okCount} ok, ${failCount} failed`);
process.exit(failCount === 0 ? 0 : 1);
