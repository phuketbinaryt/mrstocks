// Build the current-month CalendarDay[] grid from getScanDates() results.
// All date math runs against America/New_York.
import type { CalendarDay } from '@/components/history/CalendarGrid';

interface ScanDateRow {
  generatedAt: Date;
  candidateCount: number;
}

const NY_TZ = 'America/New_York';

function ymdNY(d: Date): string {
  // Locale en-CA renders YYYY-MM-DD.
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: NY_TZ,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(d);
}

function dowNY(d: Date): number {
  const wk = new Intl.DateTimeFormat('en-US', {
    timeZone: NY_TZ,
    weekday: 'short',
  }).format(d);
  return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(wk);
}

export interface MonthGrid {
  monthLabel: string; // "MAY 2026"
  year: number;
  monthIndex: number; // 0..11
  days: CalendarDay[];
  scannedRows: { generatedAt: Date; candidateCount: number }[];
}

/**
 * Returns a calendar for the NY-local month containing `today`.
 * Folds the provided scan dates into the cell counts; unrepresented
 * weekdays render as count=0.
 */
export function buildMonthGrid(
  today: Date,
  scans: ScanDateRow[],
): MonthGrid {
  const todayYMD = ymdNY(today);
  // Use ICU parts to extract NY year/month for `today`.
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: NY_TZ,
    year: 'numeric',
    month: '2-digit',
  }).formatToParts(today);
  const year = Number(parts.find((p) => p.type === 'year')!.value);
  const monthIndex =
    Number(parts.find((p) => p.type === 'month')!.value) - 1; // 0..11
  // Number of days in this month — Date(year, monthIndex+1, 0).getDate()
  // is in local-tz of the runtime, which is server tz. For typical months
  // this matches NY (month length is invariant). DST transitions don't
  // change day counts.
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

  // Index scans by YMD.
  const byDate = new Map<string, number>();
  for (const s of scans) {
    byDate.set(ymdNY(s.generatedAt), s.candidateCount);
  }

  const days: CalendarDay[] = [];
  for (let d = 1; d <= daysInMonth; d++) {
    const mm = String(monthIndex + 1).padStart(2, '0');
    const dd = String(d).padStart(2, '0');
    const date = `${year}-${mm}-${dd}`;
    // Use a known-NY mid-day timestamp to derive DOW reliably.
    // We construct an ISO at 12:00 UTC and ask Intl for the NY weekday.
    const probe = new Date(`${date}T12:00:00-05:00`);
    const dow = dowNY(probe);
    const isWeekend = dow === 0 || dow === 6;
    const isFuture = date > todayYMD;
    const isToday = date === todayYMD;
    const hasScan = byDate.has(date);
    days.push({
      date,
      dayOfMonth: d,
      dow,
      isWeekend,
      isFuture,
      isToday,
      count: hasScan ? (byDate.get(date) ?? 0) : isWeekend || isFuture ? null : 0,
    });
  }

  const monthLabel = new Intl.DateTimeFormat('en-US', {
    timeZone: NY_TZ,
    month: 'long',
    year: 'numeric',
  })
    .format(today)
    .toUpperCase();

  const scannedRows = scans.filter((s) => {
    const y = ymdNY(s.generatedAt);
    return y.startsWith(`${year}-${String(monthIndex + 1).padStart(2, '0')}`);
  });

  return { monthLabel, year, monthIndex, days, scannedRows };
}
