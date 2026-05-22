// Symbol-detail section wrapper. Phase 3 renders non-collapsible (always
// open) — the collapsible mobile variant lands in a follow-up. Eyebrow
// is the amber 01/02/03/04 numbering.

export interface DetailSectionProps {
  title: string;
  eyebrow?: string;
  children: React.ReactNode;
}

export default function DetailSection({
  title,
  eyebrow,
  children,
}: DetailSectionProps) {
  return (
    <section className="border-t border-white/18 first:border-t-0">
      <div className="flex items-baseline gap-2.5 whitespace-nowrap py-3.5 px-4 md:px-5">
        {eyebrow && (
          <span className="text-[9.5px] uppercase tracking-[0.15em] text-[oklch(0.82_0.16_75)]">
            {eyebrow}
          </span>
        )}
        <h3 className="text-[12px] text-white font-medium uppercase tracking-[0.12em]">
          {title}
        </h3>
      </div>
      <div className="px-4 md:px-5 pb-5">{children}</div>
    </section>
  );
}

export interface KVRow {
  label: string;
  value: string;
  tone?: string;
}

export interface KVProps {
  rows: KVRow[];
  columns?: 1 | 2 | 3;
}

export function KV({ rows, columns = 2 }: KVProps) {
  const cls =
    columns === 2
      ? 'grid-cols-2'
      : columns === 3
        ? 'grid-cols-3'
        : 'grid-cols-1';
  return (
    <div className={`grid ${cls} gap-x-5 gap-y-2.5`}>
      {rows.map((r) => (
        <div
          key={r.label}
          className="flex items-baseline justify-between gap-3 border-b border-white/15 py-1.5"
        >
          <span className="text-[10.5px] text-[oklch(0.78_0.12_200)] uppercase tracking-[0.08em] whitespace-nowrap">
            {r.label}
          </span>
          <span
            className={`tabular-nums text-[13px] whitespace-nowrap ${r.tone ?? 'text-white'}`}
          >
            {r.value}
          </span>
        </div>
      ))}
    </div>
  );
}
