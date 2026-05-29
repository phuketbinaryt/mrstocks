'use client';

import { useEffect, useState } from 'react';
import { useReducedMotion } from '@/lib/hooks/use-reduced-motion';

/**
 * Animated "big numbers" band. Each tile counts up from 0 to its target over
 * 1600ms (easeOutCubic via requestAnimationFrame). Under prefers-reduced-motion
 * the final value renders immediately (no rAF).
 *
 * HONESTY: the original design prototype hardcoded fabricated operational
 * totals ("29,104 alerts delivered", "47,840 candidates", "99.4% 12-mo uptime").
 * The product + alerts only launched recently, so those totals are NOT
 * defensible and were intentionally dropped. The figures below are STRUCTURAL
 * facts about how the scanner works (universe size, cadence, bar granularity,
 * number of setup states) — true by construction, not invented usage metrics.
 *
 * TODO(user): replace with real figures. Confirm/correct each value below; if
 * you have a defensible cumulative candidate count from the prod scanner you
 * can add it back as a fifth tile with an honest, clearly-rounded number.
 */
const STATS: BigStatConfig[] = [
  {
    label: 'SYMBOLS SCANNED',
    target: 500,
    prefix: '~',
    hint: 'US LARGE-CAPS · EVERY MORNING',
    tone: '#fff',
  },
  {
    label: 'SCAN TIME',
    target: 9.15,
    decimals: 2,
    valueOverride: '09:15',
    hint: 'NEW YORK · PRE-MARKET',
    tone: 'oklch(0.82 0.16 75)',
  },
  {
    label: 'BAR GRANULARITY',
    target: 2,
    suffix: '-MIN',
    hint: 'SMA20 × SMA200 BARS',
    tone: 'oklch(0.78 0.12 200)',
  },
  {
    label: 'SETUP STATES',
    target: 6,
    hint: 'NARROW · WIDE SNAPBACK · TRENDING …',
    tone: 'oklch(0.78 0.16 150)',
  },
];

interface BigStatConfig {
  label: string;
  /** Numeric target used to drive the count-up animation. */
  target: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  /** If set, render this fixed string instead of the formatted number
   *  (e.g. a clock time). The count-up still drives progress 0→1. */
  valueOverride?: string;
  hint: string;
  tone: string;
}

export default function BigStats() {
  return (
    <section className="px-4 md:px-8 py-10 md:py-16">
      <div className="mx-auto max-w-[1180px]">
        <div className="mb-8 text-center">
          <span className="text-[10px] uppercase tracking-[0.22em] text-[oklch(0.82_0.16_75)]">
            HOW THE SCANNER WORKS
          </span>
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          {STATS.map((s) => (
            <BigStat key={s.label} {...s} />
          ))}
        </div>
      </div>
    </section>
  );
}

function BigStat({
  label,
  target,
  decimals = 0,
  prefix = '',
  suffix = '',
  valueOverride,
  hint,
  tone,
}: BigStatConfig) {
  const value = useCountUp(target, 1600, decimals);
  const display = valueOverride
    ? valueOverride
    : Number(value).toLocaleString('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      });

  return (
    <div className="flex flex-col gap-1.5 rounded-sm border border-white/12 bg-[#0B0B0B] p-5">
      <span className="text-[9.5px] uppercase tracking-[0.18em] text-[oklch(0.78_0.12_200)]">
        {label}
      </span>
      <span
        className="font-mono text-[32px] md:text-[36px] leading-none tabular-nums"
        style={{ color: tone }}
      >
        {prefix}
        {display}
        {suffix}
      </span>
      <span className="text-[10px] uppercase tracking-[0.1em] text-white/55">{hint}</span>
    </div>
  );
}

/**
 * Count from 0 to `target` over `duration` ms with an easeOutCubic curve.
 * When prefers-reduced-motion is set, returns the final value immediately and
 * never schedules a frame.
 */
function useCountUp(target: number, duration = 1600, decimals = 0): string {
  const reduced = useReducedMotion();
  const [v, setV] = useState(0);

  useEffect(() => {
    // No animation under reduced-motion — the final value renders directly
    // (see `displayed` below). The rAF callback defers setState out of the
    // effect body, so we don't trip react-hooks/set-state-in-effect.
    if (reduced) return;
    const start = performance.now();
    let raf = 0;
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
      setV(target * eased);
      if (t < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [reduced, target, duration]);

  const displayed = reduced ? target : v;
  return displayed.toFixed(decimals);
}
