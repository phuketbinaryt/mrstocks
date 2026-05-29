'use client';

import { useReducedMotion } from '@/lib/hooks/use-reduced-motion';

/**
 * Animated illustration of an SMA20 / SMA200 cluster forming. The two MA lines
 * start "wide" and converge into a tight band (transform-only CSS keyframes),
 * a dashed cluster band fades in, and the current-price marker pulses.
 *
 * Reduced-motion: renders the CONVERGED tight state directly — the MA lines sit
 * at their final offsets, the cluster band is at full opacity, and the price
 * marker is static (no morph, no fade-in, no pulse).
 *
 * The threshold bullets use the REAL scanner states + thresholds.
 */
export default function MethodViz() {
  const reduced = useReducedMotion();

  // viewBox geometry (responsive via width="100%"); use the desktop canvas.
  const W = 720;
  const H = 240;
  const cy = H / 2;

  // Gentle wave for each MA. The fast MA starts 30px high, slow MA 28px low;
  // the CSS keyframes translate them toward the center band. When reduced, we
  // bake the convergence into the path offset and skip the keyframes.
  const fastOffset = reduced ? 8 : -30; // final tight position ≈ +8 (−30 +38 keyframe)
  const slowOffset = reduced ? 2 : 28; //  final tight position ≈ +2 (+28 −26 keyframe)

  function smoothPath(yOffset: number, amp: number, freq: number, phase = 0): string {
    const pts: string[] = [];
    const N = 32;
    for (let i = 0; i <= N; i++) {
      const x = (i / N) * W;
      const y = cy + yOffset + Math.sin((i / N) * Math.PI * freq + phase) * amp;
      pts.push(`${i === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`);
    }
    return pts.join(' ');
  }

  return (
    <section id="how-it-works" className="border-y border-white/12 bg-[#050505] px-4 md:px-8 py-10 md:py-16">
      <div className="mx-auto max-w-[1180px]">
        <div className="grid grid-cols-1 items-center gap-6 md:grid-cols-2 md:gap-12">
          {/* LEFT — copy */}
          <div className="flex flex-col gap-3">
            <span className="text-[10px] uppercase tracking-[0.22em] text-[oklch(0.82_0.16_75)]">
              METHOD
            </span>
            <h2 className="text-[28px] md:text-[40px] uppercase leading-[1.05] tracking-tight text-white">
              WHAT A &ldquo;TIGHT POWER-ZONE&rdquo; LOOKS LIKE.
            </h2>
            <p className="max-w-[58ch] text-[13px] leading-relaxed text-white/75">
              We watch the 20-period and 200-period SMAs on 2-minute bars. When they compress into a
              narrow ATR-normalized band — and price sits inside the prior 45-minute cluster — we
              flag the setup and grade its state.
            </p>
            <ul className="mt-3 flex flex-col gap-2 text-[11.5px] uppercase tracking-[0.06em] text-white/80">
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[oklch(0.74_0.17_250)]" />
                SMA20 / SMA200 distance &le; 0.75 ATR &rarr; NARROW
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[oklch(0.80_0.16_72)]" />
                &ge; 1.5 ATR + price far from 20MA &rarr; WIDE SNAPBACK
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[oklch(0.78_0.16_150)]" />
                &ge; 1.5 ATR + price near 20MA &rarr; TRENDING
              </li>
            </ul>
          </div>

          {/* RIGHT — SVG viz */}
          <div className="relative overflow-hidden rounded-sm border border-white/15 bg-black p-4">
            <div className="mb-3 flex items-center justify-between text-[10px] uppercase tracking-[0.14em] text-white/55">
              <span>NVDA · 2M BARS · ILLUSTRATIVE</span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[oklch(0.74_0.17_250)]" /> SMA20
                <span className="ml-2 h-1.5 w-1.5 rounded-full bg-[oklch(0.82_0.16_75)]" /> SMA200
              </span>
            </div>
            <svg
              width={W}
              height={H}
              viewBox={`0 0 ${W} ${H}`}
              className="h-auto w-full"
              role="img"
              aria-label="SMA20 and SMA200 converging into a tight cluster band"
            >
              {/* horizontal grid */}
              {[0.2, 0.4, 0.6, 0.8].map((p, i) => (
                <line key={i} x1="0" x2={W} y1={H * p} y2={H * p} stroke="rgba(255,255,255,0.05)" />
              ))}
              {/* cluster band — fades in at the end (or full opacity when reduced) */}
              <rect
                x="0"
                y={cy - 14}
                width={W}
                height="28"
                fill="oklch(0.82 0.16 75 / 0.10)"
                stroke="oklch(0.82 0.16 75 / 0.30)"
                strokeDasharray="3 3"
                className={reduced ? '' : 'ms-sma-cluster'}
                opacity={reduced ? 1 : undefined}
              />
              {/* SMA20 (fast) */}
              <path
                d={smoothPath(fastOffset, 6, 6)}
                fill="none"
                stroke="oklch(0.74 0.17 250)"
                strokeWidth="1.8"
                className={reduced ? '' : 'ms-sma-fast'}
              />
              {/* SMA200 (slow) */}
              <path
                d={smoothPath(slowOffset, 4, 4, 1.2)}
                fill="none"
                stroke="oklch(0.82 0.16 75)"
                strokeWidth="1.8"
                className={reduced ? '' : 'ms-sma-slow'}
              />
              {/* current-price marker */}
              <circle
                cx={W - 26}
                cy={cy}
                r="5"
                fill="oklch(0.82 0.16 75)"
                className={reduced ? '' : 'ms-price-pulse'}
              />
              <line
                x1={W - 26}
                x2={W - 26}
                y1={cy - 16}
                y2={cy + 16}
                stroke="oklch(0.82 0.16 75)"
                strokeWidth="1"
                opacity="0.5"
              />
              <text
                x={W - 70}
                y={cy - 22}
                fill="oklch(0.82 0.16 75)"
                fontSize="10"
                fontFamily="ui-monospace, monospace"
                letterSpacing="1.5"
              >
                INSIDE
              </text>
            </svg>
            <div className="mt-3 flex items-center justify-between text-[9.5px] uppercase tracking-[0.14em] text-white/55">
              <span>T-90 · WIDE</span>
              <span className="text-[oklch(0.82_0.16_75)]">&rarr;</span>
              <span className="text-white">T-0 · CLUSTER FORMED · NARROW</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
