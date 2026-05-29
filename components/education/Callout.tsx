// Bordered note box used inside education MDX articles. Three tones map to
// the MR/STOCKS palette: info=cyan, caution=amber, danger=red. Rendered via
// the MDX component registry so articles can write <Callout tone="caution">.
import type { ReactNode } from 'react';

export type CalloutTone = 'info' | 'caution' | 'danger';

export interface CalloutProps {
  tone?: CalloutTone;
  children: ReactNode;
}

const TONES: Record<CalloutTone, { border: string; bg: string; label: string; labelText: string }> = {
  info: {
    border: 'oklch(0.76 0.12 200 / 0.45)',
    bg: 'oklch(0.30 0.09 200 / 0.12)',
    label: 'NOTE',
    labelText: 'oklch(0.80 0.13 200)',
  },
  caution: {
    border: 'oklch(0.82 0.16 75 / 0.45)',
    bg: 'oklch(0.34 0.10 75 / 0.12)',
    label: 'HEADS UP',
    labelText: 'oklch(0.84 0.16 75)',
  },
  danger: {
    border: 'oklch(0.74 0.17 28 / 0.5)',
    bg: 'oklch(0.32 0.12 28 / 0.14)',
    label: 'AVOID',
    labelText: 'oklch(0.78 0.17 28)',
  },
};

export default function Callout({ tone = 'info', children }: CalloutProps) {
  const t = TONES[tone];
  return (
    <div
      className="my-5 rounded-sm border px-4 py-3"
      style={{ borderColor: t.border, background: t.bg }}
    >
      <span
        className="block text-[9.5px] font-mono uppercase tracking-[0.18em] mb-1.5"
        style={{ color: t.labelText }}
      >
        {t.label}
      </span>
      <div className="text-[13.5px] leading-relaxed text-white/85 [&>p]:my-1 [&>p:first-child]:mt-0 [&>p:last-child]:mb-0">
        {children}
      </div>
    </div>
  );
}
