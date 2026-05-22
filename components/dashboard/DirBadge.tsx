// "WATCH" direction chip. Maps the scanner's watch enum to a labeled arrow.
// Ported from ms-dashboard.jsx DirBadge.

export type Dir = 'long_above' | 'short_below' | 'wait';

export interface DirBadgeProps {
  dir: Dir;
}

const MAP: Record<Dir, { label: string; arrow: string }> = {
  long_above: { label: 'LONG · ABOVE CLUSTER', arrow: '↑' },
  short_below: { label: 'SHORT · BELOW CLUSTER', arrow: '↓' },
  wait: { label: 'WAIT · NO TRIGGER', arrow: '·' },
};

/**
 * Translate the scanner's `watch` enum (e.g.
 * `LONG_IF_OPEN_ABOVE_CLUSTER`) into the badge's dir.
 */
export function watchToDir(watch: string | null | undefined): Dir {
  if (!watch) return 'wait';
  const w = watch.toUpperCase();
  if (w.includes('LONG') && w.includes('ABOVE')) return 'long_above';
  if (w.includes('SHORT') && w.includes('BELOW')) return 'short_below';
  return 'wait';
}

export default function DirBadge({ dir }: DirBadgeProps) {
  const v = MAP[dir];
  return (
    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded font-mono text-[9.5px] uppercase tracking-[0.08em] text-white/75 border border-white/22 bg-white/[0.02] whitespace-nowrap">
      <span className="text-white/65">{v.arrow}</span>
      {v.label}
    </span>
  );
}
