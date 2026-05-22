import { getRecentScans } from '@/lib/admin/queries';
import AdminTable, { type AdminTableColumn } from '@/components/admin/AdminTable';

export const dynamic = 'force-dynamic';

type Scan = Awaited<ReturnType<typeof getRecentScans>>[number];

function formatUtc(d: Date): string {
  return d.toISOString().slice(0, 16).replace('T', ' ') + ' UTC';
}

export default async function AdminScansPage() {
  const rows = await getRecentScans(60);

  const cols: AdminTableColumn<Scan>[] = [
    {
      key: 'ingested',
      label: 'INGESTED',
      render: (r) => <span>{formatUtc(r.ingestedAt)}</span>,
    },
    {
      key: 'generated',
      label: 'GENERATED',
      render: (r) => <span>{formatUtc(r.generatedAt)}</span>,
    },
    {
      key: 'scanner',
      label: 'SCANNER',
      render: (r) => <span>{r.scannerName}</span>,
    },
    {
      key: 'candidates',
      label: 'CANDIDATES',
      render: (r) => (
        <span className="font-mono">{r.candidateCount}</span>
      ),
      className: 'text-right',
    },
    {
      key: 'id',
      label: 'SCAN ID',
      render: (r) => (
        <span className="font-mono text-[10.5px] text-white/45">
          {r.id.slice(0, 8)}…
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
          Scan ingest log
        </h1>
        <p className="text-[11px] uppercase tracking-[0.08em] text-white/45 mt-2">
          LAST {rows.length} INGESTS · MOST RECENT FIRST
        </p>
      </header>
      <AdminTable rows={rows} columns={cols} emptyLabel="NO SCANS INGESTED" />
    </>
  );
}
