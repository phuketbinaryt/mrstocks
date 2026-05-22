import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { requireActiveMembership } from '@/lib/membership/require';
import { createWatchlist } from '@/lib/watchlists/actions';
import { getLatestScan } from '@/lib/scans/latest';
import TopBar from '@/components/dashboard/TopBar';

export const metadata = {
  title: 'New watchlist — MR/STOCKS',
};

export const dynamic = 'force-dynamic';

export default async function NewWatchlistPage() {
  await requireActiveMembership('/watchlists/new');
  const scan = await getLatestScan();
  const generatedAt = scan?.generatedAt ?? new Date();

  return (
    <main className="min-h-screen flex flex-col bg-black text-white">
      <TopBar generatedAt={generatedAt} title="WATCHLISTS" />
      <div className="flex items-center gap-3 px-4 md:px-5 h-11 md:h-12 border-b border-white/12 bg-[#050505]">
        <Link
          href="/watchlists"
          aria-label="Back"
          className="-ml-1 p-1.5 rounded-sm text-white/75 hover:text-white hover:bg-white/10"
        >
          <ChevronLeft size={14} />
        </Link>
        <span className="text-[10px] uppercase tracking-[0.14em] text-[oklch(0.82_0.16_75)]">
          WATCHLISTS
        </span>
        <span className="text-[oklch(0.82_0.16_75/0.5)]">│</span>
        <span className="text-[13px] uppercase tracking-[0.06em] text-white font-medium">
          NEW
        </span>
      </div>

      <div className="flex-1 px-4">
        <div className="max-w-[480px] mx-auto pt-12 w-full">
          <h1 className="text-[14px] uppercase tracking-[0.16em] mb-1">
            CREATE WATCHLIST
          </h1>
          <p className="text-[12px] text-white/65 mb-6">
            Name your list. You can add symbols on the next screen.
          </p>
          <form action={createWatchlist} className="space-y-4">
            <input
              name="name"
              placeholder="e.g. Tech leaders"
              maxLength={40}
              required
              autoFocus
              className="w-full bg-[#0B0B0B] border border-white/20 px-3 py-2.5 text-white text-[13px] rounded-sm focus:outline-none focus:border-[oklch(0.82_0.16_75/0.7)]"
            />
            <div className="flex items-center gap-2">
              <Link
                href="/watchlists"
                className="px-4 py-2 rounded-sm border border-white/15 text-white/75 text-[11px] uppercase tracking-[0.12em] hover:text-white hover:border-white/30"
              >
                Cancel
              </Link>
              <button
                type="submit"
                className="flex-1 px-4 py-2.5 rounded-sm border border-[oklch(0.82_0.16_75/0.6)] bg-[oklch(0.82_0.16_75/0.18)] text-[oklch(0.82_0.16_75)] text-[11px] uppercase tracking-[0.14em] hover:bg-[oklch(0.82_0.16_75/0.28)]"
              >
                Create list
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
