import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import Logo from '@/components/Logo';
import { signInWithEmail, signInWithWhop } from '../../signin/actions';

export const metadata = {
  title: 'Sign in — MR/STOCKS',
};

export default function SignInPage() {
  return (
    <main className="relative min-h-screen bg-black text-white flex flex-col">
      {/* faint grid */}
      <div
        className="absolute inset-0 opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />
      {/* amber glow */}
      <div
        className="absolute -top-40 right-1/4 h-[460px] w-[700px] rounded-full pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, oklch(0.82 0.16 75 / 0.12) 0%, transparent 60%)',
        }}
      />

      {/* top bar */}
      <header className="relative flex items-center gap-3 px-4 md:px-8 h-12 md:h-14 border-b border-white/12 bg-black/80 backdrop-blur">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <Logo size={18} />
          <span className="text-[12px] tracking-[0.22em] uppercase text-[oklch(0.82_0.16_75)] font-medium">
            MR/STOCKS
          </span>
        </Link>
        <div className="flex-1" />
        <Link
          href="/"
          className="text-[11px] uppercase tracking-[0.12em] text-white/55 hover:text-white"
        >
          ← BACK
        </Link>
      </header>

      <div className="relative flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-[420px]">
          <div className="mb-6 flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[oklch(0.82_0.16_75)] shadow-[0_0_6px_oklch(0.82_0.16_75)]" />
            <span className="text-[10.5px] uppercase tracking-[0.18em] text-[oklch(0.82_0.16_75)]">
              MEMBER SIGN IN
            </span>
          </div>

          <h1 className="uppercase tracking-[-0.005em] leading-[1.02] text-[32px] md:text-[40px] text-white mb-3">
            Sign in.
          </h1>
          <p className="text-[13px] md:text-[14px] leading-relaxed text-white/65 mb-8 max-w-[44ch]">
            Continue with your Whop subscription, or use a magic link
            email. Both lead to the same account.
          </p>

          <form action={signInWithWhop} className="mb-5">
            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-sm border border-[oklch(0.82_0.16_75/0.6)] bg-[oklch(0.82_0.16_75/0.18)] text-[oklch(0.82_0.16_75)] text-[12px] uppercase tracking-[0.14em] hover:bg-[oklch(0.82_0.16_75/0.28)] cursor-pointer"
            >
              CONTINUE WITH WHOP <ArrowUpRight size={12} />
            </button>
          </form>

          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-[9.5px] uppercase tracking-[0.18em] text-white/45">
              OR
            </span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          <form action={signInWithEmail} className="space-y-3">
            <label className="flex flex-col gap-1.5">
              <span className="text-[10.5px] uppercase tracking-[0.14em] text-[oklch(0.78_0.12_200)]">
                ACCOUNT EMAIL
              </span>
              <div className="flex items-stretch border border-white/22 focus-within:border-[oklch(0.82_0.16_75/0.7)] rounded-sm bg-[#080808] overflow-hidden">
                <input
                  type="email"
                  name="email"
                  required
                  autoComplete="email"
                  placeholder="you@example.com"
                  className="flex-1 bg-transparent px-3 py-2.5 text-[13px] text-white placeholder-white/35 outline-none font-mono"
                />
              </div>
            </label>

            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-sm border border-white/22 bg-[#0B0B0B] text-white text-[12px] uppercase tracking-[0.14em] hover:bg-white/[0.04] hover:border-white/30 cursor-pointer"
            >
              SEND MAGIC LINK →
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/10">
            <p className="text-[11px] uppercase tracking-[0.12em] text-white/45">
              NOT A MEMBER?{' '}
              <Link href="/pricing" className="text-[oklch(0.82_0.16_75)] hover:underline">
                SUBSCRIBE →
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
