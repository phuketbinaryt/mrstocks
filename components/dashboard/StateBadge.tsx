// Setup-state pill — color-coded per state. Translucent fill + tone-colored
// text + 30% tone inset border. Ported from ms-dashboard.jsx.
import { STATES } from '@/lib/scans/state-config';

export interface StateBadgeProps {
  state: string;
  size?: 'sm' | 'md';
  dot?: boolean;
}

export default function StateBadge({
  state,
  size = 'sm',
  dot = true,
}: StateBadgeProps) {
  const s = STATES[state];
  if (!s) return null;
  const padding =
    size === 'md' ? 'px-2.5 py-1 text-[11px]' : 'px-2 py-0.5 text-[10px]';
  // Build inset border color: replace closing paren with " / 0.3)" only if
  // there's no alpha already; for our STATES tones (no alpha) this works.
  const insetBorder = s.tone.replace(')', ' / 0.3)');
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded ${padding} font-mono uppercase tracking-[0.08em] font-medium`}
      style={{
        color: s.tone,
        background: s.soft,
        boxShadow: `inset 0 0 0 1px ${insetBorder}`,
      }}
    >
      {dot && (
        <span
          className="h-1.5 w-1.5 rounded-full"
          style={{ background: s.tone }}
        />
      )}
      {s.label}
    </span>
  );
}
