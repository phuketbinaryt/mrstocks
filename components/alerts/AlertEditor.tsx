'use client';
import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import ChipToggle from './ChipToggle';
import Toggle from './Toggle';
import ScoreSlider from './ScoreSlider';
import { STATE_META, ZONE_LABEL } from './state-meta';
import {
  ALL_STATES,
  ALL_ZONES,
  type StateId,
  type ZoneId,
  type CandidateForMatch,
} from '@/lib/alerts/types';
import { createRule, updateRule, deleteRule } from '@/lib/alerts/actions';
import { ruleMatches } from '@/lib/alerts/matches';

interface InitialRule {
  id: string;
  name: string;
  active: boolean;
  states: string[];
  zones: string[];
  watchlistId: string | null;
  minScore: number;
  channels: string[];
}

export interface WatchlistOption {
  id: string;
  name: string;
}

export interface AlertEditorProps {
  initial?: InitialRule;
  watchlists: WatchlistOption[];
  candidates: CandidateForMatch[];
  watchlistSymsByList: Record<string, string[]>;
}

function toggleSet<T>(arr: T[], value: T): T[] {
  return arr.includes(value) ? arr.filter((x) => x !== value) : [...arr, value];
}

export default function AlertEditor({
  initial,
  watchlists,
  candidates,
  watchlistSymsByList,
}: AlertEditorProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState(initial?.name ?? '');
  const [states, setStates] = useState<string[]>(initial?.states ?? ['narrow']);
  const [zones, setZones] = useState<string[]>(initial?.zones ?? ['inside']);
  const [watchlistId, setWatchlistId] = useState<string | null>(
    initial?.watchlistId ?? null,
  );
  const [minScore, setMinScore] = useState<number>(initial?.minScore ?? 85);
  const [channels, setChannels] = useState<string[]>(
    initial?.channels ?? ['email'],
  );
  const [active, setActive] = useState<boolean>(initial?.active ?? true);

  // Live preview against the latest scan's candidates.
  const previewCtx = watchlistId
    ? { watchlistSymbols: new Set(watchlistSymsByList[watchlistId] ?? []) }
    : {};
  const matchCount = candidates.filter((c) =>
    ruleMatches(
      {
        states,
        zones,
        minScore: String(minScore),
        watchlistId,
      },
      c,
      previewCtx,
    ),
  ).length;

  function onSave() {
    setError(null);
    startTransition(async () => {
      try {
        if (initial) {
          await updateRule(initial.id, {
            name,
            states,
            zones,
            watchlistId,
            minScore,
            channels,
            active,
          });
        } else {
          await createRule({
            name,
            states,
            zones,
            watchlistId,
            minScore,
            channels,
            active,
          });
        }
        router.push('/alerts');
        router.refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : 'failed to save');
      }
    });
  }

  function onDelete() {
    if (!initial) return;
    if (!confirm('Delete this alert rule?')) return;
    startTransition(async () => {
      try {
        await deleteRule(initial.id);
        router.push('/alerts');
        router.refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : 'failed to delete');
      }
    });
  }

  return (
    <>
      <div className="flex items-center gap-3 px-4 md:px-5 h-11 md:h-12 border-b border-white/12 bg-[#050505] sticky top-11 md:top-12 z-10">
        <Link
          href="/alerts"
          aria-label="Back"
          className="-ml-1 p-1.5 rounded-sm text-white/75 hover:text-white hover:bg-white/10"
        >
          <ChevronLeft size={14} />
        </Link>
        <span className="text-[10px] uppercase tracking-[0.14em] text-[oklch(0.82_0.16_75)]">
          RULE
        </span>
        <span className="text-[oklch(0.82_0.16_75/0.5)]">│</span>
        <span className="text-[13px] uppercase tracking-[0.06em] text-white font-medium truncate">
          {name || 'UNTITLED RULE'}
        </span>
        <div className="flex-1" />
        <span className="text-[10.5px] uppercase tracking-[0.08em] text-[oklch(0.78_0.12_200)] hidden md:inline">
          PREVIEW · MATCHES TODAY{' '}
          <span
            className={
              matchCount > 0 ? 'text-[oklch(0.78_0.16_150)]' : 'text-white/55'
            }
          >
            {String(matchCount).padStart(2, '0')}
          </span>
        </span>
      </div>

      <div className="flex-1 px-4 md:px-5 pt-5 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-x-8 gap-y-6 max-w-[1024px] mx-auto">
          <div className="md:col-span-8 flex flex-col gap-6">
            <FormSection eyebrow="01" title="NAME">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. A+ tech setups"
                maxLength={80}
                className="w-full bg-[#0B0B0B] border border-white/22 focus:border-[oklch(0.82_0.16_75/0.7)] focus:outline-none rounded-sm px-3 py-2 text-[14px] text-white placeholder-white/35 tracking-[0.02em]"
              />
              <p className="text-[10.5px] text-white/55 mt-1.5 uppercase tracking-[0.08em]">
                SHOWN IN NOTIFICATIONS AND THE RULE LIST
              </p>
            </FormSection>

            <FormSection eyebrow="02" title="WHEN">
              <div className="flex flex-col gap-4">
                <SubLabel>
                  SETUP STATES <Hint count={states.length} />
                </SubLabel>
                <div className="flex flex-wrap gap-1.5">
                  {ALL_STATES.map((s) => (
                    <ChipToggle
                      key={s}
                      active={states.includes(s)}
                      dotColor={STATE_META[s as StateId]?.tone}
                      onClick={() => setStates(toggleSet(states, s))}
                    >
                      {STATE_META[s as StateId]?.label}
                    </ChipToggle>
                  ))}
                </div>

                <SubLabel>
                  PRIOR45 ZONES <Hint count={zones.length} />
                </SubLabel>
                <div className="flex flex-wrap gap-1.5">
                  {ALL_ZONES.map((z) => (
                    <ChipToggle
                      key={z}
                      active={zones.includes(z)}
                      onClick={() => setZones(toggleSet(zones, z))}
                    >
                      {ZONE_LABEL[z as ZoneId]}
                    </ChipToggle>
                  ))}
                </div>

                <SubLabel>
                  WATCHLIST{' '}
                  <span className="text-white/45 normal-case ml-1">
                    (optional)
                  </span>
                </SubLabel>
                <div className="flex flex-wrap gap-1.5">
                  <ChipToggle
                    active={watchlistId === null}
                    onClick={() => setWatchlistId(null)}
                  >
                    ANY
                  </ChipToggle>
                  {watchlists.map((w) => (
                    <ChipToggle
                      key={w.id}
                      active={watchlistId === w.id}
                      onClick={() => setWatchlistId(w.id)}
                    >
                      {w.name}
                    </ChipToggle>
                  ))}
                </div>

                <SubLabel>MIN SCORE</SubLabel>
                <ScoreSlider value={minScore} onChange={setMinScore} />
              </div>
            </FormSection>
          </div>

          <div className="md:col-span-4 flex flex-col gap-6">
            <FormSection eyebrow="03" title="NOTIFY">
              <div className="flex flex-col gap-3">
                <ChannelRow
                  label="EMAIL"
                  hint="ALERT EMAIL ON HIT"
                  on={channels.includes('email')}
                  onChange={(next) =>
                    setChannels((prev) =>
                      next
                        ? Array.from(new Set([...prev, 'email']))
                        : prev.filter((c) => c !== 'email'),
                    )
                  }
                />
                <ChannelRow
                  label="WEB PUSH"
                  hint="BROWSER NOTIFICATION ON HIT"
                  on={channels.includes('webpush')}
                  onChange={(next) =>
                    setChannels((prev) =>
                      next
                        ? Array.from(new Set([...prev, 'webpush']))
                        : prev.filter((c) => c !== 'webpush'),
                    )
                  }
                />
              </div>
            </FormSection>

            <FormSection eyebrow="04" title="STATUS">
              <div className="flex items-center justify-between gap-3 border border-white/15 rounded-sm bg-[#0B0B0B] px-3 py-2.5">
                <div className="flex flex-col">
                  <span className="text-[12px] text-white font-medium uppercase tracking-[0.08em]">
                    ACTIVE
                  </span>
                  <span className="text-[10px] uppercase tracking-[0.08em] text-white/55">
                    DISABLED RULES NEVER FIRE
                  </span>
                </div>
                <Toggle on={active} onChange={setActive} size="md" />
              </div>
            </FormSection>

            <FormSection eyebrow="05" title="PREVIEW">
              <div className="border border-white/15 rounded-sm bg-[#0B0B0B] p-4 flex flex-col gap-3">
                <div className="flex items-baseline justify-between">
                  <span className="text-[10.5px] uppercase tracking-[0.1em] text-[oklch(0.78_0.12_200)]">
                    MATCHES TODAY
                  </span>
                  <span className="font-mono tabular-nums text-[28px] text-white">
                    {String(matchCount).padStart(2, '0')}
                  </span>
                </div>
                <p className="text-[11.5px] text-white/65 leading-relaxed">
                  {matchCount > 0 ? (
                    <>
                      This rule would have triggered{' '}
                      <span className="text-[oklch(0.78_0.16_150)]">
                        {matchCount}
                      </span>{' '}
                      alert{matchCount === 1 ? '' : 's'} this morning.
                    </>
                  ) : (
                    <>
                      No matches today. Try lowering the score threshold or
                      adding more states.
                    </>
                  )}
                </p>
              </div>
            </FormSection>
          </div>
        </div>
      </div>

      <div className="border-t-[1.5px] border-white/22 bg-black px-4 md:px-5 py-3 fixed bottom-0 inset-x-0 z-20 flex items-center gap-2">
        {error && (
          <span className="text-[11px] text-[oklch(0.74_0.20_25)] uppercase tracking-[0.1em]">
            {error}
          </span>
        )}
        <div className="flex-1" />
        {initial && (
          <button
            type="button"
            onClick={onDelete}
            disabled={isPending}
            className="px-3 py-1.5 rounded-sm border border-white/22 text-[11px] uppercase tracking-[0.1em] text-white/75 hover:text-white hover:border-[oklch(0.74_0.20_25/0.5)] hover:bg-[oklch(0.74_0.20_25/0.1)]"
          >
            DELETE
          </button>
        )}
        <Link
          href="/alerts"
          className="px-3 py-1.5 rounded-sm border border-white/22 text-[11px] uppercase tracking-[0.1em] text-white/75 hover:text-white hover:border-white/35"
        >
          CANCEL
        </Link>
        <button
          type="button"
          onClick={onSave}
          disabled={isPending}
          className="px-3.5 py-1.5 rounded-sm border border-[oklch(0.82_0.16_75/0.6)] bg-[oklch(0.82_0.16_75/0.18)] text-[oklch(0.82_0.16_75)] text-[11px] uppercase tracking-[0.12em] inline-flex items-center gap-1.5 disabled:opacity-50"
        >
          {isPending ? 'SAVING…' : 'SAVE RULE'}
        </button>
      </div>
    </>
  );
}

