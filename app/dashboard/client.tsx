'use client';
// Dashboard interactivity shell. Owns the filter state (STATE chip +
// PRIOR45 chip + LIST chip) and filters the rows in memory — the full
// scan is ~500 candidates, no extra requests needed. Receives already-
// projected DashboardCandidate rows from the server component.
import { useMemo, useState } from 'react';
import FilterRow from '@/components/dashboard/FilterRow';
import StockCard from '@/components/dashboard/StockCard';
import StatusBar from '@/components/dashboard/StatusBar';
import TopBar from '@/components/dashboard/TopBar';
import { STATE_FILTERS, ZONE_FILTERS } from '@/lib/scans/filters-config';
import type { DashboardCandidate } from '@/lib/scans/candidate-types';

export interface DashboardListChip {
  id: string;
  name: string;
  isDefault: boolean;
}

export interface DashboardClientProps {
  generatedAtISO: string;
  universeSize: number | null;
  barSeconds: number | null;
  candidates: DashboardCandidate[];
  lists: DashboardListChip[];
  symbolsByList: Record<string, string[]>;
  defaultListId: string | null;
}

// Match a filter id like "upper_1" against a Prior45 position string
// like "Upper #1" (case-insensitive).
function zoneMatches(filterId: string, position: string | null): boolean {
  if (filterId === 'all') return true;
  if (!position) return false;
  const p = position.toLowerCase();
  if (filterId === 'inside') return p.includes('inside');
  if (filterId === 'upper_1') return p === 'upper #1';
  if (filterId === 'upper_2') return p === 'upper #2';
  if (filterId === 'upper_3') return p === 'upper #3';
  if (filterId === 'lower_1') return p === 'lower #1';
  if (filterId === 'lower_2') return p === 'lower #2';
  if (filterId === 'lower_3') return p === 'lower #3';
  return false;
}

export default function DashboardClient({
  generatedAtISO,
  universeSize,
  barSeconds,
  candidates,
  lists,
  symbolsByList,
  defaultListId,
}: DashboardClientProps) {
  const generatedAt = new Date(generatedAtISO);
  const [state, setState] = useState<string>('all');
  const [zone, setZone] = useState<string>('all');
  // Default list chip is the user's default if set; otherwise "All signals".
  const [list, setList] = useState<string>(defaultListId ?? 'all');

  const filtered = useMemo(() => {
    const listSet =
      list === 'all' ? null : new Set(symbolsByList[list] ?? []);
    return candidates.filter((c) => {
      if (state !== 'all' && c.state !== state) return false;
      if (!zoneMatches(zone, c.prior45Position)) return false;
      if (listSet && !listSet.has(c.symbol)) return false;
      return true;
    });
  }, [candidates, state, zone, list, symbolsByList]);

  const listChips = useMemo(
    () => [
      { id: 'all', label: 'All signals' },
      ...lists.map((l) => ({
        id: l.id,
        label: l.isDefault ? `${l.name} ★` : l.name,
      })),
    ],
    [lists],
  );

  return (
    <main className="min-h-screen flex flex-col bg-black text-white">
      <TopBar generatedAt={generatedAt} />
      <FilterRow
        label="STATE"
        chips={STATE_FILTERS}
        activeId={state}
        onChange={setState}
      />
      <FilterRow
        label="PRIOR45"
        chips={ZONE_FILTERS}
        activeId={zone}
        onChange={setZone}
      />
      <FilterRow
        label="LIST"
        chips={listChips}
        activeId={list}
        onChange={setList}
      />
      <section className="flex-1 px-3 md:px-5 py-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.length === 0 ? (
          <div className="col-span-full py-12 text-center text-white/70 text-[13px]">
            No candidates match these filters.
          </div>
        ) : (
          filtered.map((c) => <StockCard key={c.symbol} candidate={c} />)
        )}
      </section>
      <StatusBar
        total={candidates.length}
        shown={filtered.length}
        universeSize={universeSize}
        barSeconds={barSeconds}
      />
    </main>
  );
}
