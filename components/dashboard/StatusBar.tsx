// Sticky bottom status bar: READY pill + CAND count + UNIV + TF + version.
// Ported from ms-dashboard.jsx StatusBar.

export interface StatusBarProps {
  total: number;
  shown: number;
  universeSize?: number | null;
  barSeconds?: number | null;
}

export default function StatusBar({
  total,
  shown,
  universeSize,
  barSeconds,
}: StatusBarProps) {
  const tf = barSeconds ? `${Math.round(barSeconds / 60)}M` : '—';
  const univ = universeSize ? `${universeSize}` : 'US-LRG';
  return (
    <div className="border-t-[1.5px] border-white/22 bg-black sticky bottom-0">
      <div className="flex items-center gap-3 px-3 md:px-5 h-7 md:h-8 text-[10px] uppercase tracking-[0.08em]">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-[oklch(0.78_0.16_150)] shadow-[0_0_6px_oklch(0.78_0.16_150)]" />
          <span className="text-[oklch(0.78_0.16_150)]">READY</span>
        </span>
        <span className="text-[oklch(0.82_0.16_75/0.5)]">│</span>
        <span className="text-[oklch(0.78_0.12_200)]">
          CAND{' '}
          <span className="text-white font-mono tabular-nums">
            {String(shown).padStart(3, '0')}
          </span>
          <span className="text-white/55">/{String(total).padStart(3, '0')}</span>
        </span>
        <span className="hidden md:inline text-[oklch(0.82_0.16_75/0.5)]">│</span>
        <span className="hidden md:inline text-[oklch(0.78_0.12_200)]">
          UNIV <span className="text-white">{univ}</span>
        </span>
        <span className="hidden md:inline text-[oklch(0.82_0.16_75/0.5)]">│</span>
        <span className="hidden md:inline text-[oklch(0.78_0.12_200)]">
          TF <span className="text-white">{tf}</span>
        </span>
        <span className="hidden md:inline text-[oklch(0.82_0.16_75/0.5)]">│</span>
        <span className="hidden md:inline text-[oklch(0.78_0.12_200)]">
          V<span className="text-white">2.4</span>
        </span>
      </div>
    </div>
  );
}
