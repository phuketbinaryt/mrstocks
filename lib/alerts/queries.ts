import 'server-only';
import { db } from '@/lib/db/client';
import {
  alertRules,
  notifications,
  scans,
  scanCandidates,
} from '@/lib/db/schema';
import { and, desc, eq } from 'drizzle-orm';
import type { AlertRule, CandidateForMatch, Notification } from './types';

export async function listRulesForUser(userId: string): Promise<AlertRule[]> {
  return db
    .select()
    .from(alertRules)
    .where(eq(alertRules.userId, userId))
    .orderBy(desc(alertRules.createdAt));
}

export async function getRuleByIdForUser(
  userId: string,
  id: string,
): Promise<AlertRule | null> {
  const [row] = await db
    .select()
    .from(alertRules)
    .where(and(eq(alertRules.id, id), eq(alertRules.userId, userId)))
    .limit(1);
  return row ?? null;
}

/**
 * History page feed. Capped to avoid pulling unbounded rows. The schema's
 * sent_at index keeps this snappy.
 */
export async function listNotificationsForUser(
  userId: string,
  limit = 200,
): Promise<Notification[]> {
  return db
    .select()
    .from(notifications)
    .where(eq(notifications.userId, userId))
    .orderBy(desc(notifications.sentAt))
    .limit(limit);
}

/**
 * Latest scan's candidates — used by the rule editor for the live "WOULD
 * FIRE TODAY N" preview. Lean projection to keep the round-trip small.
 */
export async function getLatestScanCandidates(): Promise<{
  scanId: string | null;
  candidates: CandidateForMatch[];
}> {
  const [latest] = await db
    .select({ id: scans.id })
    .from(scans)
    .orderBy(desc(scans.generatedAt))
    .limit(1);
  if (!latest) return { scanId: null, candidates: [] };
  const rows = await db
    .select({
      symbol: scanCandidates.symbol,
      state: scanCandidates.state,
      prior45Position: scanCandidates.prior45Position,
      score: scanCandidates.score,
    })
    .from(scanCandidates)
    .where(eq(scanCandidates.scanId, latest.id));
  return { scanId: latest.id, candidates: rows };
}
