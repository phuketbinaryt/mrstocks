import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { requireActiveMembership } from '@/lib/membership/require';
import { getCandidatesForScan, getScanByDate } from '@/lib/scans/latest';
import { toDashboardCandidate } from '@/lib/scans/candidate-types';
import StockCard from '@/components/dashboard/StockCard';
import StatusBar from '@/components/dashboard/StatusBar';
import TopBar from '@/components/dashboard/TopBar';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ date: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { date } = await params;
  return { title: `${date} archive — MR/STOCKS` };
}

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export default async function HistoryDayPage({ params }: PageProps) {
  const { date } = await params;
  await requireActiveMembership(`/history/${date}`);

  if (!DATE_RE.test(date)) {
    return notFoundView(date);
  }

  const scan = await getScanByDate(date);
  if (!scan) {
    return notFoundView(date);
  }

  const rows = await getCandidatesForScan(scan.id);
  const candidates = rows.map(toDashboardCandidate);

  // Render a label like "TUE · 19-MAY 2026"
  const dowLabel = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York',
    weekday: 'short',
  })
    .format(scan.generatedAt)
    .toUpperCase();
  const dateLabel = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
    .format(scan.generatedAt)
    .toUpperCase()
    .replace(/(\d{2}) (\w{3})/, '$1-$2');

  return (
    <main className="min-h-screen bg-black text-white flex flex-col">
      <TopBar generatedAt={scan.generatedAt} title="HISTORY" />

      <div className="flex items-center gap-3 px-3 md:px-5 py-2.5 md:py-3 border-b border-white/12 bg-[#050505]">
        <Link
          href="/history"
          aria-label="Back to calendar"
          className="-ml-1 p-1.5 rounded-sm text-white/75 hover:text-white hover:bg-white/10"
        >
          <ChevronLeft size={14} />
        </Link>
        <span className="text-[9.5px] uppercase tracking-[0.16em] text-[oklch(0.82_0.16_75)]">
          ARCHIVE
        </span>
        <span className="text-[oklch(0.82_0.16_75/0.5)]">│</span>
        <span className="text-[13px] uppercase tracking-[0.06em] text-white font-medium">
          {dowLabel} · {dateLabel}
        </span>
        <span className="text-[oklch(0.82_0.16_75/0.5)]">│</span>
        <span className="text-[10.5px] uppercase tracking-[0.08em] text-[oklch(0.78_0.12_200)]">
          CAND{' '}
          <span className="text-white tabular-nums">
            {String(scan.candidateCount).padStart(2, '0')}
          </span>
        </span>
      </div>

      <section className="flex-1 px-3 md:px-5 py-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {candidates.length === 0 ? (
          <div className="col-span-full py-12 text-center text-white/70 text-[13px]">
            No candidates were recorded for this scan.
          </div>
        ) : (
          candidates.map((c) => <StockCard key={c.symbol} candidate={c} />)
        )}
      </section>

      <StatusBar
        total={candidates.length}
        shown={candidates.length}
        universeSize={scan.universeSize ?? null}
        barSeconds={scan.barSeconds ?? null}
      />
    </main>
  );
}

function notFoundView(date: string) {
  return (
    <main className="min-h-screen bg-black text-white flex flex-col">
      <TopBar generatedAt={new Date()} title="HISTORY" />
      <div className="flex-1 grid place-items-center px-8">
        <div className="text-center max-w-[36ch]">
          <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/75 mb-2">
            NO ARCHIVE
          </div>
          <h2 className="text-[20px] text-white font-medium tracking-tight">
            No scan saved for {date}.
          </h2>
          <Link
            href="/history"
            className="inline-block mt-6 px-3.5 py-2 rounded-sm border border-white/22 bg-white/8 hover:bg-white/10 text-[12.5px] text-white"
          >
            Back to calendar
          </Link>
        </div>
      </div>
    </main>
  );
}
