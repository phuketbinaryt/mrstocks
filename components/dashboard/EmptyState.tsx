// "NO SCAN YET TODAY" empty state for /dashboard when getLatestScan() is
// null or stale. Ported from ms-dashboard.jsx EmptyState. Phase 3 ships
// only the no-scan variant; sync-failed + locked variants land in Phase 5.
import { Sparkles, Clock } from 'lucide-react';

export interface EmptyStateProps {
  variant?: 'no-scan-yet';
}

export default function EmptyState({
  variant: _variant = 'no-scan-yet',
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center text-center pt-16 px-6 md:pt-24 md:px-12">
      <div className="relative mb-6">
        <div className="h-16 w-16 rounded border border-white/18 bg-[#0B0B0B] grid place-items-center">
          <Sparkles size={22} stroke="oklch(0.74 0.17 250)" />
        </div>
        <div className="absolute -inset-2 rounded bg-[oklch(0.74_0.17_250)] opacity-[0.08] blur-2xl -z-10" />
      </div>
      <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/75 mb-2">
        NO SCAN YET TODAY
      </div>
      <h2 className="text-[20px] text-white font-medium tracking-tight max-w-[26ch]">
        The opening scanner runs at 09:15 NY each market morning.
      </h2>
      <p className="text-[13px] text-white/75 mt-2 max-w-[40ch]">
        Today&apos;s results will appear here automatically. You&apos;ll get a
        push notification when A+ setups are found.
      </p>
      <div className="mt-7 inline-flex items-center gap-3 px-4 py-2.5 rounded-sm border border-white/22 bg-[#0B0B0B] font-mono text-[11px]">
        <Clock size={12} stroke="oklch(0.78 0.16 150)" />
        <span className="text-white/75">Scanner runs daily at 09:15 NY</span>
      </div>
    </div>
  );
}
