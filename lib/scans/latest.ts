import 'server-only';
import { db } from '@/lib/db/client';
import { scans, scanCandidates } from '@/lib/db/schema';
import { desc, eq, and, gte, lt } from 'drizzle-orm';

export async function getLatestScan() {
  const [s] = await db
    .select()
    .from(scans)
    .orderBy(desc(scans.generatedAt))
    .limit(1);
  return s ?? null;
}

/**
 * Looks up the most-recent scan whose `generated_at` falls inside the given
 * America/New_York calendar day. `dateYMD` is a `"YYYY-MM-DD"` string.
 *
 * We use a fixed -05:00 offset (NY winter time). For phase 3 this is
 * acceptable — the scan runs at 09:15 NY year-round and the +/-1h DST
 * boundary will never land mid-scan. A future phase can swap in
 * `Intl.DateTimeFormat` with a real tz library.
 */
export async function getScanByDate(dateYMD: string) {
  const dayStart = new Date(`${dateYMD}T00:00:00-05:00`);
  const dayEnd = new Date(`${dateYMD}T23:59:59-05:00`);
  const [s] = await db
    .select()
    .from(scans)
    .where(and(gte(scans.generatedAt, dayStart), lt(scans.generatedAt, dayEnd)))
    .orderBy(desc(scans.generatedAt))
    .limit(1);
  return s ?? null;
}

export async function getCandidatesForScan(scanId: string) {
  return db
    .select()
    .from(scanCandidates)
    .where(eq(scanCandidates.scanId, scanId))
    .orderBy(desc(scanCandidates.score));
}

export async function getScanDates(limit = 60) {
  return db
    .select({
      id: scans.id,
      generatedAt: scans.generatedAt,
      candidateCount: scans.candidateCount,
    })
    .from(scans)
    .orderBy(desc(scans.generatedAt))
    .limit(limit);
}
