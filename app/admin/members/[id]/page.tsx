import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { getMemberById } from '@/lib/admin/queries';
import {
  grantAdminAction,
  revokeAdminAction,
} from '@/lib/admin/actions';

export const dynamic = 'force-dynamic';

function formatDate(d: Date | null | undefined): string {
  if (!d) return '—';
  return d.toISOString().slice(0, 10);
}

export default async function AdminMemberDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const m = await getMemberById(id);
  if (!m) return notFound();

  return (
    <>
      <div className="mb-6">
        <Link
          href="/admin/members"
          className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.12em] text-white/55 hover:text-white"
        >
          <ArrowLeft size={11} /> ALL MEMBERS
        </Link>
      </div>
      <header className="mb-6">
        <span className="text-[10px] uppercase tracking-[0.22em] text-[oklch(0.82_0.16_75)]">
          MEMBER
        </span>
        <h1 className="text-[20px] mt-1 text-white font-mono">{m.email}</h1>
      </header>

      <section className="border border-white/12 rounded-sm bg-[#0B0B0B] p-5 mb-4">
        <h2 className="text-[10px] uppercase tracking-[0.16em] text-white/55 mb-3">
          ACCOUNT
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-[12px]">
          <Field label="ID" value={m.id} mono />
          <Field label="NAME" value={m.name ?? '—'} />
          <Field label="JOINED" value={formatDate(m.createdAt)} />
          <Field label="IS_ADMIN" value={m.isAdmin ? 'TRUE' : 'FALSE'} />
          <Field label="ALERT RULES" value={String(m.alertRuleCount)} />
        </div>
      </section>

      <section className="border border-white/12 rounded-sm bg-[#0B0B0B] p-5 mb-4">
        <h2 className="text-[10px] uppercase tracking-[0.16em] text-white/55 mb-3">
          MEMBERSHIP
        </h2>
        {m.membership ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-[12px]">
            <Field label="STATUS" value={(m.membership.status ?? '—').toUpperCase()} />
            <Field label="PLAN" value={m.membership.plan ?? '—'} />
            <Field label="WHOP USER" value={m.membership.whopUserId ?? '—'} mono />
            <Field label="WHOP MEMBERSHIP" value={m.membership.whopMembershipId ?? '—'} mono />
            <Field label="RENEWS" value={formatDate(m.membership.currentPeriodEnd)} />
            <Field label="UPDATED" value={formatDate(m.membership.updatedAt)} />
          </div>
        ) : (
          <p className="text-[12px] text-white/55">No membership row.</p>
        )}
      </section>

      <section className="border border-white/12 rounded-sm bg-[#0B0B0B] p-5">
        <h2 className="text-[10px] uppercase tracking-[0.16em] text-white/55 mb-3">
          ACTIONS
        </h2>
        {m.isAdmin ? (
          <form action={revokeAdminAction}>
            <input type="hidden" name="userId" value={m.id} />
            <button
              type="submit"
              className="text-[11px] uppercase tracking-[0.12em] border border-[oklch(0.66_0.20_25/0.55)] bg-[oklch(0.66_0.20_25/0.15)] text-[oklch(0.66_0.20_25)] px-3 py-1.5 rounded-sm hover:bg-[oklch(0.66_0.20_25/0.25)]"
            >
              REVOKE ADMIN
            </button>
          </form>
        ) : (
          <form action={grantAdminAction}>
            <input type="hidden" name="userId" value={m.id} />
            <button
              type="submit"
              className="text-[11px] uppercase tracking-[0.12em] border border-[oklch(0.82_0.16_75/0.6)] bg-[oklch(0.82_0.16_75/0.2)] text-[oklch(0.82_0.16_75)] px-3 py-1.5 rounded-sm hover:bg-[oklch(0.82_0.16_75/0.3)]"
            >
              GRANT ADMIN
            </button>
          </form>
        )}
      </section>
    </>
  );
}

function Field({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[9.5px] uppercase tracking-[0.12em] text-white/45">
        {label}
      </span>
      <span
        className={`text-white/85 ${mono ? 'font-mono text-[11px] break-all' : ''}`}
      >
        {value}
      </span>
    </div>
  );
}
