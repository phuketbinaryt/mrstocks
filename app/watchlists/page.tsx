import Link from 'next/link';
import { requireActiveMembership } from '@/lib/membership/require';
import { listWatchlistsForUser } from '@/lib/watchlists/queries';
import { getLatestScan } from '@/lib/scans/latest';
import WatchlistList from '@/components/watchlists/WatchlistList';
import TopBar from '@/components/dashboard/TopBar';

export const metadata = {
  title: 'Watchlists — MR/STOCKS',
};

export const dynamic = 'force-dynamic';

export default async function WatchlistsPage() {
  const session = await requireActiveMembership('/watchlists');
  // session is guaranteed non-null after requireActiveMembership.
  const userId = session.user!.id!;
  const lists = await listWatchlistsForUser(userId);
  const scan = await getLatestScan();
  const generatedAt = scan?.generatedAt ?? new Date();

  return (
    <main className="min-h-screen flex flex-col bg-black text-white">
      <TopBar generatedAt={generatedAt} title="WATCHLISTS" />
      <div className="flex items-center gap-3 px-4 md:px-5 py-2.5 border-b border-white/12 bg-[#050505]">
        <span className="text-[9.5px] uppercase tracking-[0.18em] text-[oklch(0.82_0.16_75)]">
          ALL LISTS
        </span>
        <span className="text-[oklch(0.82_0.16_75/0.5)]">│</span>
        <span className="text-[10.5px] uppercase tracking-[0.08em] text-[oklch(0.78_0.12_200)]">
          COUNT{' '}
          <span className="text-white tabular-nums">
            {String(lists.length).padStart(2, '0')}
          </span>
        </span>
        <div className="flex-1" />
        <Link
          href="/watchlists/new"
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm border border-[oklch(0.82_0.16_75/0.5)] bg-[oklch(0.82_0.16_75/0.12)] text-[oklch(0.82_0.16_75)] text-[10.5px] uppercase tracking-[0.1em] hover:bg-[oklch(0.82_0.16_75/0.2)]"
        >
          + NEW LIST
        </Link>
      </div>
      <WatchlistList lists={lists} />
    </main>
  );
}
