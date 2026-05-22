import {
  getMemberCount,
  getActiveSubscriberCount,
  getMrrEstimate,
  getLastScanIngest,
  getDeliveryStats,
  getStatusBreakdown,
} from '@/lib/admin/queries';
import StatTile from '@/components/admin/StatTile';

export const dynamic = 'force-dynamic';

function formatUtc(d: Date): string {
  return (
    d.toISOString().slice(0, 10) + ' ' + d.toISOString().slice(11, 16) + ' UTC'
  );
}

export default async function AdminHome() {
  const [members, subs, mrr, lastScan, delivery, byStatus] = await Promise.all([
    getMemberCount(),
    getActiveSubscriberCount(),
    getMrrEstimate(),
    getLastScanIngest(),
    getDeliveryStats(),
    getStatusBreakdown(),
  ]);

  return (
    <>
      <header className="mb-6">
        <span className="text-[10px] uppercase tracking-[0.22em] text-[oklch(0.82_0.16_75)]">
          ADMIN
        </span>
        <h1 className="text-[22px] uppercase tracking-tight mt-1 text-white">
          Overview
        </h1>
      </header>

      <section className="mb-8">
        <h2 className="text-[10px] uppercase tracking-[0.16em] text-white/55 mb-3">
          MEMBERSHIP
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatTile label="USERS" value={members} />
          <StatTile label="ACTIVE SUBS" value={subs} tone="green" />
          <StatTile
            label="MRR EST."
            value={`$${mrr.toFixed(2)}`}
            tone="amber"
            hint={`@ $29.99 × ACTIVE`}
          />
          <StatTile
            label="CANCELED"
            value={byStatus.canceled ?? 0}
            tone={byStatus.canceled ? 'red' : 'default'}
          />
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-[10px] uppercase tracking-[0.16em] text-white/55 mb-3">
          SCAN INGEST
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatTile
            label="LAST INGEST"
            value={lastScan ? formatUtc(lastScan.ingestedAt) : '—'}
            tone="cyan"
          />
          <StatTile
            label="CANDIDATES"
            value={lastScan?.candidateCount ?? 0}
          />
          <StatTile
            label="SCANNER"
            value={lastScan?.scannerName ?? '—'}
          />
          <StatTile
            label="GENERATED AT"
            value={lastScan ? formatUtc(lastScan.generatedAt) : '—'}
          />
        </div>
      </section>

      <section>
        <h2 className="text-[10px] uppercase tracking-[0.16em] text-white/55 mb-3">
          ALERT DELIVERY
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatTile label="TOTAL SENT" value={delivery.total} />
          <StatTile
            label="DELIVERED"
            value={delivery.delivered}
            tone="green"
          />
          <StatTile
            label="FAILED"
            value={delivery.failed}
            tone={delivery.failed ? 'red' : 'default'}
          />
          <StatTile label="LAST 24H" value={delivery.last24h} tone="cyan" />
        </div>
      </section>
    </>
  );
}
