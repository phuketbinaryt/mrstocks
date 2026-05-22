export default function Features() {
  const features = [
    {
      n: '01',
      title: 'DAILY SCAN',
      body:
        '~500 US large-caps evaluated every market morning at 09:15 NY. Tight power-zone setups are ranked and tagged with a state and a Prior45 position.',
      stat: '500',
      statLbl: 'SYMBOLS · 2-MIN BARS',
      tone: 'oklch(0.82 0.16 75)',
    },
    {
      n: '02',
      title: 'YOUR WATCHLIST',
      body:
        'Filter to the names you actually trade. Set one as default and the dashboard opens to your shortlist every morning.',
      stat: '∞',
      statLbl: 'WATCHLISTS · NO LIMIT',
      tone: 'oklch(0.78 0.12 200)',
    },
    {
      n: '03',
      title: 'A+ ALERTS',
      body:
        'Web push + email when a rule matches. Threshold, states, zones, and watchlist are all yours. We never email you junk.',
      stat: 'PUSH',
      statLbl: '+ EMAIL · INSTANT',
      tone: 'oklch(0.78 0.16 150)',
    },
  ];

  return (
    <section className="px-4 md:px-8 py-10 md:py-16 border-y border-white/12">
      <div className="max-w-[1180px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
          {features.map((f) => (
            <article
              key={f.n}
              className="border border-white/15 rounded-sm bg-[#0B0B0B] p-5 flex flex-col gap-4 hover:border-white/25 transition-colors"
            >
              <div className="flex items-baseline justify-between">
                <span
                  className="text-[9.5px] uppercase tracking-[0.18em]"
                  style={{ color: f.tone }}
                >
                  {f.n}
                </span>
                <span
                  className="font-mono tabular-nums text-[28px] leading-none"
                  style={{ color: f.tone }}
                >
                  {f.stat}
                </span>
              </div>
              <h3 className="text-[16px] uppercase tracking-[0.06em] text-white font-medium">
                {f.title}
              </h3>
              <p className="text-[13px] text-white/75 leading-relaxed">{f.body}</p>
              <div className="mt-auto text-[9.5px] uppercase tracking-[0.14em] text-white/45">
                {f.statLbl}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
