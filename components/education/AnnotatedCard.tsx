// Renders a real StockCard (production component) for a fixed sample
// candidate, with a numbered legend explaining each field. The StockCard is
// rendered WITHOUT the lists/symbolsByList props, so the "+ LIST" trigger
// never appears — this is a clean display card for teaching.
import StockCard from '@/components/dashboard/StockCard';
import type { DashboardCandidate } from '@/lib/scans/candidate-types';

// A NARROW, liquid, above-cluster name scoring 96 — the canonical A+ read.
const SAMPLE: DashboardCandidate = {
  symbol: 'NVDA',
  state: 'narrow',
  watch: 'LONG_IF_OPEN_ABOVE_CLUSTER',
  location: 'above_cluster',
  prior45Position: 'Upper #1',
  prior45Action: 'LONG_CONTINUATION_OK',
  score: 96,
  lastPrice: 138.42,
  gap: 0.84,
  maDistanceAtr: 0.31,
  maDistancePct: 0.0022,
  atr: 3.96,
  avgDollarVolume: 18_400_000_000,
  slopeFast: 0.04,
};

interface LegendItem {
  n: number;
  label: string;
  text: string;
}

const LEGEND: LegendItem[] = [
  { n: 1, label: 'Ticker', text: 'The symbol. Click any card on the dashboard to open its detail page.' },
  { n: 2, label: 'State badge', text: 'The setup state — here NARROW, the primary coil. Read this first.' },
  { n: 3, label: 'Watch direction', text: 'The conditional bias: LONG · ABOVE CLUSTER means go long only if the open confirms above both MAs.' },
  { n: 4, label: 'Price + gap %', text: 'Last price and the gap vs the previous RTH close, in percent.' },
  { n: 5, label: 'Score meter', text: 'Composite ranking 0–100 (state + liquidity + location). Not a win probability.' },
  { n: 6, label: 'Metric grid', text: 'MA dist (ATR), MA dist %, ATR, Vol $, Slope fast, and the Prior45 zone.' },
];

export default function AnnotatedCard() {
  return (
    <div className="my-5">
      <div className="max-w-[340px]">
        <StockCard candidate={SAMPLE} />
      </div>
      <ol className="mt-4 space-y-2">
        {LEGEND.map((item) => (
          <li key={item.n} className="flex items-start gap-2.5">
            <span className="mt-0.5 shrink-0 inline-flex h-5 w-5 items-center justify-center rounded-full bg-[oklch(0.34_0.10_75_/_0.3)] text-[oklch(0.84_0.16_75)] font-mono text-[11px] font-medium">
              {item.n}
            </span>
            <span className="text-[12.5px] leading-snug text-white/75">
              <strong className="text-white font-semibold">{item.label}</strong>{' '}
              — {item.text}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}
