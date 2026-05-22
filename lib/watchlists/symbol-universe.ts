import 'server-only';
import { db } from '@/lib/db/client';
import { scans, scanCandidates } from '@/lib/db/schema';
import { desc, sql } from 'drizzle-orm';

/**
 * Returns up to 50 symbols from the most recent scan whose ticker starts
 * with `prefix` (case-insensitive). Powers the SymbolSearch autocomplete.
 *
 * The autocomplete UI is deferred to a future polish pass — this helper
 * exists so we don't have to re-write the universe query when we ship it.
 */
export async function searchUniverseSymbols(
  prefix: string,
): Promise<string[]> {
  const p = prefix.trim().toUpperCase();
  if (!p) return [];
  const [latest] = await db
    .select({ id: scans.id })
    .from(scans)
    .orderBy(desc(scans.generatedAt))
    .limit(1);
  if (!latest) return [];

  const rows = await db
    .selectDistinct({ symbol: scanCandidates.symbol })
    .from(scanCandidates)
    .where(
      sql`${scanCandidates.scanId} = ${latest.id} AND ${scanCandidates.symbol} LIKE ${p + '%'}`,
    )
    .limit(50);
  return rows.map((r) => r.symbol).sort();
}
