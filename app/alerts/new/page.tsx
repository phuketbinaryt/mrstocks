import { requireActiveMembership } from '@/lib/membership/require';
import { getLatestScan } from '@/lib/scans/latest';
import { listWatchlistsForUser } from '@/lib/watchlists/queries';
import {
  getLatestScanCandidates,
} from '@/lib/alerts/queries';
import { db } from '@/lib/db/client';
import { watchlistSymbols, watchlists } from '@/lib/db/schema';
import { eq, inArray } from 'drizzle-orm';
import TopBar from '@/components/dashboard/TopBar';
import AlertEditor from '@/components/alerts/AlertEditor';

export const metadata = { title: 'New alert — MR/STOCKS' };
export const dynamic = 'force-dynamic';

export default async function NewAlertPage() {
  const session = await requireActiveMembership('/alerts/new');
  const userId = session.user!.id!;

  const [scan, wlSummaries, latest] = await Promise.all([
    getLatestScan(),
    listWatchlistsForUser(userId),
    getLatestScanCandidates(),
  ]);
  const generatedAt = scan?.generatedAt ?? new Date();

  // For the live preview we need symbol sets for every owned watchlist so the
  // editor can recompute matches when the user picks one.
  const watchlistOptions = wlSummaries.map((w) => ({ id: w.id, name: w.name }));
  let watchlistSymsByList: Record<string, string[]> = {};
  if (wlSummaries.length > 0) {
    const ids = wlSummaries.map((w) => w.id);
    const rows = await db
      .select()
      .from(watchlistSymbols)
      .where(inArray(watchlistSymbols.watchlistId, ids));
    for (const r of rows) {
      (watchlistSymsByList[r.watchlistId] ??= []).push(r.symbol);
    }
  }

  return (
    <main className="min-h-screen flex flex-col bg-black text-white">
      <TopBar generatedAt={generatedAt} title="ALERTS / NEW" />
      <AlertEditor
        watchlists={watchlistOptions}
        candidates={latest.candidates}
        watchlistSymsByList={watchlistSymsByList}
      />
    </main>
  );
}
