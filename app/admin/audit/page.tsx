import { getAuditLog } from '@/lib/admin/queries';
import AdminTable, { type AdminTableColumn } from '@/components/admin/AdminTable';

export const dynamic = 'force-dynamic';

type AuditRow = Awaited<ReturnType<typeof getAuditLog>>[number];

function formatUtc(d: Date): string {
  return d.toISOString().slice(0, 19).replace('T', ' ');
}

export default async function AdminAuditPage({
  searchParams,
}: {
  searchParams: Promise<{ action?: string }>;
}) {
  const { action } = await searchParams;
  const rows = await getAuditLog(200, action?.trim() || undefined);

  const cols: AdminTableColumn<AuditRow>[] = [
    {
      key: 'created',
      label: 'WHEN (UTC)',
      render: (r) => (
        <span className="font-mono text-[11px]">{formatUtc(r.createdAt)}</span>
      ),
    },
    {
      key: 'action',
      label: 'ACTION',
      render: (r) => (
        <span className="font-mono text-[11px] text-[oklch(0.82_0.16_75)]">
          {r.action}
        </span>
      ),
    },
    {
      key: 'actor',
      label: 'ACTOR',
      render: (r) => (
        <span className="font-mono text-[11px]">
          {r.actorEmail ?? r.actorUserId?.slice(0, 8) ?? 'system'}
        </span>
      ),
    },
    {
      key: 'target',
      label: 'TARGET',
      render: (r) => (
        <span className="font-mono text-[10.5px] text-white/65">
          {r.target ?? '—'}
        </span>
      ),
    },
    {
      key: 'meta',
      label: 'META',
      render: (r) => (
        <span className="font-mono text-[10px] text-white/45">
          {r.meta ? JSON.stringify(r.meta).slice(0, 80) : '—'}
        </span>
      ),
    },
  ];

  return (
    <>
      <header className="mb-6 flex items-end justify-between gap-3 flex-wrap">
        <div>
          <span className="text-[10px] uppercase tracking-[0.22em] text-[oklch(0.82_0.16_75)]">
            ADMIN
          </span>
          <h1 className="text-[22px] uppercase tracking-tight mt-1 text-white">
            Audit log
          </h1>
        </div>
        <form action="/admin/audit" method="GET" className="flex items-center gap-2">
          <input
            type="text"
            name="action"
            defaultValue={action ?? ''}
            placeholder="filter by action (e.g. admin.grant_admin)"
            className="bg-[#0B0B0B] border border-white/15 rounded-sm px-2.5 py-1.5 text-[12px] text-white placeholder:text-white/35 w-[320px] font-mono"
          />
          <button
            type="submit"
            className="text-[10.5px] uppercase tracking-[0.12em] border border-white/22 bg-[#0B0B0B] px-3 py-1.5 rounded-sm hover:border-white/35"
          >
            FILTER
          </button>
        </form>
      </header>
      <AdminTable rows={rows} columns={cols} emptyLabel="NO EVENTS LOGGED" />
      <p className="mt-3 text-[10px] uppercase tracking-[0.12em] text-white/35">
        SHOWING {rows.length} EVENT{rows.length === 1 ? '' : 'S'}
      </p>
    </>
  );
}
