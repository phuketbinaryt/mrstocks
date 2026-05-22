// Threshold-colored score: ≥90 green, ≥75 blue, ≥60 amber, else red.
// Mono numeric atop a 3px-tall colored bar filled to `${score}%`.

export interface ScoreMeterProps {
  score: number;
}

export default function ScoreMeter({ score }: ScoreMeterProps) {
  const hue = score >= 90 ? 150 : score >= 75 ? 250 : score >= 60 ? 72 : 30;
  const tone = `oklch(0.74 0.16 ${hue})`;
  return (
    <div className="flex flex-col items-end gap-1 min-w-[44px]">
      <span
        className="text-[22px] leading-none font-mono tabular-nums font-medium"
        style={{ color: tone }}
      >
        {Math.round(score)}
      </span>
      <div className="h-[3px] w-11 rounded-full bg-white/10 overflow-hidden">
        <div
          className="h-full rounded-full"
          style={{
            width: `${Math.max(0, Math.min(100, score))}%`,
            background: tone,
          }}
        />
      </div>
    </div>
  );
}
