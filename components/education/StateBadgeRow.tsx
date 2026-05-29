// Renders all six real StateBadge chips with a one-line meaning per state.
// This is the single source of "what the badges look like" in education —
// it imports the production StateBadge, so the article shows pixel-identical
// chips. State ids + meanings are kept verbatim from the scanner ground truth.
import StateBadge from '@/components/dashboard/StateBadge';

interface StateRow {
  id: string;
  meaning: string;
}

// Ordered to lead with the primary setup (NARROW) then the others.
const STATE_ROWS: StateRow[] = [
  { id: 'narrow', meaning: 'MAs tight and flat — the primary coil. Best state.' },
  { id: 'wide_snapback', meaning: 'Stretched ≥1.5 ATR and ≥1.0 ATR off the fast MA — watch the reversal back to 20/200.' },
  { id: 'trending_near_20', meaning: 'Stretched ≥1.5 ATR but price still near the fast MA — only events near 20/200.' },
  { id: 'watch_loose', meaning: 'MAs close but not flat enough for NARROW — on watch.' },
  { id: 'too_tight', meaning: 'MA gap below the tight minimum — no expansion to trade yet.' },
  { id: 'middle', meaning: 'Neither narrow nor wide enough — unremarkable.' },
];

export default function StateBadgeRow() {
  return (
    <div className="my-5 rounded-sm border border-white/12 bg-[#0B0B0B] divide-y divide-white/8">
      {STATE_ROWS.map((row) => (
        <div
          key={row.id}
          className="flex items-center gap-3 px-3.5 py-2.5"
        >
          <span className="shrink-0 w-[132px]">
            <StateBadge state={row.id} size="md" />
          </span>
          <span className="text-[12.5px] leading-snug text-white/75">
            {row.meaning}
          </span>
        </div>
      ))}
    </div>
  );
}
