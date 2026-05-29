// A horizontal stacked bar visualizing how a candidate's score is composed:
// state_score + liquidity_score + location_score, clamped to 0–100. Segment
// widths are proportional to the (pre-clamp) raw contributions, and the
// total shown is the clamped value — matching classify_candidate in
// scanner.py: score = clamp(0, 100, state + liquidity + location).
export interface ScoreBreakdownProps {
  // Raw contributions (pre-clamp).
  state: number;
  liquidity: number;
  location: number;
  // Optional caption describing the example.
  caption?: string;
}

const SEG = {
  state: { color: 'oklch(0.74 0.17 250)', label: 'State' },
  liquidity: { color: 'oklch(0.78 0.16 150)', label: 'Liquidity' },
  location: { color: 'oklch(0.82 0.16 75)', label: 'Location' },
};

export default function ScoreBreakdown({
  state,
  liquidity,
  location,
  caption,
}: ScoreBreakdownProps) {
  const raw = state + liquidity + location;
  const total = Math.max(0, Math.min(100, Math.round(raw)));
  // Bar segments scale against the raw sum so the visual sums to the bar
  // width even when the raw total exceeds 100 (the clamp is shown in text).
  const denom = Math.max(raw, 1);
  const seg = (v: number) => `${(v / denom) * 100}%`;

  return (
    <div className="my-5 rounded-sm border border-white/12 bg-[#0B0B0B] px-3.5 py-3.5">
      <div className="flex h-7 w-full overflow-hidden rounded-sm border border-white/15">
        <div style={{ width: seg(state), background: SEG.state.color }} />
        <div style={{ width: seg(liquidity), background: SEG.liquidity.color }} />
        <div style={{ width: seg(location), background: SEG.location.color }} />
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] font-mono">
        <Seg color={SEG.state.color} label={SEG.state.label} value={state} />
        <span className="text-white/40">+</span>
        <Seg color={SEG.liquidity.color} label={SEG.liquidity.label} value={liquidity} />
        <span className="text-white/40">+</span>
        <Seg color={SEG.location.color} label={SEG.location.label} value={location} />
        <span className="text-white/40">=</span>
        <span className="text-white font-medium tabular-nums">
          {total}
          {raw > 100 && <span className="text-white/45"> (capped from {Math.round(raw)})</span>}
        </span>
      </div>
      {caption && (
        <p className="mt-2 text-[12px] leading-snug text-white/65">{caption}</p>
      )}
    </div>
  );
}

function Seg({ color, label, value }: { color: string; label: string; value: number }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="h-2 w-2 rounded-sm" style={{ background: color }} />
      <span className="text-white/70">{label}</span>
      <span className="text-white tabular-nums">{Math.round(value)}</span>
    </span>
  );
}
