// Dashboard sticky top bar: logo + wordmark + centered LIVE pill + right
// avatar/sign-out. Ported from ms-dashboard.jsx TopBar. The "NEXT" countdown
// is rendered server-side as a static placeholder for now (no client clock).
import Link from 'next/link';
import { Bell, ChevronDown } from 'lucide-react';
import Logo from '@/components/Logo';

export interface TopBarProps {
  generatedAt: Date;
  title?: string;
  userInitials?: string;
}

function fmtScanTime(d: Date): string {
  // Format as "HH:MM NY · DD-MMM" (capital month abbreviation).
  // Uses Intl with America/New_York; safe across DST.
  const time = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(d);
  const day = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York',
    day: '2-digit',
    month: 'short',
  })
    .format(d)
    .toUpperCase()
    .replace(' ', '-');
  return `${time} NY · ${day}`;
}

export default function TopBar({
  generatedAt,
  title = 'OPENING SCANNER',
  userInitials = 'LM',
}: TopBarProps) {
  const scanLabel = fmtScanTime(generatedAt);
  return (
    <header
      className="sticky top-0 z-20 backdrop-blur-md bg-black/85 border-b-[1.5px]"
      style={{ borderBottomColor: 'oklch(0.82 0.16 75 / 0.55)' }}
    >
      <div className="flex items-center gap-3 px-3 md:px-5 h-11 md:h-12">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <Logo size={16} />
          <span className="hidden md:inline text-[11px] tracking-[0.22em] uppercase text-[oklch(0.82_0.16_75)] font-medium">
            MR/STOCKS
          </span>
          <span className="hidden md:inline text-white/30">│</span>
          <span className="text-[11.5px] tracking-[0.14em] uppercase text-white font-medium">
            {title}
          </span>
        </Link>

        <div className="flex-1 hidden md:flex justify-center">
          <div className="flex items-center gap-3 text-[11px] text-white/85">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 border border-[oklch(0.78_0.16_150/0.55)] bg-[oklch(0.78_0.16_150/0.10)] rounded-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-[oklch(0.78_0.16_150)] shadow-[0_0_8px_oklch(0.78_0.16_150)]" />
              <span className="text-[oklch(0.78_0.16_150)] tracking-[0.1em] uppercase">
                LIVE
              </span>
              <span className="text-white/78 font-mono tabular-nums">
                SCAN {scanLabel}
              </span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 ml-auto shrink-0">
          <Link
            href="/watchlists"
            aria-label="Watchlists"
            className="hidden md:inline-flex items-center gap-1.5 px-2 py-1 rounded-sm border border-white/15 text-[10.5px] uppercase tracking-[0.1em] text-white/75 hover:text-white hover:border-white/30"
          >
            WATCHLISTS
          </Link>
          <Link
            href="/history"
            aria-label="History"
            className="hidden md:inline-flex items-center gap-1.5 px-2 py-1 rounded-sm border border-white/15 text-[10.5px] uppercase tracking-[0.1em] text-white/75 hover:text-white hover:border-white/30"
          >
            HISTORY
          </Link>
          <Link
            href="/settings"
            aria-label="Alerts"
            className="relative p-1.5 rounded-sm text-white/75 hover:text-white hover:bg-white/10 border border-transparent hover:border-white/15"
          >
            <Bell size={14} />
            <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-[oklch(0.82_0.16_75)]" />
          </Link>
          <Link
            href="/settings"
            className="flex items-center gap-1.5 pl-1 pr-1.5 py-1 rounded-sm hover:bg-white/10 text-white/85 border border-white/15"
          >
            <span className="h-5 w-5 rounded-sm bg-[oklch(0.82_0.16_75/0.18)] text-[oklch(0.82_0.16_75)] grid place-items-center text-[10px] font-medium">
              {userInitials}
            </span>
            <ChevronDown size={11} />
          </Link>
        </div>
      </div>
    </header>
  );
}
