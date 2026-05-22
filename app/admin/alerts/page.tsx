import { getRecentNotifications, getDeliveryStats } from '@/lib/admin/queries';
import AdminTable, { type AdminTableColumn } from '@/components/admin/AdminTable';
import StatTile from '@/components/admin/StatTile';

export const dynamic = 'force-dynamic';

type Notif = Awaited<ReturnType<typeof getRecentNotifications>>[number];

function formatUtc(d: Date): string {
  return d.toISOString().slice(0, 16).replace('T', ' ') + ' UTC';
}

export default async function AdminAlertsPage() {
  const [rows, stats] = await Promise.all([
    getRecentNotifications(100),
    getDeliveryStats(),
  ]);

  const cols: AdminTableColumn<Notif>[] = [
    {
      key: 'sent',
      label: 'SENT',
      render: (r) => <span>{formatUtc(r.sentAt)}</span>,
    },
    {
      key: 'channel',
      label: 'CHANNEL',
      render: (r) => <span>{r.channel.toUpperCase()}</span>,
    },
    {
      key: 'symbols',
      label: 'SYMBOLS',
      render: (r) => (
        <span className="font-mono text-[11px]">
          {r.symbols.slice(0, 6).join(' · ')}
          {r.symbols.length > 6 ? ` +${r.symbols.length - 6}` : ''}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'STATUS',
      render: (r) =>
        r.delivered ? (
          <span className="text-[oklch(0.78_0.16_150)]">DELIVERED</span>
        ) : (
          <span className="text-[oklch(0.66_0.20_25)]">FAILED</span>
        ),
    },
    {
      key: 'error',
      label: 'ERROR',
      render: (r) =>
        r.error ? (
          <span className="text-[oklch(0.66_0.20_25)] text-[11px]">
            {r.error.slice(0, 80)}
          </span>
        ) : (
          <span className="text-white/35">—</span>
        ),
    },
    {
      key: 'user',
      label: 'USER',
      render: (r) => (
        <span className="font-mono text-[10.5px] text-white/55">
          {r.userId.slice(0, 8)}…
        </span>
      ),
    },
  ];

  return (
    <>
      <header className="mb-6">
        <span className="text-[10px] uppercase tracking-[0.22em] text-[oklch(0.82_0.16_75)]">
          ADMIN
        </span>
        <h1 className="text-[22px] uppercase tracking-tight mt-1 text-white">
          Alert deliveries
        </h1>
      </header>
      <section className="mb-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatTile label="TOTAL SENT" value={stats.total} />
          <StatTile label="DELIVERED" value={stats.delivered} tone="green" />
          <StatTile
            label="FAILED"
            value={stats.failed}
            tone={stats.failed ? 'red' : 'default'}
          />
          <StatTile label="LAST 24H" value={stats.last24h} tone="cyan" />
        </div>
      </section>
      <AdminTable rows={rows} columns={cols} emptyLabel="NO NOTIFICATIONS YET" />
    </>
  );
}
