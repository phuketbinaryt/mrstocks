import { requireActiveMembership } from '@/lib/membership/require';
import {
  getCandidatesForScan,
  getLatestScan,
} from '@/lib/scans/latest';
import { toDashboardCandidate } from '@/lib/scans/candidate-types';
import { listWatchlistsForUser } from '@/lib/watchlists/queries';
import { db } from '@/lib/db/client';
import { watchlistSymbols } from '@/lib/db/schema';
import { inArray } from 'drizzle-orm';
import DashboardClient from './client';
import EmptyState from '@/components/dashboard/EmptyState';
import TopBar from '@/components/dashboard/TopBar';

export const metadata = {
  title: 'Dashboard — MR/STOCKS',
};

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const session = await requireActiveMembership('/dashboard');
  const userId = session.user!.id!;

  const scan = await getLatestScan();
  if (!scan) {
    return (
      <main className="min-h-screen flex flex-col bg-black text-white">
        <TopBar generatedAt={new Date()} />
        <div className="flex-1">
          <EmptyState variant="no-scan-yet" />
        </div>
      </main>
    );
  }

  const rows = await getCandidatesForScan(scan.id);
  const candidates = rows.map(toDashboardCandidate);

  // Load the user's watchlists + their symbols so the LIST chip row can
  // filter the in-memory candidate list without an extra round-trip.
  const lists = await listWatchlistsForUser(userId);
  const symbolsByList: Record<string, string[]> = {};
  if (lists.length > 0) {
    const ids = lists.map((l) => l.id);
    const all = await db
      .select({
        watchlistId: watchlistSymbols.watchlistId,
        symbol: watchlistSymbols.symbol,
      })
      .from(watchlistSymbols)
      .where(inArray(watchlistSymbols.watchlistId, ids));
    for (const row of all) {
      (symbolsByList[row.watchlistId] ??= []).push(row.symbol);
    }
  }
  const defaultListId = lists.find((l) => l.isDefault)?.id ?? null;

  return (
    <DashboardClient
      generatedAtISO={scan.generatedAt.toISOString()}
      universeSize={scan.universeSize ?? null}
      barSeconds={scan.barSeconds ?? null}
      candidates={candidates}
      lists={lists.map((l) => ({
        id: l.id,
        name: l.name,
        isDefault: l.isDefault,
      }))}
      symbolsByList={symbolsByList}
      defaultListId={defaultListId}
    />
  );
}
