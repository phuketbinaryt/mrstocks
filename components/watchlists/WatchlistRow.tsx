'use client';
// One row in /watchlists. Whole-row is a Link to the detail page; the kebab
// menu stops propagation so its actions don't navigate.
import Link from 'next/link';
import KebabMenu from './KebabMenu';
import type { WatchlistSummary } from '@/lib/watchlists/types';

export interface WatchlistRowProps {
  list: WatchlistSummary;
}

function fmtUpdated(d: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York',
    day: '2-digit',
    month: 'short',
  })
    .format(d)
    .toUpperCase()
    .replace(' ', '-');
}

export default function WatchlistRow({ list }: WatchlistRowProps) {
  return (
    <div className="group relative border-b border-white/12 hover:bg-[oklch(0.82_0.16_75/0.04)] transition-colors">
      <Link
        href={`/watchlists/${list.id}`}
        className="flex items-center gap-3 px-4 md:px-5 py-3.5 focus:outline-none focus-visible:bg-[oklch(0.82_0.16_75/0.06)]"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[14px] text-white font-medium uppercase tracking-[0.04em] truncate">
              {list.name}
            </span>
            {list.isDefault && (
              <span className="text-[9px] uppercase tracking-[0.15em] px-1.5 py-[1px] rounded-sm border border-[oklch(0.82_0.16_75/0.5)] text-[oklch(0.82_0.16_75)] bg-[oklch(0.82_0.16_75/0.08)]">
                DEFAULT
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 text-[10.5px] uppercase tracking-[0.08em]">
            <span className="text-[oklch(0.78_0.12_200)]">
              SYM{' '}
              <span className="text-white tabular-nums">
                {String(list.symbolCount).padStart(2, '0')}
              </span>
            </span>
            <span className="text-[oklch(0.82_0.16_75/0.5)]">│</span>
            <span className="text-[oklch(0.78_0.12_200)]">
              TODAY{' '}
              <span
                className={
                  list.hitsToday > 0
                    ? 'text-[oklch(0.78_0.16_150)] tabular-nums'
                    : 'text-white/55 tabular-nums'
                }
              >
                {String(list.hitsToday).padStart(2, '0')}
              </span>
            </span>
            <span className="text-[oklch(0.82_0.16_75/0.5)]">│</span>
            <span className="text-white/65 tabular-nums">
              UPD {fmtUpdated(list.updatedAt)}
            </span>
          </div>
        </div>
      </Link>
      {/* Kebab is absolutely positioned so it lives "above" the link without
          nesting interactive elements. */}
      <div className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2">
        <KebabMenu
          listId={list.id}
          listName={list.name}
          isDefault={list.isDefault}
        />
      </div>
    </div>
  );
}
