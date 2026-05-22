import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { requireActiveMembership } from '@/lib/membership/require';
import { getWatchlistByIdForUser } from '@/lib/watchlists/queries';
import {
  getCandidatesForScan,
  getLatestScan,
} from '@/lib/scans/latest';
import { toDashboardCandidate } from '@/lib/scans/candidate-types';
import SymbolChip from '@/components/watchlists/SymbolChip';
import SymbolSearch from '@/components/watchlists/SymbolSearch';
import StockCard from '@/components/dashboard/StockCard';
import TopBar from '@/components/dashboard/TopBar';

export const dynamic = 'force-dynamic';

interface PageProps {
  // Next 15: params is a Promise.
  params: Promise<{ id: string }>;
}

export default async function WatchlistDetailPage({ params }: PageProps) {
  const { id } = await params;
  const session = await requireActiveMembership(`/watchlists/${id}`);
  const userId = session.user!.id!;
  const list = await getWatchlistByIdForUser(userId, id);
  if (!list) return notFound();

  const scan = await getLatestScan();
  const allCandidates = scan ? await getCandidatesForScan(scan.id) : [];
  const symbolSet = new Set(list.symbols);
  const matching = allCandidates
    .filter((c) => symbolSet.has(c.symbol))
    .map(toDashboardCandidate);

  return (
    <main className="min-h-screen flex flex-col bg-black text-white">
      <TopBar
        generatedAt={scan?.generatedAt ?? new Date()}
        title="WATCHLISTS"
      />
      <div className="flex items-center gap-3 px-4 md:px-5 h-11 md:h-12 border-b border-white/12 bg-[#050505]">
        <Link
          href="/watchlists"
          aria-label="Back"
          className="-ml-1 p-1.5 rounded-sm text-white/75 hover:text-white hover:bg-white/10"
        >
          <ChevronLeft size={14} />
        </Link>
        <span className="text-[10px] uppercase tracking-[0.14em] text-[oklch(0.82_0.16_75)]">
          WATCHLIST
        </span>
        <span className="text-[oklch(0.82_0.16_75/0.5)]">│</span>
        <span className="text-[13px] uppercase tracking-[0.06em] text-white font-medium truncate">
          {list.name}
        </span>
        {list.isDefault && (
          <span className="text-[9px] uppercase tracking-[0.15em] px-1.5 py-[1px] rounded-sm border border-[oklch(0.82_0.16_75/0.5)] text-[oklch(0.82_0.16_75)]">
            DEFAULT
          </span>
        )}
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* SYMBOLS section */}
        <section className="px-4 md:px-5 py-5 border-b border-white/12">
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-[9.5px] uppercase tracking-[0.18em] text-[oklch(0.82_0.16_75)]">
              01
            </span>
            <h3 className="text-[12px] text-white font-medium uppercase tracking-[0.12em]">
              SYMBOLS
            </h3>
            <span className="text-[oklch(0.82_0.16_75/0.5)]">│</span>
            <span className="text-[10.5px] uppercase tracking-[0.08em] text-[oklch(0.78_0.12_200)]">
              COUNT{' '}
              <span className="text-white tabular-nums">
                {String(list.symbols.length).padStart(2, '0')}
              </span>
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5 items-center">
            {list.symbols.map((sym) => (
              <SymbolChip
                key={sym}
                watchlistId={list.id}
                symbol={sym}
              />
            ))}
            <SymbolSearch
              watchlistId={list.id}
              excluded={list.symbols}
            />
          </div>

          {list.symbols.length === 0 && (
            <div className="mt-5 border border-dashed border-white/15 rounded-sm px-4 py-6 text-center">
              <div className="text-[10px] uppercase tracking-[0.18em] text-[oklch(0.82_0.16_75)] mb-1.5">
                EMPTY LIST
              </div>
              <p className="text-[12.5px] text-white/75">
                Type a ticker above to add your first symbol. Try{' '}
                <span className="text-[oklch(0.82_0.16_75)]">NVDA</span>,{' '}
                <span className="text-[oklch(0.82_0.16_75)]">AAPL</span>,{' '}
                <span className="text-[oklch(0.82_0.16_75)]">PLTR</span>.
              </p>
            </div>
          )}
        </section>

        {/* TODAY'S SIGNALS section */}
        <section className="px-4 md:px-5 py-5">
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-[9.5px] uppercase tracking-[0.18em] text-[oklch(0.82_0.16_75)]">
              02
            </span>
            <h3 className="text-[12px] text-white font-medium uppercase tracking-[0.12em]">
              TODAY&apos;S SIGNALS
            </h3>
            <span className="text-[oklch(0.82_0.16_75/0.5)]">│</span>
            <span className="text-[10.5px] uppercase tracking-[0.08em] text-[oklch(0.78_0.12_200)]">
              HITS{' '}
              <span
                className={
                  matching.length > 0
                    ? 'text-[oklch(0.78_0.16_150)] tabular-nums'
                    : 'text-white/55 tabular-nums'
                }
              >
                {String(matching.length).padStart(2, '0')}
              </span>
            </span>
            <div className="flex-1" />
            <span className="text-[9.5px] uppercase tracking-[0.12em] text-white/55 hidden md:inline">
              FROM 09:15 NY SCAN
            </span>
          </div>

          {matching.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {matching.map((c) => (
                <StockCard key={c.symbol} candidate={c} />
              ))}
            </div>
          ) : (
            <div className="border border-dashed border-white/15 rounded-sm px-4 py-8 text-center">
              <p className="text-[12.5px] text-white/65">
                {list.symbols.length === 0
                  ? "Add symbols above to see today's scan results filtered to this list."
                  : "None of these symbols hit today's scan."}
              </p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
