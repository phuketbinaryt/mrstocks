'use client';

export interface ToggleProps {
  on: boolean;
  onChange: (next: boolean) => void;
  labelOn?: string;
  labelOff?: string;
  size?: 'sm' | 'md';
}

export default function Toggle({
  on,
  onChange,
  labelOn = 'ON',
  labelOff = 'OFF',
  size = 'sm',
}: ToggleProps) {
  return (
    <button
      type="button"
      onClick={() => onChange(!on)}
      role="switch"
      aria-checked={on}
      className={`inline-flex items-stretch border rounded-sm overflow-hidden text-[9.5px] uppercase tracking-[0.12em] ${
        on ? 'border-[oklch(0.82_0.16_75/0.6)]' : 'border-white/22'
      }`}
    >
      <span
        className={`px-1.5 ${size === 'sm' ? 'py-0.5' : 'py-1'} ${
          on
            ? 'bg-[oklch(0.82_0.16_75/0.18)] text-[oklch(0.82_0.16_75)]'
            : 'bg-white/5 text-white/55'
        }`}
      >
        {labelOn}
      </span>
      <span
        className={`px-1.5 ${size === 'sm' ? 'py-0.5' : 'py-1'} ${
          !on ? 'bg-white/10 text-white' : 'bg-transparent text-white/45'
        }`}
      >
        {labelOff}
      </span>
    </button>
  );
}
