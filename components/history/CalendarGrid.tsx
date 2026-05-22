// Calendar month heatmap. Monday-first. Cells link to /history/YYYY-MM-DD.
// Ported from ms-history.jsx CalendarGrid.
import Link from 'next/link';

export interface CalendarDay {
  /** YYYY-MM-DD in America/New_York */
  date: string;
  /** day-of-month, 1..31 */
  dayOfMonth: number;
  /** 0=Sun..6=Sat */
  dow: number;
  isWeekend: boolean;
  isFuture: boolean;
  isToday: boolean;
  /** null if no scan that day (or weekend/future), 0+ otherwise */
  count: number | null;
}

function heatStyle(c: CalendarDay): React.CSSProperties {
  if (c.isFuture)
    return {
      background: '#080808',
      color: 'rgba(255,255,255,0.18)',
      border: '1px solid rgba(255,255,255,0.06)',
    };
  if (c.isWeekend)
    return {
      background: '#060606',
      color: 'rgba(255,255,255,0.18)',
      border: '1px solid rgba(255,255,255,0.05)',
    };
  if (c.count == null)
    return {
      background: '#060606',
      color: 'rgba(255,255,255,0.18)',
      border: '1px solid rgba(255,255,255,0.05)',
    };
  let bg: string;
  let fg = '#fff';
  if (c.count === 0) {
    bg = '#0C0C0C';
    fg = 'rgba(255,255,255,0.4)';
  } else if (c.count <= 15) bg = 'oklch(0.24 0.06 75)';
  else if (c.count <= 30) bg = 'oklch(0.36 0.10 75)';
  else if (c.count <= 45) bg = 'oklch(0.52 0.14 75)';
  else bg = 'oklch(0.68 0.16 75)';
  const border = c.isToday
    ? '1.5px solid oklch(0.82 0.16 75)'
    : '1px solid rgba(255,255,255,0.10)';
  const shadow = c.isToday ? '0 0 12px oklch(0.82 0.16 75 / 0.55)' : 'none';
  return { background: bg, color: fg, border, boxShadow: shadow };
}

export interface CalendarGridProps {
  days: CalendarDay[];
}

export default function CalendarGrid({ days }: CalendarGridProps) {
  if (days.length === 0) return null;
  // Add leading blank cells so first day lands in the right column.
  // Monday-first week: Mon=0..Sun=6
  const firstDow = days[0].dow;
  const monStart = (firstDow + 6) % 7;
  const blanks = Array.from({ length: monStart }, (_, i) => ({
    blank: true as const,
    key: `blank-${i}`,
  }));

  return (
    <div className="grid grid-cols-7 gap-1.5">
      {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map((dow) => (
        <div
          key={dow}
          className="text-center text-[9px] uppercase tracking-[0.18em] text-white/45 pb-2"
        >
          {dow}
        </div>
      ))}
      {blanks.map((b) => (
        <div key={b.key} />
      ))}
      {days.map((c) => {
        const inactive = c.isFuture || c.isWeekend || c.count == null;
        const inner = (
          <div
            className="relative aspect-square md:aspect-[1.1/1] rounded-sm p-1.5 text-left h-full w-full"
            style={heatStyle(c)}
          >
            <div className="flex items-start justify-between text-[9.5px] tabular-nums">
              <span className="leading-none opacity-80">
                {String(c.dayOfMonth).padStart(2, '0')}
              </span>
              {c.isToday && (
                <span className="text-[8px] uppercase tracking-[0.1em] leading-none px-1 py-px rounded-sm bg-black/60 text-[oklch(0.82_0.16_75)]">
                  NOW
                </span>
              )}
            </div>
            {c.count != null && !c.isWeekend && !c.isFuture && (
              <div className="absolute inset-x-0 bottom-1 md:bottom-2 text-center">
                <div
                  className={`font-mono tabular-nums text-[15px] md:text-[20px] leading-none ${
                    c.count >= 31 ? 'text-white' : 'text-white/85'
                  }`}
                >
                  {c.count > 0 ? c.count : '·'}
                </div>
              </div>
            )}
            {c.isWeekend && (
              <div className="absolute inset-0 grid place-items-center text-[9.5px] uppercase tracking-[0.1em] text-white/30">
                —
              </div>
            )}
            {c.isFuture && (
              <div className="absolute inset-0 grid place-items-center text-[9.5px] uppercase tracking-[0.12em] text-white/22">
                ·
              </div>
            )}
          </div>
        );
        if (inactive) {
          return (
            <div key={c.date} className="cursor-default">
              {inner}
            </div>
          );
        }
        return (
          <Link
            key={c.date}
            href={`/history/${c.date}`}
            className="block cursor-pointer hover:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.25)] rounded-sm"
          >
            {inner}
          </Link>
        );
      })}
    </div>
  );
}