function FormSection({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="flex items-baseline gap-2 mb-3">
        <span className="text-[9.5px] uppercase tracking-[0.18em] text-[oklch(0.82_0.16_75)]">
          {eyebrow}
        </span>
        <h3 className="text-[12px] text-white font-medium uppercase tracking-[0.14em]">
          {title}
        </h3>
      </div>
      {children}
    </section>
  );
}

function SubLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[10.5px] uppercase tracking-[0.1em] text-[oklch(0.78_0.12_200)] mb-1.5">
      {children}
    </div>
  );
}

function Hint({ count }: { count: number }) {
  return (
    <span className="ml-1.5 text-white/55 text-[10px]">· {count} SELECTED</span>
  );
}

function ChannelRow({
  label,
  hint,
  on,
  onChange,
}: {
  label: string;
  hint: string;
  on: boolean;
  onChange: (next: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3 border border-white/15 rounded-sm bg-[#0B0B0B] px-3 py-2.5">
      <div className="flex flex-col">
        <span className="text-[12px] text-white font-medium uppercase tracking-[0.08em]">
          {label}
        </span>
        <span className="text-[10px] uppercase tracking-[0.08em] text-white/55">
          {hint}
        </span>
      </div>
      <Toggle on={on} onChange={onChange} size="md" />
    </div>
  );
}
