'use client';
// State / Prior45 / List chip row. Owned by the parent DashboardClient
// which holds the active selection in useState. Each row is an independent
// horizontally-scrollable chip strip with a 58px-wide amber label gutter.
import { STATES } from '@/lib/scans/state-config';
import type { FilterChip } from '@/lib/scans/filters-config';

export interface FilterRowProps {
  label: string;
  chips: FilterChip[];
  activeId: string;
  onChange: (id: string) => void;
}

export default function FilterRow({
  label,
  chips,
  activeId,
  onChange,
}: FilterRowProps) {
  return (
    <div className="flex items-center gap-2 px-3 md:px-5 py-2 border-b border-white/10">
      <span className="w-[58px] shrink-0 text-[9.5px] uppercase tracking-[0.18em] text-[oklch(0.82_0.16_75)]">
        {label}
      </span>
      <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
        {chips.map((c) => {
          const active = c.id === activeId;
          const stateTone = STATES[c.id]?.tone;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => onChange(c.id)}
              className={`shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-[10.5px] uppercase tracking-[0.1em] whitespace-nowrap border transition-colors ${
                active
                  ? 'border-[oklch(0.82_0.16_75/0.7)] bg-[oklch(0.82_0.16_75/0.15)] text-[oklch(0.82_0.16_75)]'
                  : 'border-white/15 bg-[#0B0B0B] text-white/75 hover:border-white/30 hover:text-white'
              }`}
            >
              {stateTone && c.id !== 'all' && (
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ background: stateTone }}
                />
              )}
              {c.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
