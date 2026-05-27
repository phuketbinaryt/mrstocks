'use client';
// Main dashboard card. role="link" + Enter/Space keyboard handlers per a11y
// requirement (cards-as-links, not nested buttons). Click navigates to
// `/dashboard/[symbol]`. Header strip uses a lighter bg than the body to
// give the card visual structure and stop the grid from reading as solid
// black. When lists+symbolsByList props are present, the header also gets
// a "+" trigger that opens AddToWatchlistMenu.
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import { Plus } from 'lucide-react';
import StateBadge from './StateBadge';
import ScoreMeter from './ScoreMeter';
import DirBadge, { watchToDir } from './DirBadge';
import AddToWatchlistMenu from './AddToWatchlistMenu';
import type { DashboardCandidate } from '@/lib/scans/candidate-types';

export interface StockCardProps {
  candidate: DashboardCandidate;
  hrefBase?: string; // defaults to /dashboard
  /** When provided, the card shows a "+ LIST" trigger that opens the
   *  AddToWatchlistMenu. Pass undefined to suppress (e.g. on /watchlists
   *  detail or /history archives). */
  lists?: { id: string; name: string }[];
  symbolsByList?: Record<string, string[]>;
}

export default function StockCard({
  candidate,
  hrefBase = '/dashboard',
  lists,
  symbolsByList,
}: StockCardProps) {
  const router = useRouter();
  const gapPositive = candidate.gap >= 0;
  const href = `${hrefBase}/${encodeURIComponent(candidate.symbol)}`;
  const [menuOpen, setMenuOpen] = useState(false);
  const showMenu = Array.isArray(lists) && symbolsByList !== undefined;

  const open = useCallback(() => {
    router.push(href);
  }, [router, href]);

  const onKey = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (menuOpen) return; // don't navigate while menu is open
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      open();
    }
  };

  return (
    <div
      role="link"
      tabIndex={0}
      aria-label={`${candidate.symbol} — open detail`}
      onClick={() => {
        if (menuOpen) return;
        open();
      }}
      onKeyDown={onKey}
      className="group relative text-left w-full rounded-sm border border-white/15 bg-[#0B0B0B] hover:border-white/30 hover:bg-[#0E0E10] transition-colors flex flex-col focus:outline-none focus-visible:ring-2 focus-visible:ring-[oklch(0.74_0.17_250)] cursor-pointer overflow-visible"
    >
      {/* HEADER — lighter bg, ticker + state + dir + add-to-list trigger */}
      <header className="relative px-3.5 py-2.5 bg-[#15171B] border-b border-white/8 rounded-t-sm flex items-center gap-2">
        <span className="font-mono text-[20px] leading-none tracking-tight text-[oklch(0.86_0.14_75)] font-medium shrink-0">
          {candidate.symbol}
        </span>
        <StateBadge state={candidate.state} />
        <DirBadge dir={watchToDir(candidate.watch)} />

        {showMenu && (
          <div className="ml-auto relative">
            <button
              type="button"
              aria-label="Add to watchlist"
              aria-expanded={menuOpen}
              aria-haspopup="menu"
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpen((v) => !v);
              }}
              className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-sm border border-white/15 bg-[#0B0B0B] text-white/65 hover:text-[oklch(0.82_0.16_75)] hover:border-[oklch(0.82_0.16_75/0.5)] text-[9.5px] uppercase tracking-[0.12em]"
            >
              <Plus size={11} /> LIST
            </button>
            {menuOpen && (
              <AddToWatchlistMenu
                symbol={candidate.symbol}
                lists={lists!}
                symbolsByList={symbolsByList!}
                onClose={() => setMenuOpen(false)}
              />
            )}
          </div>
        )}
      </header>

      {/* BODY — price/gap/score, divider, metrics grid */}
      <div className="px-3.5 pt-3 pb-3.5 flex flex-col gap-3">
        <div className="flex items-end justify-between gap-3">
          <div className="flex items-baseline gap-2 min-w-0">
            <span className="font-mono text-[26px] leading-none tabular-nums text-white tracking-tight">
              ${candidate.lastPrice.toFixed(2)}
            </span>
            <span
              className={`font-mono text-[12px] tabular-nums ${
                gapPositive
                  ? 'text-[oklch(0.78_0.16_150)]'
                  : 'text-[oklch(0.74_0.17_28)]'
              }`}
            >
              {gapPositive ? '+' : ''}
              {candidate.gap.toFixed(2)}%
            </span>
          </div>
          <ScoreMeter score={candidate.score} />
        </div>

        <div className="h-px bg-white/8" />

        <div className="grid grid-cols-2 gap-x-3 gap-y-3 text-[11px]">
          <Metric label="MA dist" value={`${candidate.maDistanceAtr.toFixed(2)} ATR`} />
          <Metric
            label="MA dist %"
            value={`${(candidate.maDistancePct * 100).toFixed(2)}%`}
          />
          <Metric label="ATR" value={candidate.atr.toFixed(2)} />
          <Metric label="Vol $" value={formatVolume(candidate.avgDollarVolume)} />
          <Metric
            label="Slope fast"
            value={candidate.slopeFast.toFixed(2)}
            signed
          />
          <Metric
            label="Prior45"
            value={candidate.prior45Position ?? '—'}
            mono={false}
            accent={candidate.prior45Position === 'Inside' ? 'inside' : 'edge'}
          />
        </div>
      </div>
    </div>
  );
}

function formatVolume(usd: number): string {
  if (!Number.isFinite(usd) || usd <= 0) return '—';
  if (usd >= 1_000_000_000) return `${(usd / 1_000_000_000).toFixed(1)}B`;
  if (usd >= 1_000_000) return `${(usd / 1_000_000).toFixed(1)}M`;
  if (usd >= 1_000) return `${(usd / 1_000).toFixed(1)}K`;
  return usd.toFixed(0);
}

interface MetricProps {
  label: string;
  value: string;
  signed?: boolean;
  mono?: boolean;
  accent?: 'inside' | 'edge';
}

function Metric({
  label,
  value,
  signed = false,
  mono = true,
  accent,
}: MetricProps) {
  let tone = 'text-white';
  if (signed) {
    const n = parseFloat(value);
    if (n > 0) tone = 'text-[oklch(0.78_0.16_150)]';
    else if (n < 0) tone = 'text-[oklch(0.74_0.17_28)]';
  }
  if (accent === 'inside') tone = 'text-[oklch(0.74_0.17_250)]';
  if (accent === 'edge') tone = 'text-[oklch(0.80_0.16_72)]';
  return (
    <div className="flex flex-col gap-0.5 min-w-0">
      <span className="text-[oklch(0.78_0.12_200)] uppercase tracking-[0.06em] text-[9.5px] leading-tight">
        {label}
      </span>
      <span
        className={`${mono ? 'font-mono' : ''} tabular-nums text-[13px] leading-tight ${tone} truncate`}
      >
        {signed && parseFloat(value) > 0 ? '+' : ''}
        {value}
      </span>
    </div>
  );
}
