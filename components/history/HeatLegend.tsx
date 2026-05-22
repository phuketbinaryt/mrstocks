// Single-hue amber 5-bucket density legend. Ported from ms-history.jsx.

const STOPS = [
  { lbl: '0', bg: '#0C0C0C' },
  { lbl: '1-15', bg: 'oklch(0.24 0.06 75)' },
  { lbl: '16-30', bg: 'oklch(0.36 0.10 75)' },
  { lbl: '31-45', bg: 'oklch(0.52 0.14 75)' },
  { lbl: '46+', bg: 'oklch(0.68 0.16 75)' },
];

export default function HeatLegend() {
  return (
    <div className="inline-flex items-center gap-2 text-[9.5px] uppercase tracking-[0.1em] text-white/55">
      <span>FEWER</span>
      <div className="flex gap-px">
        {STOPS.map((s) => (
          <span
            key={s.lbl}
            className="h-3 w-5 border border-white/10"
            style={{ background: s.bg }}
            title={s.lbl}
          />
        ))}
      </div>
      <span>MORE</span>
    </div>
  );
}
