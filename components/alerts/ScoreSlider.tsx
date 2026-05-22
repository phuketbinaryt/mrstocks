'use client';

export interface ScoreSliderProps {
  value: number;
  onChange: (v: number) => void;
}

export default function ScoreSlider({ value, onChange }: ScoreSliderProps) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between">
        <span className="text-[10px] uppercase tracking-[0.12em] text-[oklch(0.78_0.12_200)]">
          SCORE THRESHOLD
        </span>
        <span className="font-mono tabular-nums text-[18px] text-white">
          {value}
          <span className="text-white/50 text-[12px]">/100</span>
        </span>
      </div>
      <div className="relative h-7">
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[3px] bg-white/10 rounded-sm" />
        <div
          className="absolute left-0 top-1/2 -translate-y-1/2 h-[3px] rounded-sm"
          style={{
            width: `${pct}%`,
            background: 'oklch(0.82 0.16 75)',
            boxShadow: '0 0 8px oklch(0.82 0.16 75 / 0.6)',
          }}
        />
        {[60, 75, 90].map((t) => (
          <div
            key={t}
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-px h-2 bg-white/30"
            style={{ left: `${t}%` }}
          />
        ))}
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-4 w-2 bg-[oklch(0.82_0.16_75)] rounded-sm shadow-[0_0_10px_oklch(0.82_0.16_75)]"
          style={{ left: `${pct}%` }}
        />
        <input
          type="range"
          min={0}
          max={100}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full opacity-0 cursor-pointer"
          aria-label="Minimum score"
        />
      </div>
      <div className="flex justify-between text-[9.5px] uppercase tracking-[0.1em] text-white/45 tabular-nums">
        <span>0</span>
        <span>C · 60</span>
        <span>B · 75</span>
        <span>A+ · 90</span>
        <span>100</span>
      </div>
    </div>
  );
}
