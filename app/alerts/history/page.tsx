import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { requireActiveMembership } from '@/lib/membership/require';
import { getLatestScan } from '@/lib/scans/latest';
import {
  listNotificationsForUser,
  listRulesForUser,
} from '@/lib/alerts/queries';
import TopBar from '@/components/dashboard/TopBar';

export const metadata = { title: 'Alert history — MR/STOCKS' };
export const dynamic = 'force-dynamic';

export default async function AlertHistoryPage() {
  const session = await requireActiveMembership('/alerts/history');
  const userId = session.user!.id!;

  const [scan, notifications, rules] = await Promise.all([
    getLatestScan(),
    listNotificationsForUser(userId, 200),
    listRulesForUser(userId),
  ]);
  const generatedAt = scan?.generatedAt ?? new Date();
  const ruleNames: Record<string, string> = Object.fromEntries(
    rules.map((r) => [r.id, r.name]),
  );

  const fmt = (d: Date) =>
    new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/New_York',
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })
      .format(d)
      .toUpperCase();

  return (
    <main className="min-h-screen flex flex-col bg-black text-white">
      <TopBar generatedAt={generatedAt} title="ALERTS / HISTORY" />
      <div className="flex items-center gap-3 px-4 md:px-5 h-11 md:h-12 border-b border-white/12 bg-[#050505]">
        <Link
          href="/alerts"
          aria-label="Back"
          className="-ml-1 p-1.5 rounded-sm text-white/75 hover:text-white hover:bg-white/10"
        >
          <ChevronLeft size={14} />
        </Link>
        <span className="text-[10px] uppercase tracking-[0.14em] text-[oklch(0.82_0.16_75)]">
          ALERTS
        </span>
        <span className="text-[oklch(0.82_0.16_75/0.5)]">│</span>
        <span className="text-[13px] uppercase tracking-[0.06em] text-white font-medium">
          HISTORY
        </span>
        <div className="flex-1" />
        <span className="text-[10.5px] uppercase tracking-[0.08em] text-white/55">
          LAST{' '}
          <span className="text-white tabular-nums">
            {String(notifications.length).padStart(3, '0')}
          </span>{' '}
          DELIVERIES
        </span>
      </div>

      <div className="flex-1 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center text-center pt-16 px-6">
            <div className="text-[10px] uppercase tracking-[0.18em] text-[oklch(0.82_0.16_75)] mb-2">
              NO DELIVERIES YET
            </div>
            <p className="text-[12.5px] text-white/70 max-w-[44ch]">
              Once a rule fires and we send an email or push, it&apos;ll show
              up here.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-white/12">
            {notifications.map((n) => (
              <li
                key={n.id}
                className="px-4 md:px-5 py-3 grid gap-y-1.5 grid-cols-[80px_minmax(0,1fr)_60px] md:grid-cols-[100px_minmax(0,1fr)_80px] items-baseline gap-x-3"
              >
                <span className="text-[10px] uppercase tracking-[0.1em] text-white/55 font-mono tabular-nums">
                  {fmt(n.sentAt)}
                </span>
                <div className="min-w-0">
                  <div className="text-[12.5px] uppercase tracking-[0.06em] text-white truncate">
                    {n.ruleId ? (ruleNames[n.ruleId] ?? '—') : '—'}
                  </div>
                  <div className="text-[10.5px] uppercase tracking-[0.06em] text-white/65 truncate">
                    {n.symbols.slice(0, 8).join(', ')}
                    {n.symbols.length > 8 ? '…' : ''}
                  </div>
                  {n.error && (
                    <div className="text-[10px] uppercase tracking-[0.06em] text-[oklch(0.74_0.20_25)] truncate">
                      ERROR: {n.error}
                    </div>
                  )}
                </div>
                <span
                  className={`text-[10px] uppercase tracking-[0.1em] tabular-nums justify-self-end px-1.5 py-px rounded-sm border ${
                    n.delivered
                      ? 'border-[oklch(0.78_0.16_150/0.55)] text-[oklch(0.78_0.16_150)]'
                      : 'border-[oklch(0.74_0.20_25/0.55)] text-[oklch(0.74_0.20_25)]'
                  }`}
                >
                  {n.channel.toUpperCase()}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
