import { notFound } from 'next/navigation';
import { requireActiveMembership } from '@/lib/membership/require';
import { getLatestScan } from '@/lib/scans/latest';
import { listWatchlistsForUser } from '@/lib/watchlists/queries';
import {
  getLatestScanCandidates,
  getRuleByIdForUser,
} from '@/lib/alerts/queries';
import { db } from '@/lib/db/client';
import { watchlistSymbols } from '@/lib/db/schema';
import { inArray } from 'drizzle-orm';
import TopBar from '@/components/dashboard/TopBar';
import AlertEditor from '@/components/alerts/AlertEditor';

export const metadata = { title: 'Edit alert — MR/STOCKS' };
export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditAlertPage({ params }: PageProps) {
  const { id } = await params;
  const session = await requireActiveMembership(`/alerts/${id}/edit`);
  const userId = session.user!.id!;

  const rule = await getRuleByIdForUser(userId, id);
  if (!rule) notFound();

  const [scan, wlSummaries, latest] = await Promise.all([
    getLatestScan(),
    listWatchlistsForUser(userId),
    getLatestScanCandidates(),
  ]);
  const generatedAt = scan?.generatedAt ?? new Date();
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
      <TopBar generatedAt={generatedAt} title={`ALERTS / ${rule.name}`} />
      <AlertEditor
        initial={{
          id: rule.id,
          name: rule.name,
          active: rule.active,
          states: rule.states,
          zones: rule.zones,
          watchlistId: rule.watchlistId,
          minScore: Number(rule.minScore),
          channels: rule.channels,
        }}
        watchlists={watchlistOptions}
        candidates={latest.candidates}
        watchlistSymsByList={watchlistSymsByList}
      />
    </main>
  );
}
