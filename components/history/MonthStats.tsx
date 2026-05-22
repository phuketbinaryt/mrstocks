// Monthly summary card — DAYS SCANNED / TOTAL CANDIDATES / AVG / PEAK.
// Ported from ms-history.jsx MonthStats but driven by real scan counts
// only (we don't yet track A+ hits or alerts in Phase 3).

export interface MonthStatsRow {
  candidateCount: number;
  generatedAt: Date;
}

export interface MonthStatsProps {
  rows: MonthStatsRow[];
  monthLabel: string; // e.g. "MAY 2026"
}

export default function MonthStats({ rows, monthLabel }: MonthStatsProps) {
  const totalCands = rows.reduce((a, r) => a + (r.candidateCount ?? 0), 0);
  const days = rows.length;
  const avg = days > 0 ? (totalCands / days).toFixed(1) : '0';
  const peak = rows.reduce(
    (p, r) => (r.candidateCount > p.candidateCount ? r : p),
    { candidateCount: 0, generatedAt: new Date(0) } as MonthStatsRow,
  );
  const peakLabel =
    peak.candidateCount > 0
      ? new Intl.DateTimeFormat('en-US', {
          timeZone: 'America/New_York',
          day: '2-digit',
          month: 'short',
        })
          .format(peak.generatedAt)
          .toUpperCase()
          .replace(' ', '-')
      : '—';

  return (
    <div className="border border-white/12 rounded-sm bg-[#0B0B0B] divide-y divide-white/12">
      <StatRow label="DAYS SCANNED" value={String(days)} hint={monthLabel} />
      <StatRow
        label="TOTAL CANDIDATES"
        value={String(totalCands)}
        hint="CUMULATIVE"
      />
      <StatRow label="AVG PER DAY" value={avg} hint="ALL CANDIDATES" />
      <StatRow
        label="PEAK DAY"
        value={peakLabel}
        hint={
          peak.candidateCount > 0
            ? `${peak.candidateCount} CANDIDATES`
            : 'NO DATA'
        }
        tone="oklch(0.82 0.16 75)"
      />
    </div>
  );
}

interface StatRowProps {
  label: string;
  value: string;
  hint: string;
  tone?: string;
}

function StatRow({ label, value, hint, tone }: StatRowProps) {
  return (
    <div className="flex items-center justify-between gap-3 px-3.5 py-2.5">
      <div className="flex flex-col">
        <span className="text-[10px] uppercase tracking-[0.12em] text-[oklch(0.78_0.12_200)]">
          {label}
        </span>
        <span className="text-[9.5px] uppercase tracking-[0.08em] text-white/45">
          {hint}
        </span>
      </div>
      <span
        className="font-mono tabular-nums text-[18px]"
        style={{ color: tone ?? '#fff' }}
      >
        {value}
      </span>
    </div>
  );
}
