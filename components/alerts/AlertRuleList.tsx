'use client';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import Link from 'next/link';
import { Bell } from 'lucide-react';
import Toggle from './Toggle';
import { STATE_META, ZONE_LABEL } from './state-meta';
import type {
  AlertRule,
  StateId,
  ZoneId,
} from '@/lib/alerts/types';
import { toggleRuleActive } from '@/lib/alerts/actions';

export interface AlertRuleListProps {
  rules: AlertRule[];
  watchlistNames: Record<string, string>;
}

export default function AlertRuleList({
  rules,
  watchlistNames,
}: AlertRuleListProps) {
  if (rules.length === 0) {
    return (
      <div className="flex flex-col items-center text-center pt-16 px-6">
        <div className="h-14 w-14 rounded border border-white/15 bg-[#0B0B0B] grid place-items-center mb-5 text-[oklch(0.82_0.16_75)]">
          <Bell size={20} />
        </div>
        <div className="text-[10px] uppercase tracking-[0.18em] text-[oklch(0.82_0.16_75)] mb-2">
          NO ALERTS YET
        </div>
        <h2 className="text-[18px] text-white font-medium tracking-tight max-w-[30ch] uppercase">
          Set a rule and we&apos;ll notify you when A+ setups match.
        </h2>
        <p className="text-[12.5px] text-white/70 mt-2 max-w-[44ch]">
          Combine setup states, prior45 zones, a watchlist, and a minimum
          score. Alerts fire from the 09:15 NY scan via email or web push.
        </p>
        <Link
          href="/alerts/new"
          className="mt-6 inline-flex items-center gap-2 px-3.5 py-2 rounded-sm border border-[oklch(0.82_0.16_75/0.5)] bg-[oklch(0.82_0.16_75/0.14)] text-[oklch(0.82_0.16_75)] text-[11px] uppercase tracking-[0.12em]"
        >
          + NEW RULE
        </Link>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      {rules.map((r) => (
        <AlertRuleRow
          key={r.id}
          rule={r}
          watchlistName={
            r.watchlistId ? (watchlistNames[r.watchlistId] ?? null) : null
          }
        />
      ))}
    </div>
  );
}

function AlertRuleRow({
  rule,
  watchlistName,
}: {
  rule: AlertRule;
  watchlistName: string | null;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <div
      className={`border-b border-white/12 ${rule.active ? '' : 'opacity-55'} px-3 md:px-5 py-4 grid gap-y-2 grid-cols-[14px_minmax(0,1fr)_auto_auto] md:grid-cols-[14px_minmax(0,1fr)_auto_auto] items-center gap-x-3`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full justify-self-center ${
          rule.active
            ? 'bg-[oklch(0.78_0.16_150)] shadow-[0_0_6px_oklch(0.78_0.16_150)]'
            : 'bg-white/25'
        }`}
      />
      <span className="text-[13.5px] text-white font-medium uppercase tracking-[0.04em] truncate">
        {rule.name}
      </span>
      <Toggle
        on={rule.active}
        onChange={() => {
          startTransition(async () => {
            await toggleRuleActive(rule.id);
            router.refresh();
          });
        }}
      />
      <Link
        href={`/alerts/${rule.id}/edit`}
        className="px-2 py-1 rounded-sm border border-white/18 text-[10.5px] uppercase tracking-[0.1em] text-white/75 hover:text-white hover:border-white/35"
      >
        EDIT
      </Link>

      <div className="col-span-4 pl-[26px]">
        <PredicateLine rule={rule} watchlistName={watchlistName} />
      </div>

      <div className="col-span-4 pl-[26px]">
        <ChannelChips channels={rule.channels} />
      </div>
      {isPending && (
        <div className="col-span-4 pl-[26px] text-[9.5px] uppercase tracking-[0.1em] text-white/45">
          UPDATING…
        </div>
      )}
    </div>
  );
}

function PredicateLine({
  rule,
  watchlistName,
}: {
  rule: AlertRule;
  watchlistName: string | null;
}) {
  const sep = (
    <span className="text-[oklch(0.82_0.16_75/0.45)] mx-2">·</span>
  );
  return (
    <div className="text-[11px] uppercase tracking-[0.06em] leading-relaxed">
      {rule.states.map((s, i) => (
        <span key={s}>
          {i > 0 && <span className="text-white/45 mx-1.5">OR</span>}
          <span style={{ color: STATE_META[s as StateId]?.tone ?? '#fff' }}>
            {STATE_META[s as StateId]?.label ?? s}
          </span>
        </span>
      ))}
      {sep}
      <span className="text-white">
        {rule.zones
          .map((z) => ZONE_LABEL[z as ZoneId] ?? z.toUpperCase())
          .join(' / ')}
      </span>
      {watchlistName && (
        <>
          {sep}
          <span className="text-[oklch(0.78_0.12_200)]">{watchlistName}</span>
        </>
      )}
      {sep}
      <span className="text-white/65">
        SCORE ≥{' '}
        <span className="text-white tabular-nums">
          {Number(rule.minScore).toFixed(0)}
        </span>
      </span>
    </div>
  );
}

function ChannelChips({ channels }: { channels: string[] }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      {channels.includes('email') && (
        <span className="px-1.5 py-px rounded-sm border border-white/15 text-[9.5px] uppercase tracking-[0.1em] text-[oklch(0.78_0.12_200)]">
          EMAIL
        </span>
      )}
      {channels.includes('webpush') && (
        <span className="px-1.5 py-px rounded-sm border border-white/15 text-[9.5px] uppercase tracking-[0.1em] text-[oklch(0.78_0.12_200)]">
          PUSH
        </span>
      )}
    </span>
  );
}
