import Link from 'next/link';
import { listMembers } from '@/lib/admin/queries';
import AdminTable, { type AdminTableColumn } from '@/components/admin/AdminTable';

export const dynamic = 'force-dynamic';

type Member = Awaited<ReturnType<typeof listMembers>>[number];

function formatDate(d: Date | null | undefined): string {
  if (!d) return '—';
  return d.toISOString().slice(0, 10);
}

export default async function AdminMembersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const search = q?.trim() ?? '';
  const rows = await listMembers(200, search || undefined);

  const cols: AdminTableColumn<Member>[] = [
    {
      key: 'email',
      label: 'EMAIL',
      render: (r) => (
        <Link
          href={`/admin/members/${r.id}`}
          className="text-white hover:text-[oklch(0.82_0.16_75)]"
        >
          {r.email}
        </Link>
      ),
    },
    {
      key: 'status',
      label: 'STATUS',
      render: (r) => (
        <span
          className={
            r.membershipStatus === 'active'
              ? 'text-[oklch(0.78_0.16_150)]'
              : 'text-white/55'
          }
        >
          {(r.membershipStatus ?? 'none').toUpperCase()}
        </span>
      ),
    },
    {
      key: 'plan',
      label: 'PLAN',
      render: (r) => <span>{r.plan ?? '—'}</span>,
    },
    {
      key: 'admin',
      label: 'ADMIN',
      render: (r) => (
        <span
          className={
            r.isAdmin ? 'text-[oklch(0.82_0.16_75)]' : 'text-white/35'
          }
        >
          {r.isAdmin ? 'YES' : '—'}
        </span>
      ),
    },
    {
      key: 'renewal',
      label: 'RENEWS',
      render: (r) => <span>{formatDate(r.currentPeriodEnd)}</span>,
    },
    {
      key: 'created',
      label: 'JOINED',
      render: (r) => <span>{formatDate(r.createdAt)}</span>,
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
            Members
          </h1>
        </div>
        <form action="/admin/members" method="GET" className="flex items-center gap-2">
          <input
            type="text"
            name="q"
            defaultValue={search}
            placeholder="email contains…"
            className="bg-[#0B0B0B] border border-white/15 rounded-sm px-2.5 py-1.5 text-[12px] text-white placeholder:text-white/35 w-[260px]"
          />
          <button
            type="submit"
            className="text-[10.5px] uppercase tracking-[0.12em] border border-white/22 bg-[#0B0B0B] px-3 py-1.5 rounded-sm hover:border-white/35"
          >
            SEARCH
          </button>
        </form>
      </header>
      <AdminTable rows={rows} columns={cols} emptyLabel="NO MEMBERS YET" />
      <p className="mt-3 text-[10px] uppercase tracking-[0.12em] text-white/35">
        SHOWING {rows.length} ROW{rows.length === 1 ? '' : 'S'}
      </p>
    </>
  );
}
