import 'server-only';
import { db } from '@/lib/db/client';
import { scans, scanCandidates } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import type { ScanPayload } from './schema';

export type SaveResult =
  | { status: 'created'; scanId: string; candidateCount: number }
  | { status: 'noop'; scanId: string; reason: 'already_ingested' };

export async function saveScan(payload: ScanPayload): Promise<SaveResult> {
  const generatedAt = new Date(payload.generated_at);
  if (Number.isNaN(generatedAt.getTime())) {
    throw new Error('generated_at is not a valid ISO timestamp');
  }

  // Idempotency check first — keeps the hot path fast on replay.
  const existing = await db
    .select({ id: scans.id })
    .from(scans)
    .where(eq(scans.generatedAt, generatedAt))
    .limit(1);
  if (existing.length > 0) {
    return { status: 'noop', scanId: existing[0].id, reason: 'already_ingested' };
  }

  const result = await db.transaction(async (tx) => {
    const [inserted] = await tx
      .insert(scans)
      .values({
        generatedAt,
        scannerName: payload.scanner,
        feed: payload.feed ?? null,
        barSeconds: payload.bar_seconds ?? null,
        universeSize: payload.universe_size ?? null,
        candidateCount: payload.candidate_count,
        settings: payload.settings ?? null,
        raw: payload,
      })
      .returning({ id: scans.id });

    if (payload.candidates.length > 0) {
      // Deduplicate by symbol in case the scanner ever ships duplicates.
      const bySymbol = new Map<string, (typeof payload.candidates)[number]>();
      for (const c of payload.candidates) bySymbol.set(c.symbol, c);

      const rows = Array.from(bySymbol.values()).map((c) => ({
        scanId: inserted.id,
        symbol: c.symbol,
        state: c.state,
        watch: c.watch ?? null,
        location: c.location ?? null,
        score: c.score?.toString() ?? null,
        lastPrice: c.last_price?.toString() ?? null,
        maDistanceAtr: c.ma_distance_atr?.toString() ?? null,
        maDistancePct: c.ma_distance_pct?.toString() ?? null,
        gapAtr: c.gap_atr?.toString() ?? null,
        avgDollarVolume: c.avg_dollar_volume?.toString() ?? null,
        prior45Position: c.prior45_position ?? null,
        prior45Action: c.prior45_action ?? null,
        data: c,
      }));

      // Postgres has a parameter limit (~65535) per statement. Each candidate
      // here has 14 columns, so 4000 rows = 56000 params — safe headroom.
      // The current universe is ~500 candidates so a single insert is fine.
      await tx.insert(scanCandidates).values(rows);
    }

    return inserted.id;
  });

  return {
    status: 'created',
    scanId: result,
    candidateCount: payload.candidates.length,
  };
}
