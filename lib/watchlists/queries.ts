import 'server-only';
import { db } from '@/lib/db/client';
import {
  watchlists,
  watchlistSymbols,
  scans,
  scanCandidates,
} from '@/lib/db/schema';
import { eq, and, desc, sql, inArray } from 'drizzle-orm';
import type {
  Watchlist,
  WatchlistSummary,
  WatchlistWithSymbols,
} from './types';

export async function listWatchlistsForUser(
  userId: string,
): Promise<WatchlistSummary[]> {
  // One query for the watchlists, one for per-list counts, one for "hits today".
  // We do these three with separate small queries because the data is small
  // (<10 lists per user) and the queries are easier to read than a single
  // SQL pyramid.

  const lists = await db
    .select()
    .from(watchlists)
    .where(eq(watchlists.userId, userId))
    .orderBy(desc(watchlists.isDefault), watchlists.createdAt);

  if (lists.length === 0) return [];

  const ids = lists.map((l) => l.id);

  const counts = await db
    .select({
      watchlistId: watchlistSymbols.watchlistId,
      n: sql<number>`COUNT(*)::int`,
    })
    .from(watchlistSymbols)
    .where(inArray(watchlistSymbols.watchlistId, ids))
    .groupBy(watchlistSymbols.watchlistId);

  // hits today = count of distinct symbols in today's scan that match a
  // symbol in each list.
  const latestScan = await db
    .select({ id: scans.id })
    .from(scans)
    .orderBy(desc(scans.generatedAt))
    .limit(1);

  const hitsByList = new Map<string, number>();
  if (latestScan.length > 0) {
    const todays = await db
      .select({ symbol: scanCandidates.symbol })
      .from(scanCandidates)
      .where(eq(scanCandidates.scanId, latestScan[0].id));
    const todaySymbols = new Set(todays.map((r) => r.symbol));

    const allSyms = await db
      .select()
      .from(watchlistSymbols)
      .where(inArray(watchlistSymbols.watchlistId, ids));

    for (const row of allSyms) {
      if (todaySymbols.has(row.symbol)) {
        hitsByList.set(
          row.watchlistId,
          (hitsByList.get(row.watchlistId) ?? 0) + 1,
        );
      }
    }
  }

  const countByList = new Map(counts.map((c) => [c.watchlistId, c.n]));
  return lists.map((l) => ({
    id: l.id,
    name: l.name,
    isDefault: l.isDefault,
    symbolCount: countByList.get(l.id) ?? 0,
    hitsToday: hitsByList.get(l.id) ?? 0,
    updatedAt: l.createdAt,
  }));
}

export async function getWatchlistByIdForUser(
  userId: string,
  watchlistId: string,
): Promise<WatchlistWithSymbols | null> {
  const [list] = await db
    .select()
    .from(watchlists)
    .where(
      and(eq(watchlists.id, watchlistId), eq(watchlists.userId, userId)),
    )
    .limit(1);
  if (!list) return null;

  const rows = await db
    .select({ symbol: watchlistSymbols.symbol })
    .from(watchlistSymbols)
    .where(eq(watchlistSymbols.watchlistId, watchlistId))
    .orderBy(watchlistSymbols.addedAt);

  return { ...list, symbols: rows.map((r) => r.symbol) };
}

export async function getDefaultWatchlistForUser(
  userId: string,
): Promise<Watchlist | null> {
  const [row] = await db
    .select()
    .from(watchlists)
    .where(
      and(eq(watchlists.userId, userId), eq(watchlists.isDefault, true)),
    )
    .limit(1);
  return row ?? null;
}
