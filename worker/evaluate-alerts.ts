import type { Job } from 'bullmq';
import { eq, inArray } from 'drizzle-orm';
import { db } from '@/lib/db/client';
import {
  alertRules,
  scanCandidates,
  watchlistSymbols,
} from '@/lib/db/schema';
import { ruleMatches } from '@/lib/alerts/matches';
import { getSendEmailQueue, getSendWebpushQueue } from '@/lib/queue/queues';

/**
 * Job handler: given a fresh scanId, fan out to every active rule. For each
 * rule that matches ≥1 candidate, enqueue one send-email and/or send-webpush
 * job per channel. The send-* workers handle delivery + notifications row.
 *
 * Idempotency: the queue keeps the latest scanId only via the producer's
 * removeOnComplete/Fail policy. If this job is replayed (BullMQ retry), we
 * may double-email — acceptable for v1 since the worker only retries on
 * transient errors (Redis/Postgres outage).
 */
export async function runEvaluateAlerts(job: Job<{ scanId: string }>) {
  const { scanId } = job.data;
  console.log(`[evaluate-alerts] scan ${scanId}`);

  // 1. All active rules across all users.
  const rules = await db
    .select()
    .from(alertRules)
    .where(eq(alertRules.active, true));
  if (rules.length === 0) {
    console.log('[evaluate-alerts] no active rules');
    return;
  }

  // 2. All candidates for this scan, fetched once.
  const candidates = await db
    .select({
      symbol: scanCandidates.symbol,
      state: scanCandidates.state,
      prior45Position: scanCandidates.prior45Position,
      score: scanCandidates.score,
    })
    .from(scanCandidates)
    .where(eq(scanCandidates.scanId, scanId));
  if (candidates.length === 0) {
    console.log('[evaluate-alerts] no candidates in scan');
    return;
  }

  // 3. Pre-resolve every referenced watchlist's symbols in ONE query.
  const watchlistIds = [
    ...new Set(rules.map((r) => r.watchlistId).filter(Boolean) as string[]),
  ];
  const watchlistSymsByList = new Map<string, Set<string>>();
  if (watchlistIds.length > 0) {
    const rows = await db
      .select()
      .from(watchlistSymbols)
      .where(inArray(watchlistSymbols.watchlistId, watchlistIds));
    for (const r of rows) {
      let set = watchlistSymsByList.get(r.watchlistId);
      if (!set) {
        set = new Set();
        watchlistSymsByList.set(r.watchlistId, set);
      }
      set.add(r.symbol);
    }
    // Ensure rules with an empty watchlist still register as "empty set" so
    // ruleMatches enforces the filter (not null-skip).
    for (const id of watchlistIds) {
      if (!watchlistSymsByList.has(id)) watchlistSymsByList.set(id, new Set());
    }
  }

  // 4. For each rule, find hits and enqueue per channel.
  for (const rule of rules) {
    const ctx = rule.watchlistId
      ? { watchlistSymbols: watchlistSymsByList.get(rule.watchlistId) ?? new Set<string>() }
      : {};
    const hits = candidates.filter((c) => ruleMatches(rule, c, ctx));
    if (hits.length === 0) continue;

    const symbols = hits.map((c) => c.symbol);
    console.log(
      `[evaluate-alerts] rule ${rule.id} (${rule.name}) hit ${symbols.length} symbol(s)`,
    );

    if (rule.channels.includes('email')) {
      await getSendEmailQueue().add(
        'send',
        { userId: rule.userId, ruleId: rule.id, scanId, symbols },
        { attempts: 3, backoff: { type: 'exponential', delay: 5000 } },
      );
    }
    if (rule.channels.includes('webpush')) {
      await getSendWebpushQueue().add(
        'send',
        { userId: rule.userId, ruleId: rule.id, scanId, symbols },
        { attempts: 3, backoff: { type: 'exponential', delay: 5000 } },
      );
    }
  }
}
