'use client';

import { useReducedMotion } from '@/lib/hooks/use-reduced-motion';
import { MARKETING_SAMPLE, STATE_TONES } from '@/lib/marketing/sample-scan';

/**
 * Infinite marquee of sample candidates that sits between the Nav and Hero.
 *
 * Animated: two duplicated rows scroll left via a transform-only CSS keyframe
 * (compositor-friendly), with edge gradients masking the wrap point.
 *
 * Reduced-motion: render a single, non-scrolling row in an `overflow-hidden`
 * track (no animation, no duplication) — its final resting state.
 */
export default function TickerTape() {
  const reduced = useReducedMotion();
  const rows = reduced ? MARKETING_SAMPLE : [...MARKETING_SAMPLE, ...MARKETING_SAMPLE];

  return (
    <div className="relative border-y border-white/12 bg-[#050505] overflow-hidden">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-black to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-black to-transparent" />
      <div
        className={`flex h-9 items-center whitespace-nowrap${reduced ? '' : ' ms-marquee'}`}
        aria-hidden={!reduced}
      >
        {rows.map((r, i) => {
          const tone = STATE_TONES[r.state];
          const up = r.gap >= 0;
          return (
            <span
              key={i}
              className="inline-flex shrink-0 items-center gap-2 px-4 text-[11px] uppercase tracking-[0.06em]"
            >
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: tone }} />
              <span className="font-medium text-white">{r.symbol}</span>
              <span className="tabular-nums text-white/55">${r.price.toFixed(2)}</span>
              <span
                className={`tabular-nums ${up ? 'text-[oklch(0.78_0.16_150)]' : 'text-[oklch(0.74_0.17_28)]'}`}
              >
                {up ? '+' : ''}
                {r.gap.toFixed(2)}%
              </span>
              <span className="mx-1 text-[oklch(0.82_0.16_75/0.4)]">·</span>
              <span className="text-[oklch(0.78_0.12_200)]">{r.zone}</span>
              <span className="ml-3 text-[oklch(0.82_0.16_75/0.4)]">│</span>
            </span>
          );
        })}
      </div>
    </div>
  );
}
