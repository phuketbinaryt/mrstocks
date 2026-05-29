'use client';

import { useEffect, useMemo, useState } from 'react';
import { Bell } from 'lucide-react';
import { useReducedMotion } from '@/lib/hooks/use-reduced-motion';

interface HeroScannerProps {
  /** Mobile variant — shorter timestamps + tighter type. */
  compact?: boolean;
}

type LogLine =
  | { t: string; tShort: string; kind: 'sys' | 'alert'; text: string; tone: ToneKey }
  | {
      t: string;
      tShort: string;
      kind: 'eval';
      sym: string;
      state: string;
      score: number;
      tone: ToneKey;
      fire: boolean;
    };

type ToneKey = 'cyan' | 'amber' | 'green' | 'red';

const TONES: Record<ToneKey, string> = {
  cyan: 'oklch(0.78 0.12 200)',
  amber: 'oklch(0.82 0.16 75)',
  green: 'oklch(0.78 0.16 150)',
  red: 'oklch(0.74 0.17 28)',
};

/**
 * Animated scanner terminal that streams one log line every 380ms, holds the
 * completed log for 3.5s, then loops. Replaces the Phase-1 ScannerLogStatic
 * placeholder. State names are the REAL scanner states (NARROW / TRENDING /
 * WIDE SNAPBACK) — never invented labels.
 *
 * Reduced-motion: renders ALL lines immediately with no cursor and no loop.
 */
export default function HeroScanner({ compact = false }: HeroScannerProps) {
  const reduced = useReducedMotion();

  const lines = useMemo<LogLine[]>(
    () => [
      { t: '09:14:58', tShort: '14:58', kind: 'sys', text: 'INIT scanner v2.4', tone: 'cyan' },
      { t: '09:14:59', tShort: '14:59', kind: 'sys', text: 'LOAD 2m bars · pre-market ✓', tone: 'cyan' },
      { t: '09:15:00', tShort: '15:00', kind: 'eval', sym: 'NVDA', state: 'NARROW', score: 100, tone: 'amber', fire: true },
      { t: '09:15:00', tShort: '15:00', kind: 'eval', sym: 'AAPL', state: 'NARROW', score: 96, tone: 'amber', fire: true },
      { t: '09:15:01', tShort: '15:01', kind: 'eval', sym: 'MSFT', state: 'TRENDING', score: 94, tone: 'green', fire: true },
      { t: '09:15:01', tShort: '15:01', kind: 'eval', sym: 'META', state: 'WIDE SNAPBACK', score: 88, tone: 'amber', fire: false },
      { t: '09:15:02', tShort: '15:02', kind: 'eval', sym: 'AMD', state: 'TRENDING', score: 85, tone: 'green', fire: false },
      { t: '09:15:02', tShort: '15:02', kind: 'sys', text: 'FOUND 47 candidates', tone: 'amber' },
      { t: '09:15:03', tShort: '15:03', kind: 'alert', text: 'alerts firing → email + push', tone: 'green' },
      { t: '09:15:03', tShort: '15:03', kind: 'sys', text: 'DONE · 4.8s', tone: 'cyan' },
    ],
    [],
  );

  // Stream one line at a time, then hold + loop. Reduced-motion shows all
  // lines via `visibleCount` below (the streaming state is ignored).
  const [streamed, setStreamed] = useState(1);
  const visibleCount = reduced ? lines.length : streamed;

  useEffect(() => {
    // No streaming under reduced-motion — the render uses lines.length.
    if (reduced) return;
    if (streamed >= lines.length) {
      // Hold the completed log, then loop. setState is deferred (inside the
      // timeout) so we don't trip react-hooks/set-state-in-effect.
      const reset = setTimeout(() => setStreamed(1), 3500);
      return () => clearTimeout(reset);
    }
    const tick = setTimeout(() => setStreamed((v) => v + 1), 380);
    return () => clearTimeout(tick);
  }, [reduced, streamed, lines.length]);

  return (
    <div className="relative h-full overflow-hidden rounded-sm border border-white/15 bg-[#050505]">
      {/* faux header */}
      <div className="flex h-7 items-center gap-2 border-b border-white/12 bg-[#0B0B0B] px-3">
        <span className="h-1.5 w-1.5 shrink-0 animate-pulse rounded-full bg-[oklch(0.78_0.16_150)]" />
        <span className="whitespace-nowrap text-[10px] uppercase tracking-[0.18em] text-[oklch(0.78_0.16_150)]">
          LIVE · SCANNER
        </span>
        <span className="ml-auto whitespace-nowrap text-[10px] uppercase tracking-[0.12em] text-white/55">
          {compact ? '503 SYMBOLS' : '2-MIN BARS · 503 SYMBOLS'}
        </span>
      </div>

      <div
        className={`font-mono tabular-nums leading-[1.6] ${
          compact ? 'p-3 text-[10.5px]' : 'p-4 text-[11.5px]'
        }`}
      >
        {lines.slice(0, visibleCount).map((l, i) => (
          <div key={i} className="flex items-baseline gap-2">
            <span className="shrink-0 text-white/45">{compact ? l.tShort : l.t}</span>
            <span className="shrink-0 text-[oklch(0.82_0.16_75/0.5)]">│</span>
            {l.kind === 'eval' ? (
              <span className="flex min-w-0 flex-wrap items-baseline gap-1.5">
                <span className="shrink-0 uppercase text-white/55">EVAL</span>
                <span className="shrink-0 text-[oklch(0.86_0.14_75)]">{l.sym}</span>
                <span className="shrink-0 text-white/45">&rarr;</span>
                <span className="shrink-0 whitespace-nowrap" style={{ color: TONES[l.tone] }}>
                  {l.state}
                </span>
                {!compact && <span className="shrink-0 text-white/45">·</span>}
                <span className="shrink-0 whitespace-nowrap text-white">
                  {compact ? l.score : `SCORE ${l.score}`}
                </span>
                {l.fire ? (
                  <span className="shrink-0 rounded-sm border border-[oklch(0.78_0.16_150/0.5)] bg-[oklch(0.78_0.16_150/0.18)] px-1 py-px text-[9px] uppercase tracking-[0.14em] text-[oklch(0.78_0.16_150)]">
                    PASS
                  </span>
                ) : (
                  <span className="shrink-0 rounded-sm border border-white/15 px-1 py-px text-[9px] uppercase tracking-[0.14em] text-white/45">
                    WATCH
                  </span>
                )}
              </span>
            ) : l.kind === 'alert' ? (
              <span className="flex min-w-0 items-baseline gap-1.5">
                <span className="shrink-0 uppercase text-[oklch(0.82_0.16_75)]">ALERT</span>
                <span className="min-w-0" style={{ color: TONES[l.tone] }}>
                  {l.text}
                </span>
                <Bell size={10} className="shrink-0 text-[oklch(0.78_0.16_150)]" />
              </span>
            ) : (
              <span className="flex min-w-0 gap-1.5">
                <span className="shrink-0 uppercase text-white/55">SYS</span>
                <span className="min-w-0" style={{ color: TONES[l.tone] }}>
                  {l.text}
                </span>
              </span>
            )}
          </div>
        ))}
        {!reduced && visibleCount < lines.length && (
          <div className="mt-1 flex gap-2">
            <span className="animate-pulse text-[oklch(0.82_0.16_75)]">▌</span>
          </div>
        )}
      </div>
    </div>
  );
}
