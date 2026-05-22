import Link from 'next/link';
import { requireActiveMembership } from '@/lib/membership/require';
import { listRulesForUser } from '@/lib/alerts/queries';
import { listWatchlistsForUser } from '@/lib/watchlists/queries';
import { getLatestScan } from '@/lib/scans/latest';
import TopBar from '@/components/dashboard/TopBar';
import AlertRuleList from '@/components/alerts/AlertRuleList';

export const metadata = { title: 'Alerts — MR/STOCKS' };
export const dynamic = 'force-dynamic';

export default async function AlertsPage() {
  const session = await requireActiveMembership('/alerts');
  const userId = session.user!.id!;

  const [rules, watchlists, scan] = await Promise.all([
    listRulesForUser(userId),
    listWatchlistsForUser(userId),
    getLatestScan(),
  ]);
  const generatedAt = scan?.generatedAt ?? new Date();
  const watchlistNames: Record<string, string> = Object.fromEntries(
    watchlists.map((w) => [w.id, w.name]),
  );
  const activeCount = rules.filter((r) => r.active).length;

  return (
    <main className="min-h-screen flex flex-col bg-black text-white">
      <TopBar generatedAt={generatedAt} title="ALERTS" />
      <div className="flex items-center gap-3 px-4 md:px-5 py-2.5 border-b border-white/12 bg-[#050505]">
        <span className="text-[9.5px] uppercase tracking-[0.18em] text-[oklch(0.82_0.16_75)]">
          ALL RULES
        </span>
        <span className="text-[oklch(0.82_0.16_75/0.5)]">│</span>
        <span className="text-[10.5px] uppercase tracking-[0.08em] text-[oklch(0.78_0.12_200)]">
          ACTIVE{' '}
          <span className="text-white tabular-nums">
            {String(activeCount).padStart(2, '0')}
          </span>
          /
          <span className="text-white tabular-nums">
            {String(rules.length).padStart(2, '0')}
          </span>
        </span>
        <div className="flex-1" />
        <Link
          href="/alerts/history"
          className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm border border-white/15 text-[10.5px] uppercase tracking-[0.1em] text-white/75 hover:text-white hover:border-white/30"
        >
          HISTORY
        </Link>
        <Link
          href="/alerts/new"
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm border border-[oklch(0.82_0.16_75/0.5)] bg-[oklch(0.82_0.16_75/0.12)] text-[oklch(0.82_0.16_75)] text-[10.5px] uppercase tracking-[0.1em] hover:bg-[oklch(0.82_0.16_75/0.2)]"
        >
          + NEW RULE
        </Link>
      </div>
      <AlertRuleList rules={rules} watchlistNames={watchlistNames} />
    </main>
  );
}
