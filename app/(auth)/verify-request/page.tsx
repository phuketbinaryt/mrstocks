import Link from 'next/link';
import Logo from '@/components/Logo';

export const metadata = {
  title: 'Check your email — MR/STOCKS',
};

export default function VerifyRequestPage() {
  return (
    <main className="relative min-h-screen bg-black text-white flex flex-col">
      <div
        className="absolute inset-0 opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />
      <div
        className="absolute -top-40 left-1/4 h-[460px] w-[700px] rounded-full pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, oklch(0.78 0.16 150 / 0.12) 0%, transparent 60%)',
        }}
      />

      <header className="relative flex items-center gap-3 px-4 md:px-8 h-12 md:h-14 border-b border-white/12 bg-black/80 backdrop-blur">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <Logo size={18} />
          <span className="text-[12px] tracking-[0.22em] uppercase text-[oklch(0.82_0.16_75)] font-medium">
            MR/STOCKS
          </span>
        </Link>
      </header>

      <div className="relative flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-[460px]">
          <div className="border border-white/15 rounded-sm bg-[#0B0B0B] p-7">
            <div className="mb-5 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[oklch(0.78_0.16_150)] shadow-[0_0_6px_oklch(0.78_0.16_150)]" />
              <span className="text-[10.5px] uppercase tracking-[0.18em] text-[oklch(0.78_0.16_150)]">
                LINK DISPATCHED
              </span>
            </div>

            <h1 className="uppercase tracking-[-0.005em] leading-[1.02] text-[26px] md:text-[32px] text-white mb-3">
              Check your email.
            </h1>
            <p className="text-[13px] leading-relaxed text-white/65 mb-5">
              A sign-in link has been sent to your inbox. Click it to land on
              your dashboard.
            </p>

            <div className="rounded-sm border border-white/10 bg-[#050505] px-3 py-3 mb-5">
              <div className="text-[10px] uppercase tracking-[0.14em] text-white/45 mb-1.5">
                EXPIRES IN
              </div>
              <div className="text-[14px] text-white tabular-nums font-mono">
                30 MIN
              </div>
            </div>

            <p className="text-[11.5px] leading-relaxed text-white/45">
              Didn&apos;t see it? Check your spam folder, or{' '}
              <Link
                href="/signin"
                className="text-[oklch(0.82_0.16_75)] hover:underline"
              >
                request a new link
              </Link>
              .
            </p>
          </div>

          <p className="mt-6 text-center text-[10.5px] uppercase tracking-[0.14em] text-white/35">
            ← <Link href="/" className="hover:text-white/70">RETURN TO HOME</Link>
          </p>
        </div>
      </div>
    </main>
  );
}
