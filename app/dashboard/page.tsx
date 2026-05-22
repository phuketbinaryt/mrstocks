import { redirect } from 'next/navigation';
import Link from 'next/link';
import Logo from '@/components/Logo';
import { auth, signOut } from '@/lib/auth';

export const metadata = {
  title: 'Dashboard — MR/STOCKS',
};

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.email) {
    redirect('/signin');
  }

  return (
    <main className="min-h-screen bg-black text-white flex flex-col">
      <header className="flex items-center gap-3 px-4 md:px-8 h-12 md:h-14 border-b border-white/12 bg-black/80 backdrop-blur">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <Logo size={18} />
          <span className="text-[12px] tracking-[0.22em] uppercase text-[oklch(0.82_0.16_75)] font-medium">
            MR/STOCKS
          </span>
        </Link>
        <span className="ml-3 text-[10.5px] uppercase tracking-[0.14em] text-white/55 hidden md:inline">
          / DASHBOARD
        </span>
        <div className="flex-1" />
        <span className="text-[11px] uppercase tracking-[0.1em] text-white/55 hidden md:inline">
          {session.user.email}
        </span>
        <form
          action={async () => {
            'use server';
            await signOut({ redirectTo: '/' });
          }}
        >
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 px-2.5 py-1 md:px-3 md:py-1.5 rounded-sm border border-white/22 bg-[#0B0B0B] text-white/85 text-[11px] uppercase tracking-[0.12em] hover:border-white/35 cursor-pointer"
          >
            SIGN OUT
          </button>
        </form>
      </header>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-[560px]">
          <div className="mb-5 flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[oklch(0.78_0.16_150)] shadow-[0_0_6px_oklch(0.78_0.16_150)]" />
            <span className="text-[10.5px] uppercase tracking-[0.18em] text-[oklch(0.78_0.16_150)]">
              SESSION ACTIVE
            </span>
          </div>

          <h1 className="uppercase tracking-[-0.005em] leading-[1.02] text-[32px] md:text-[44px] text-white mb-3">
            Hello{' '}
            <span className="text-[oklch(0.82_0.16_75)] normal-case tracking-tight">
              {session.user.email}
            </span>
          </h1>
          <p className="text-[13px] md:text-[14px] leading-relaxed text-white/65 max-w-[52ch] mb-8">
            Phase 1 foundation is live. The pre-market scanner dashboard,
            watchlists, and alert delivery arrive in later phases.
          </p>

          <div className="border border-white/12 rounded-sm bg-[#0B0B0B] divide-y divide-white/10">
            <Row label="ACCOUNT EMAIL" value={session.user.email} />
            <Row label="SESSION STRATEGY" value="DATABASE" />
            <Row label="PHASE" value="01 / FOUNDATION" tone="amber" />
          </div>
        </div>
      </div>
    </main>
  );
}

function Row({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: 'amber';
}) {
  const valueColor =
    tone === 'amber' ? 'text-[oklch(0.82_0.16_75)]' : 'text-white';
  return (
    <div className="px-4 py-3.5 flex items-center justify-between gap-4">
      <span className="text-[10.5px] uppercase tracking-[0.14em] text-white/55">
        {label}
      </span>
      <span className={`text-[12.5px] tabular-nums font-mono ${valueColor}`}>
        {value}
      </span>
    </div>
  );
}
