// Wraps the real ZoneBand (the dashboard's Prior45 visualization) so an
// article can show a specific zone position (e.g. "Upper #2") with a caption
// naming the zone and its exact action label from the scanner ground truth.
import ZoneBand from '@/components/symbol/ZoneBand';

export interface ZoneBandDemoProps {
  // One of the ZoneBand BUCKETS: 'Inside' | 'Upper #1..3' | 'Lower #1..3'.
  position: string;
  // State id drives the marker tone — defaults to narrow's cyan.
  state?: string;
  // Exact action label from _prior45_action in scanner.py.
  action: string;
  caption?: string;
}

export default function ZoneBandDemo({
  position,
  state = 'narrow',
  action,
  caption,
}: ZoneBandDemoProps) {
  return (
    <div className="my-5 rounded-sm border border-white/12 bg-[#0B0B0B] px-3.5 py-3.5">
      <ZoneBand state={state} position={position} />
      <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px]">
        <span className="font-mono uppercase tracking-[0.08em] text-white">
          {position}
        </span>
        <span className="text-white/40">→</span>
        <span className="font-mono uppercase tracking-[0.06em] text-[oklch(0.82_0.16_75)]">
          {action}
        </span>
      </div>
      {caption && (
        <p className="mt-1.5 text-[12px] leading-snug text-white/65">{caption}</p>
      )}
    </div>
  );
}
