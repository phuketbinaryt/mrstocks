/**
 * Small green "LIVE · SCAN 09:15 NY" pill used in the marketing nav and hero
 * badge area. Per the design system, the dot has an amber/green glow shadow.
 */
export default function LivePill({ label = 'SCAN 09:15 NY' }: { label?: string }) {
  return (
    <span className="hidden md:inline-flex items-center gap-1.5 px-2 py-0.5 border border-[oklch(0.78_0.16_150/0.55)] bg-[oklch(0.78_0.16_150/0.10)] rounded-sm">
      <span className="h-1.5 w-1.5 rounded-full bg-[oklch(0.78_0.16_150)] shadow-[0_0_8px_oklch(0.78_0.16_150)]" />
      <span className="text-[10.5px] text-[oklch(0.78_0.16_150)] tracking-[0.1em] uppercase">
        LIVE
      </span>
      <span className="text-[10.5px] text-white/65 uppercase tracking-[0.08em]">{label}</span>
    </span>
  );
}
