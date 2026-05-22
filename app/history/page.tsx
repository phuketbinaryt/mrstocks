import { requireActiveMembership } from '@/lib/membership/require';
import { getScanDates } from '@/lib/scans/latest';
import { buildMonthGrid } from '@/lib/scans/calendar';
import CalendarGrid from '@/components/history/CalendarGrid';
import MonthStats from '@/components/history/MonthStats';
import HeatLegend from '@/components/history/HeatLegend';
import TopBar from '@/components/dashboard/TopBar';

export const metadata = { title: 'History — MR/STOCKS' };
export const dynamic = 'force-dynamic';

export default async function HistoryPage() {
  await requireActiveMembership('/history');

  const scans = await getScanDates(120);
  const grid = buildMonthGrid(new Date(), scans);

  return (
    <main className="min-h-screen bg-black text-white flex flex-col">
      <TopBar generatedAt={new Date()} title="HISTORY" />

      <div className="flex items-center gap-3 px-3 md:px-5 py-2.5 md:py-3 border-b border-white/12 bg-[#050505]">
        <span className="text-[13px] uppercase tracking-[0.14em] text-white font-medium">
          {grid.monthLabel}
        </span>
        <div className="flex-1" />
        <div className="hidden md:block">
          <HeatLegend />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar">
        <div className="px-3 md:px-5 py-4 md:py-5 flex flex-col gap-5">
          <div className="md:grid md:grid-cols-[1fr_280px] md:gap-6 flex flex-col gap-5">
            <CalendarGrid days={grid.days} />
            <MonthStats
              rows={grid.scannedRows}
              monthLabel={grid.monthLabel}
            />
          </div>
          <div className="md:hidden">
            <HeatLegend />
          </div>
        </div>
      </div>
    </main>
  );
}
