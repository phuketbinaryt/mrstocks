'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { STATES } from '@/lib/scans/state-config';
import { STATE_FILTERS, ZONE_FILTERS } from '@/lib/scans/filters-config';
import { normalizeZone } from '@/lib/alerts/matches';
import { MARKETING_SAMPLE, STATE_TONES } from '@/lib/marketing/sample-scan';

/**
 * Interactive rule builder: toggle states + Prior45 zones, drag the score
 * threshold, and watch the "would fire" count recompute instantly against a
 * curated sample (NOT live DB data — labelled honestly). Conversion driver:
 * the CTA points to /pricing.
 *
 * No timed animation here, so no reduced-motion concern — recompute is instant.
 */
export default function RuleSandbox() {
  const [states, setStates] = useState<string[]>(['narrow', 'wide_snapback']);
  const [zones, setZones] = useState<string[]>(['inside']);
  const [score, setScore] = useState(85);

  const toggle = (list: string[], val: string): string[] =>
    list.includes(val) ? list.filter((x) => x !== val) : [...list, val];

  const matches = useMemo(
    () =>
      MARKETING_SAMPLE.filter(
        (r) =>
          states.includes(r.state) &&
          zones.includes(normalizeZone(r.zone)) &&
          r.score >= score,
      ),
    [states, zones, score],
  );

  const stateChips = STATE_FILTERS.filter((s) => s.id !== 'all');
  const zoneChips = ZONE_FILTERS.filter((z) => z.id !== 'all');

  return (
    <section className="px-4 md:px-8 py-10 md:py-16">
      <div className="mx-auto max-w-[1180px]">
        <div className="mb-7 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-[0.22em] text-[oklch(0.82_0.16_75)]">
              TRY IT · SAMPLE SCAN
            </span>
            <h2 className="mt-3 text-[26px] md:text-[40px] uppercase leading-[1.05] tracking-tight text-white">
              BUILD A RULE. SEE IT MATCH.
            </h2>
          </div>
          <p className="max-w-[44ch] text-[13px] leading-relaxed text-white/75">
            Toggle states, zones, and the score threshold. The count below recomputes in real time
            against a sample of a recent scan.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-[1.4fr_1fr] md:gap-6">
          {/* LEFT — controls */}
          <div className="flex flex-col gap-5 rounded-sm border border-white/15 bg-[#0B0B0B] p-5">
            <div className="flex flex-col gap-2">
              <span className="text-[10.5px] uppercase tracking-[0.12em] text-[oklch(0.78_0.12_200)]">
                STATES <span className="text-white/45">· {states.length} SELECTED</span>
              </span>
              <div className="flex flex-wrap gap-1.5">
                {stateChips.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setStates(toggle(states, s.id))}
                    aria-pressed={states.includes(s.id)}
                    className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-sm border px-2.5 py-1 text-[11px] uppercase tracking-[0.04em] transition-colors ${
                      states.includes(s.id)
                        ? 'border-[oklch(0.82_0.16_75/0.55)] bg-[oklch(0.82_0.16_75/0.10)] text-white'
                        : 'border-white/18 text-white/70 hover:border-white/30'
                    }`}
                  >
                    <span
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ background: STATE_TONES[s.id] }}
                    />
                    {STATES[s.id]?.label ?? s.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-[10.5px] uppercase tracking-[0.12em] text-[oklch(0.78_0.12_200)]">
                PRIOR45 ZONES <span className="text-white/45">· {zones.length} SELECTED</span>
              </span>
              <div className="flex flex-wrap gap-1.5">
                {zoneChips.map((z) => (
                  <button
                    key={z.id}
                    type="button"
                    onClick={() => setZones(toggle(zones, z.id))}
                    aria-pressed={zones.includes(z.id)}
                    className={`whitespace-nowrap rounded-sm border px-2.5 py-1 text-[11px] uppercase tracking-[0.04em] transition-colors ${
                      zones.includes(z.id)
                        ? 'border-[oklch(0.82_0.16_75/0.55)] bg-[oklch(0.82_0.16_75/0.10)] text-white'
                        : 'border-white/18 text-white/70 hover:border-white/30'
                    }`}
                  >
                    {z.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-baseline justify-between">
                <span className="text-[10.5px] uppercase tracking-[0.12em] text-[oklch(0.78_0.12_200)]">
                  MIN SCORE
                </span>
                <span className="font-mono text-[18px] tabular-nums text-white">
                  {score}
                  <span className="text-[12px] text-white/45">/100</span>
                </span>
              </div>
              <div className="relative h-6">
                <div className="absolute inset-x-0 top-1/2 h-[3px] -translate-y-1/2 rounded-sm bg-white/10" />
                <div
                  className="absolute left-0 top-1/2 h-[3px] -translate-y-1/2 rounded-sm"
                  style={{ width: `${score}%`, background: 'oklch(0.82 0.16 75)' }}
                />
                <div
                  className="absolute top-1/2 h-3.5 w-2 -translate-x-1/2 -translate-y-1/2 rounded-sm bg-[oklch(0.82_0.16_75)] shadow-[0_0_8px_oklch(0.82_0.16_75)]"
                  style={{ left: `${score}%` }}
                />
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={score}
                  onChange={(e) => setScore(Number(e.target.value))}
                  className="absolute inset-0 w-full cursor-pointer opacity-0"
                  aria-label="Minimum score"
                />
              </div>
            </div>
          </div>

          {/* RIGHT — live result */}
          <div className="flex flex-col gap-4 rounded-sm border border-[oklch(0.82_0.16_75/0.4)] bg-[#0B0B0B] p-5">
            <div>
              <span className="text-[10.5px] uppercase tracking-[0.12em] text-[oklch(0.82_0.16_75)]">
                WOULD FIRE
              </span>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="font-mono text-[52px] leading-none tabular-nums text-white">
                  {String(matches.length).padStart(2, '0')}
                </span>
                <span className="text-[12px] uppercase tracking-[0.12em] text-white/55">
                  of {MARKETING_SAMPLE.length} sample candidates
                </span>
              </div>
            </div>
            <div className="h-px bg-white/15" />
            <div className="flex min-h-[120px] flex-col gap-1.5">
              <span className="mb-1 text-[10px] uppercase tracking-[0.14em] text-white/55">
                MATCHING SYMBOLS
              </span>
              {matches.length === 0 ? (
                <span className="text-[12px] text-white/55">
                  No matches with this rule. Try lowering the score or adding more states.
                </span>
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {matches.map((m) => (
                    <span
                      key={m.symbol}
                      className="inline-flex items-center gap-1.5 rounded-sm border border-white/15 bg-black px-2 py-1 text-[11px]"
                    >
                      <span
                        className="h-1.5 w-1.5 rounded-full"
                        style={{ background: STATE_TONES[m.state] }}
                      />
                      <span className="text-[oklch(0.86_0.14_75)]">{m.symbol}</span>
                      <span className="text-[10.5px] tabular-nums text-white">{m.score}</span>
                    </span>
                  ))}
                </div>
              )}
            </div>
            <Link
              href="/pricing"
              className="mt-auto inline-flex w-full items-center justify-center gap-2 rounded-sm border border-[oklch(0.82_0.16_75/0.6)] bg-[oklch(0.82_0.16_75/0.18)] px-3 py-2.5 text-[11.5px] uppercase tracking-[0.14em] text-[oklch(0.82_0.16_75)] hover:bg-[oklch(0.82_0.16_75/0.28)]"
            >
              SUBSCRIBE TO SAVE THIS RULE <ArrowUpRight size={12} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
