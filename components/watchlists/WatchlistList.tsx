// Server component — just renders rows. WatchlistRow / KebabMenu are
// the client-side pieces.
import { Inbox } from 'lucide-react';
import Link from 'next/link';
import WatchlistRow from './WatchlistRow';
import type { WatchlistSummary } from '@/lib/watchlists/types';

export interface WatchlistListProps {
  lists: WatchlistSummary[];
}

export default function WatchlistList({ lists }: WatchlistListProps) {
  if (lists.length === 0) {
    return <EmptyState />;
  }
  return (
    <div className="flex-1 overflow-y-auto">
      {lists.map((l) => (
        <WatchlistRow key={l.id} list={l} />
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center text-center pt-16 px-6 pb-12">
      <div className="h-14 w-14 rounded border border-white/15 bg-[#0B0B0B] grid place-items-center mb-5 text-[oklch(0.82_0.16_75)]">
        <Inbox size={20} />
      </div>
      <div className="text-[10px] uppercase tracking-[0.18em] text-[oklch(0.82_0.16_75)] mb-2">
        NO WATCHLISTS YET
      </div>
      <h2 className="text-[18px] text-white font-medium tracking-tight max-w-[28ch] uppercase">
        Create your first watchlist to filter today&apos;s scan.
      </h2>
      <p className="text-[12.5px] text-white/70 mt-2 max-w-[44ch]">
        A watchlist groups symbols you care about. Set one as your default
        and the dashboard filters to it on load.
      </p>
      <Link
        href="/watchlists/new"
        className="mt-6 inline-flex items-center gap-2 px-3.5 py-2 rounded-sm border border-[oklch(0.82_0.16_75/0.5)] bg-[oklch(0.82_0.16_75/0.14)] text-[oklch(0.82_0.16_75)] text-[11px] uppercase tracking-[0.12em] hover:bg-[oklch(0.82_0.16_75/0.22)]"
      >
        + NEW WATCHLIST
      </Link>
    </div>
  );
}
