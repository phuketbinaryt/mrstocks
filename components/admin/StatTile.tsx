type Tone = 'default' | 'green' | 'amber' | 'red' | 'cyan';

const TONE_BORDER: Record<Tone, string> = {
  default: 'border-white/15',
  green: 'border-[oklch(0.78_0.16_150/0.5)]',
  amber: 'border-[oklch(0.82_0.16_75/0.5)]',
  red: 'border-[oklch(0.66_0.20_25/0.55)]',
  cyan: 'border-[oklch(0.78_0.12_200/0.5)]',
};

const TONE_TEXT: Record<Tone, string> = {
  default: 'text-white',
  green: 'text-[oklch(0.78_0.16_150)]',
  amber: 'text-[oklch(0.82_0.16_75)]',
  red: 'text-[oklch(0.66_0.20_25)]',
  cyan: 'text-[oklch(0.78_0.12_200)]',
};

export interface StatTileProps {
  label: string;
  value: string | number;
  hint?: string;
  tone?: Tone;
}

export default function StatTile({
  label,
  value,
  hint,
  tone = 'default',
}: StatTileProps) {
  return (
    <div
      className={`border ${TONE_BORDER[tone]} bg-[#0B0B0B] rounded-sm p-4 flex flex-col gap-1.5`}
    >
      <span className="text-[9.5px] uppercase tracking-[0.15em] text-white/55">
        {label}
      </span>
      <span
        className={`font-mono tabular-nums text-[24px] leading-none ${TONE_TEXT[tone]}`}
      >
        {value}
      </span>
      {hint && (
        <span className="text-[10px] uppercase tracking-[0.08em] text-white/45 mt-0.5">
          {hint}
        </span>
      )}
    </div>
  );
}
