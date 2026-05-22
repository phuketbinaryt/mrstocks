/**
 * Method/how-it-works strip — 3-step horizontal flow with an amber gradient
 * connector on desktop. Mirrors the design's HowItWorks section (a static
 * counterpart of MethodViz which is animated in the design and deferred).
 */
export default function HowItWorks() {
  const steps = [
    {
      t: '09:15 NY',
      body:
        "Scanner runs against the day's pre-market data. 2-minute bars, SMA20 × SMA200 across the eligible universe.",
    },
    {
      t: '09:15:04',
      body:
        '~50 candidates emerge with a state (NARROW, WIDE SNAPBACK, TRENDING…) and a Prior45 zone position.',
    },
    {
      t: '09:15:05',
      body:
        'Rules fire. We push and email the hits. You open the dashboard and act on the signals manually.',
    },
  ];

  return (
    <section id="method" className="px-4 md:px-8 py-10 md:py-16">
      <div className="max-w-[1180px] mx-auto">
        <div className="text-center mb-10">
          <span className="text-[10px] uppercase tracking-[0.22em] text-[oklch(0.82_0.16_75)]">
            METHOD
          </span>
          <h2 className="uppercase tracking-tight text-white mt-3 text-[28px] md:text-[44px]">
            FROM SCAN TO SIGNAL · 5 SECONDS
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 relative">
          <div className="hidden md:block absolute top-[26px] left-[12%] right-[12%] h-px bg-gradient-to-r from-transparent via-[oklch(0.82_0.16_75/0.6)] to-transparent" />
          {steps.map((s, i) => (
            <div
              key={s.t}
              className="relative flex flex-col items-start gap-3 p-5 border border-white/15 rounded-sm bg-[#0B0B0B]"
            >
              <span className="font-mono tabular-nums text-[20px] text-[oklch(0.82_0.16_75)] leading-none">
                {s.t}
              </span>
              <span className="text-[9.5px] uppercase tracking-[0.18em] text-white/55">
                STEP {String(i + 1).padStart(2, '0')}
              </span>
              <p className="text-[13px] text-white/80 leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
