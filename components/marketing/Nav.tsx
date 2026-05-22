import Link from 'next/link';
import { Menu } from 'lucide-react';
import Logo from '@/components/Logo';
import LivePill from './LivePill';

export default function Nav() {
  return (
    <header className="sticky top-0 z-40 flex items-center gap-3 px-4 md:px-8 h-12 md:h-14 border-b border-white/12 bg-black/80 backdrop-blur">
      <Link href="/" className="flex items-center gap-2 shrink-0">
        <Logo size={18} />
        <span className="text-[12px] tracking-[0.22em] uppercase text-[oklch(0.82_0.16_75)] font-medium">
          MR/STOCKS
        </span>
      </Link>

      <nav className="ml-8 hidden md:flex items-center gap-6 text-[11.5px] uppercase tracking-[0.12em] text-white/75">
        <a href="#method" className="hover:text-white cursor-pointer">
          METHOD
        </a>
        <a href="#pricing" className="hover:text-white cursor-pointer">
          PRICING
        </a>
        <a href="#faq" className="hover:text-white cursor-pointer">
          FAQ
        </a>
      </nav>

      <div className="flex-1" />

      <div className="hidden md:flex items-center gap-3">
        <LivePill />
        <Link
          href="/login"
          className="text-[11px] uppercase tracking-[0.1em] text-white/75 hover:text-white"
        >
          SIGN IN
        </Link>
      </div>

      <a
        href="#pricing"
        className="inline-flex items-center gap-1.5 px-2.5 py-1 md:px-3 md:py-1.5 rounded-sm border border-[oklch(0.82_0.16_75/0.55)] bg-[oklch(0.82_0.16_75/0.14)] text-[oklch(0.82_0.16_75)] text-[11px] uppercase tracking-[0.12em] hover:bg-[oklch(0.82_0.16_75/0.22)] whitespace-nowrap"
      >
        SUBSCRIBE
      </a>

      <button
        aria-label="Menu"
        className="md:hidden p-1.5 rounded-sm text-white/75 hover:text-white border border-white/15 ml-1"
      >
        <Menu size={14} />
      </button>
    </header>
  );
}
