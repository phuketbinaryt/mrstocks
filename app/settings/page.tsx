import { ArrowUpRight } from 'lucide-react';
import { requireActiveMembership } from '@/lib/membership/require';
import { db } from '@/lib/db/client';
import { memberships } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { signOut } from '@/lib/auth';
import { env } from '@/lib/env';
import TopBar from '@/components/dashboard/TopBar';
import PushEnableButton from '@/components/settings/PushEnableButton';

export const metadata = { title: 'Settings — MR/STOCKS' };
export const dynamic = 'force-dynamic';

// Stub: the Whop management URL is the same for all users today (no
// per-customer dashboard URL). The user can paste a per-product URL into
// WHOP_MANAGE_URL in a follow-up.
const WHOP_MANAGE_URL = 'https://whop.com/orders';

export default async function SettingsPage() {
  const session = await requireActiveMembership('/settings');

  const [m] = await db
    .select({
      status: memberships.status,
      plan: memberships.plan,
      currentPeriodEnd: memberships.currentPeriodEnd,
      updatedAt: memberships.updatedAt,
    })
    .from(memberships)
    .where(eq(memberships.userId, session.user!.id!))
    .limit(1);

  const renewalLabel = m?.currentPeriodEnd
    ? new Intl.DateTimeFormat('en-US', {
        timeZone: 'America/New_York',
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
        .format(m.currentPeriodEnd)
        .toUpperCase()
        .replace(/(\d{2}) (\w{3})/, '$1-$2')
    : '—';

  return (
    <main className="min-h-screen bg-black text-white flex flex-col">
      <TopBar generatedAt={new Date()} title="SETTINGS" />

      <div className="flex-1">
        <div className="max-w-[760px] mx-auto px-4 md:px-6 py-8 flex flex-col gap-6">
          <header className="flex items-end justify-between gap-3 border-b border-white/12 pb-3">
            <div>
              <span className="text-[10px] uppercase tracking-[0.16em] text-[oklch(0.82_0.16_75)]">
                ACCOUNT
              </span>
              <h1 className="text-[18px] text-white uppercase tracking-[0.06em] mt-1">
                {session.user?.email ?? '—'}
              </h1>
            </div>
          </header>

          {/* 01 PROFILE */}
          <section className="border border-white/12 rounded-sm bg-[#0B0B0B] p-5">
            <div className="flex items-baseline gap-2.5 mb-4">
              <span className="text-[9.5px] uppercase tracking-[0.15em] text-[oklch(0.82_0.16_75)]">
                01
              </span>
              <h2 className="text-[12px] text-white uppercase tracking-[0.12em] font-medium">
                Profile
              </h2>
            </div>
            <Field
              label="EMAIL"
              value={session.user?.email ?? '—'}
              hint="Verified at sign-in"
            />
          </section>

          {/* 02 SUBSCRIPTION */}
          <section className="border border-white/12 rounded-sm bg-[#0B0B0B] p-5">
            <div className="flex items-baseline gap-2.5 mb-4">
              <span className="text-[9.5px] uppercase tracking-[0.15em] text-[oklch(0.82_0.16_75)]">
                02
              </span>
              <h2 className="text-[12px] text-white uppercase tracking-[0.12em] font-medium">
                Subscription
              </h2>
            </div>
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="flex flex-col gap-2 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-sm text-[10px] uppercase tracking-[0.1em] border border-[oklch(0.78_0.16_150/0.5)] bg-[oklch(0.78_0.16_150/0.15)] text-[oklch(0.78_0.16_150)]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[oklch(0.78_0.16_150)]" />
                    {(m?.status ?? 'unknown').toUpperCase()}
                  </span>
                  <span className="text-[10.5px] uppercase tracking-[0.1em] text-white/55">
                    PLAN {m?.plan ?? 'MEMBER'}
                  </span>
                </div>
                <div className="font-mono tabular-nums text-[22px] text-white">
                  MEMBER · $29/MO
                </div>
                <div className="text-[11.5px] uppercase tracking-[0.08em] text-white/55">
                  RENEWS {renewalLabel}
                </div>
              </div>
              <a
                href={WHOP_MANAGE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-sm border border-[oklch(0.82_0.16_75/0.6)] bg-[oklch(0.82_0.16_75/0.20)] text-[oklch(0.82_0.16_75)] text-[11px] uppercase tracking-[0.12em] hover:bg-[oklch(0.82_0.16_75/0.30)]"
              >
                MANAGE BILLING <ArrowUpRight size={11} />
              </a>
            </div>
          </section>

          {/* 03 NOTIFICATIONS */}
          <section className="border border-white/12 rounded-sm bg-[#0B0B0B] p-5">
            <div className="flex items-baseline gap-2.5 mb-4">
              <span className="text-[9.5px] uppercase tracking-[0.15em] text-[oklch(0.82_0.16_75)]">
                03
              </span>
              <h2 className="text-[12px] text-white uppercase tracking-[0.12em] font-medium">
                Notifications
              </h2>
            </div>
            <PushEnableButton
              publicKey={env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ?? ''}
            />
            <p className="text-[10.5px] uppercase tracking-[0.08em] text-white/45 mt-2">
              MANAGE PER-RULE CHANNELS AT{' '}
              <a
                href="/alerts"
                className="text-[oklch(0.82_0.16_75)] hover:underline"
              >
                /ALERTS
              </a>
            </p>
          </section>

          {/* Bottom action row */}
          <div className="flex items-center justify-between gap-4">
            <form
              action={async () => {
                'use server';
                await signOut({ redirectTo: '/' });
              }}
            >
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-sm border border-white/22 bg-[#0B0B0B] text-white/85 text-[11px] uppercase tracking-[0.12em] hover:border-white/35 cursor-pointer"
              >
                SIGN OUT
              </button>
            </form>
            <span className="text-[10px] uppercase tracking-[0.1em] text-white/35">
              SCANNER V2.4 · PHASE 3
            </span>
          </div>
        </div>
      </div>
    </main>
  );
}

interface FieldProps {
  label: string;
  value: string;
  hint?: string;
}

function Field({ label, value, hint }: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[10px] uppercase tracking-[0.12em] text-[oklch(0.78_0.12_200)]">
        {label}
      </label>
      <div className="border border-white/22 bg-[#080808] rounded-sm px-3 py-2 text-[13px] text-white font-mono tabular-nums">
        {value}
      </div>
      {hint && (
        <span className="text-[10.5px] uppercase tracking-[0.08em] text-white/45">
          {hint}
        </span>
      )}
    </div>
  );
}
