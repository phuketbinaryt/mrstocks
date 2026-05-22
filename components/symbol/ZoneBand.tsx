// Prior45 horizontal zone visualization. 7 buckets across with the
// Inside slot soft-filled, current-bucket tinted by the state tone, and
// a 2px price marker with colored glow. Ported from ms-symbol.jsx
// ZoneBand. For Phase 3 we don't render absolute cluster low/mid/high
// numerics (we don't carry those from the scanner yet) — we render the
// bucket label triplet instead.
import { STATES } from '@/lib/scans/state-config';

const BUCKETS = [
  'Lower #3',
  'Lower #2',
  'Lower #1',
  'Inside',
  'Upper #1',
  'Upper #2',
  'Upper #3',
] as const;

const SHORT_LABELS = ['L3', 'L2', 'L1', 'IN', 'U1', 'U2', 'U3'] as const;

export interface ZoneBandProps {
  state: string;
  position: string | null; // one of BUCKETS
}

export default function ZoneBand({ state, position }: ZoneBandProps) {
  const tone = STATES[state]?.tone ?? 'oklch(0.70 0.01 250)';
  const stateTint = tone.replace(')', ' / 0.18)');

  const idx = position ? BUCKETS.indexOf(position as (typeof BUCKETS)[number]) : -1;
  const safeIdx = idx >= 0 ? idx : 3; // Inside as fallback
  // center of bucket → 0..1 across band
  const pos = (safeIdx + 0.5) / 7;
  const clampedPos = Math.max(0.02, Math.min(0.98, pos));

  // Inside cluster boundaries (between idx 2/3 and 3/4)
  const insideStart = 3 / 7;
  const insideEnd = 4 / 7;

  return (
    <div className="flex flex-col gap-3">
      <div className="relative h-9 rounded-sm overflow-hidden border border-white/22 bg-[#050505]">
        <div className="absolute inset-0 grid grid-cols-7">
          {BUCKETS.map((b, i) => {
            const inside = b === 'Inside';
            const here = i === safeIdx;
            return (
              <div
                key={b}
                className="border-r border-white/18 last:border-r-0 relative"
                style={{
                  background: inside
                    ? 'oklch(0.30 0.06 250 / 0.30)'
                    : 'transparent',
                }}
              >
                {here && !inside && (
                  <div
                    className="absolute inset-0"
                    style={{ background: stateTint }}
                  />
                )}
              </div>
            );
          })}
        </div>
        {/* cluster boundary lines */}
        <div
          className="absolute top-0 bottom-0 w-px bg-white/25"
          style={{ left: `${insideStart * 100}%` }}
        />
        <div
          className="absolute top-0 bottom-0 w-px bg-white/25"
          style={{ left: `${insideEnd * 100}%` }}
        />
        {/* price marker */}
        <div
          className="absolute top-0 bottom-0 w-[2px]"
          style={{
            left: `calc(${clampedPos * 100}% - 1px)`,
            background: tone,
            boxShadow: `0 0 8px ${tone}`,
          }}
        />
        <div
          className="absolute -top-1.5"
          style={{ left: `calc(${clampedPos * 100}% - 5px)` }}
        >
          <svg width="10" height="6" viewBox="0 0 10 6">
            <path d="M5 6 L0 0 L10 0 Z" fill={tone} />
          </svg>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-px text-[9.5px] font-mono uppercase tracking-[0.05em] text-white/60">
        {SHORT_LABELS.map((label, i) => (
          <span
            key={label}
            className={`text-center ${i === safeIdx ? 'text-white' : ''}`}
          >
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
