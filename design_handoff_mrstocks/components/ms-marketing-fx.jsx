// Screen 7 — interactive / animated bits for the marketing page.
// (TickerTape, HeroScanner, BigStats, MethodViz, RuleSandbox)

const W7FX_Icons = window.MS_Icons;

// ─── ticker tape (infinite marquee) ────────────────────────────────────────
function TickerTape() {
  const { SCAN_RESULTS, STATES } = window.MS_DATA;
  const rows = [...SCAN_RESULTS, ...SCAN_RESULTS]; // duplicate for seamless loop
  return (
    <div className="relative border-y border-white/12 bg-[#050505] overflow-hidden">
      <div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />
      <div className="flex items-center h-9" style={{ animation: 'ms-marquee 60s linear infinite', whiteSpace: 'nowrap' }}>
        {rows.map((r, i) => {
          const tone = STATES[r.state]?.tone;
          const up = r.gap >= 0;
          return (
            <span key={i} className="inline-flex items-center gap-2 px-4 text-[11px] uppercase tracking-[0.06em] shrink-0">
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: tone }} />
              <span className="text-white font-medium">{r.symbol}</span>
              <span className="text-white/55 tabular-nums">${r.price.toFixed(2)}</span>
              <span className={`tabular-nums ${up ? 'text-[oklch(0.78_0.16_150)]' : 'text-[oklch(0.74_0.17_28)]'}`}>{up ? '+' : ''}{r.gap.toFixed(2)}%</span>
              <span className="text-[oklch(0.82_0.16_75/0.4)] mx-1">·</span>
              <span className="text-[oklch(0.78_0.12_200)]">{r.zone}</span>
              <span className="text-[oklch(0.82_0.16_75/0.4)] ml-3">│</span>
            </span>
          );
        })}
      </div>
      <style>{`@keyframes ms-marquee { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }`}</style>
    </div>
  );
}

// ─── hero scanner — animated terminal log ──────────────────────────────────
function HeroScanner({ compact = false }) {
  const lines = React.useMemo(() => ([
    { t: '09:14:58', tShort: '14:58', kind: 'sys',   text: 'INIT scanner v2.4',                                   tone: 'cyan'  },
    { t: '09:14:59', tShort: '14:59', kind: 'sys',   text: 'LOAD 2m bars · pre-market ✓',                          tone: 'cyan'  },
    { t: '09:15:00', tShort: '15:00', kind: 'eval',  sym: 'NVDA',  state: 'NARROW',     score: 100, tone: 'amber',  fire: true  },
    { t: '09:15:00', tShort: '15:00', kind: 'eval',  sym: 'AAPL',  state: 'NARROW',     score: 96,  tone: 'amber',  fire: true  },
    { t: '09:15:01', tShort: '15:01', kind: 'eval',  sym: 'MSFT',  state: 'TRENDING',   score: 94,  tone: 'green',  fire: true  },
    { t: '09:15:01', tShort: '15:01', kind: 'eval',  sym: 'META',  state: 'WIDE SNAPBK',score: 88,  tone: 'amber',  fire: false },
    { t: '09:15:02', tShort: '15:02', kind: 'eval',  sym: 'AMD',   state: 'TRENDING',   score: 85,  tone: 'green',  fire: false },
    { t: '09:15:02', tShort: '15:02', kind: 'sys',   text: 'FOUND 47 candidates',                                  tone: 'amber' },
    { t: '09:15:03', tShort: '15:03', kind: 'alert', text: '7 alerts firing → email + push',                       tone: 'green' },
    { t: '09:15:03', tShort: '15:03', kind: 'sys',   text: 'DONE · 4.8s',                                          tone: 'cyan'  },
  ]), []);

  const [visible, setVisible] = React.useState(1);
  React.useEffect(() => {
    if (visible >= lines.length) {
      const reset = setTimeout(() => setVisible(1), 3500);
      return () => clearTimeout(reset);
    }
    const t = setTimeout(() => setVisible((v) => v + 1), 380);
    return () => clearTimeout(t);
  }, [visible, lines.length]);

  const tones = { cyan: 'oklch(0.78 0.12 200)', amber: 'oklch(0.82 0.16 75)', green: 'oklch(0.78 0.16 150)', red: 'oklch(0.74 0.17 28)' };

  return (
    <div className="relative border border-white/15 rounded-sm bg-[#050505] overflow-hidden h-full">
      {/* faux header */}
      <div className="flex items-center gap-2 h-7 px-3 border-b border-white/12 bg-[#0B0B0B]">
        <span className="h-1.5 w-1.5 rounded-full bg-[oklch(0.78_0.16_150)] animate-pulse shrink-0" />
        <span className="text-[10px] uppercase tracking-[0.18em] text-[oklch(0.78_0.16_150)] whitespace-nowrap">LIVE · SCANNER</span>
        {!compact && (
          <span className="ml-auto text-[10px] uppercase tracking-[0.12em] text-white/55 whitespace-nowrap">2-MIN BARS · 503 SYMBOLS</span>
        )}
        {compact && (
          <span className="ml-auto text-[10px] uppercase tracking-[0.12em] text-white/55 whitespace-nowrap">503 SYMBOLS</span>
        )}
      </div>
      <div className={`p-${compact ? 3 : 4} font-mono ${compact ? 'text-[10.5px]' : 'text-[11.5px]'} leading-[1.6] tabular-nums`}>
        {lines.slice(0, visible).map((l, i) => (
          <div key={i} className="flex gap-2 items-baseline">
            <span className="text-white/45 shrink-0">{compact ? l.tShort : l.t}</span>
            <span className="text-[oklch(0.82_0.16_75/0.5)] shrink-0">│</span>
            {l.kind === 'eval' ? (
              <span className="flex gap-1.5 items-baseline flex-wrap min-w-0">
                <span className="text-white/55 uppercase shrink-0">EVAL</span>
                <span className="text-[oklch(0.86_0.14_75)] shrink-0">{l.sym}</span>
                <span className="text-white/45 shrink-0">→</span>
                <span style={{ color: tones[l.tone] }} className="shrink-0 whitespace-nowrap">{l.state}</span>
                {!compact && <span className="text-white/45 shrink-0">·</span>}
                <span className="text-white shrink-0 whitespace-nowrap">{compact ? l.score : `SCORE ${l.score}`}</span>
                {l.fire
                  ? <span className="text-[9px] uppercase tracking-[0.14em] px-1 py-px rounded-sm bg-[oklch(0.78_0.16_150/0.18)] text-[oklch(0.78_0.16_150)] border border-[oklch(0.78_0.16_150/0.5)] shrink-0">PASS</span>
                  : <span className="text-[9px] uppercase tracking-[0.14em] px-1 py-px rounded-sm text-white/45 border border-white/15 shrink-0">WATCH</span>
                }
              </span>
            ) : l.kind === 'alert' ? (
              <span className="flex gap-1.5 items-baseline min-w-0">
                <span className="text-[oklch(0.82_0.16_75)] uppercase shrink-0">ALERT</span>
                <span style={{ color: tones[l.tone] }} className="min-w-0">{l.text}</span>
                <W7FX_Icons.Bell size={10} className="text-[oklch(0.78_0.16_150)] shrink-0" />
              </span>
            ) : (
              <span className="flex gap-1.5 min-w-0">
                <span className="text-white/55 uppercase shrink-0">SYS </span>
                <span style={{ color: tones[l.tone] }} className="min-w-0">{l.text}</span>
              </span>
            )}
          </div>
        ))}
        {visible < lines.length && (
          <div className="flex gap-2 mt-1">
            <span className="text-[oklch(0.82_0.16_75)] animate-pulse">▌</span>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── animated count-up ─────────────────────────────────────────────────────
function useCountUp(target, duration = 1400, decimals = 0) {
  const [v, setV] = React.useState(0);
  React.useEffect(() => {
    const start = performance.now();
    let raf;
    const step = (now) => {
      const t = Math.min(1, (now - start) / duration);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - t, 3);
      setV(target * eased);
      if (t < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return v.toFixed(decimals);
}

function BigStat({ label, target, suffix = '', decimals = 0, hint, tone = '#fff' }) {
  const v = useCountUp(target, 1600, decimals);
  return (
    <div className="flex flex-col gap-1.5 p-5 border border-white/12 rounded-sm bg-[#0B0B0B]">
      <span className="text-[9.5px] uppercase tracking-[0.18em] text-[oklch(0.78_0.12_200)]">{label}</span>
      <span className="font-mono tabular-nums text-[36px] leading-none" style={{ color: tone }}>
        {Number(v).toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}{suffix}
      </span>
      <span className="text-[10px] uppercase tracking-[0.1em] text-white/55">{hint}</span>
    </div>
  );
}

function BigStats({ compact }) {
  return (
    <section className={`${compact ? 'px-4 py-10' : 'px-8 py-16'}`}>
      <div className="max-w-[1180px] mx-auto">
        <div className="text-center mb-8">
          <span className="text-[10px] uppercase tracking-[0.22em] text-[oklch(0.82_0.16_75)]">OPERATIONS · 2026 YTD</span>
        </div>
        <div className={`grid ${compact ? 'grid-cols-2 gap-3' : 'grid-cols-4 gap-4'}`}>
          <BigStat label="CANDIDATES FLAGGED" target={47840} hint="ACROSS 92 MARKET MORNINGS"   tone="#fff" />
          <BigStat label="A+ SETUPS"          target={1230}  hint="SCORE ≥ 90 · TIGHT CLUSTER"  tone="oklch(0.78 0.16 150)" />
          <BigStat label="ALERTS DELIVERED"   target={29104} hint="EMAIL + WEB PUSH"             tone="oklch(0.82 0.16 75)" />
          <BigStat label="SCAN UPTIME"        target={99.4}  suffix="%" decimals={1} hint="LAST 12 MONTHS" tone="oklch(0.78 0.12 200)" />
        </div>
      </div>
    </section>
  );
}

// ─── method viz — animated SMA cluster forming ─────────────────────────────
function MethodViz({ compact }) {
  // Pre-generated paths, animated with CSS keyframes that interpolate between "wide" and "tight"
  // Geometry uses two states; we render both as SVG paths and morph the d attribute via opacity blend.
  const W = compact ? 340 : 720;
  const H = compact ? 180 : 240;
  // helpers — y values; smaller = higher
  const cy = H / 2;
  const wide  = { fast: cy - 38, slow: cy + 30 };
  const tight = { fast: cy - 4,  slow: cy + 4  };
  // points for SMA fast (gentle wave)
  function smoothPath(yOffsetTarget, amp, freq, phase = 0) {
    const pts = [];
    const N = 32;
    for (let i = 0; i <= N; i++) {
      const x = (i / N) * W;
      const y = cy + yOffsetTarget + Math.sin((i / N) * Math.PI * freq + phase) * amp;
      pts.push(`${i === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`);
    }
    return pts.join(' ');
  }
  // We'll show the converged "tight" state — animation handled in CSS via a class on the wrapper.
  return (
    <section className={`${compact ? 'px-4 py-10' : 'px-8 py-16'} border-y border-white/12 bg-[#050505]`}>
      <div className="max-w-[1180px] mx-auto">
        <div className={`grid ${compact ? 'grid-cols-1 gap-6' : 'grid-cols-[1fr_1fr] gap-12'} items-center`}>
          <div className="flex flex-col gap-3">
            <span className="text-[10px] uppercase tracking-[0.22em] text-[oklch(0.82_0.16_75)]">METHOD</span>
            <h2 className={`uppercase tracking-tight text-white ${compact ? 'text-[28px]' : 'text-[40px]'} leading-[1.05]`}>WHAT A &ldquo;TIGHT POWER-ZONE&rdquo; LOOKS LIKE.</h2>
            <p className="text-[13px] text-white/75 leading-relaxed max-w-[58ch]">
              We watch the 20-period and 200-period SMAs on 2-minute bars. When they compress into a narrow ATR-normalized band — and price sits inside the prior 45-minute cluster — we flag the setup.
            </p>
            <ul className="flex flex-col gap-2 mt-3 text-[11.5px] uppercase tracking-[0.06em] text-white/80">
              <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-[oklch(0.74_0.17_250)]" /> SMA20 / SMA200 distance &lt; 0.5 ATR → NARROW</li>
              <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-[oklch(0.80_0.16_72)]" /> Sharp pullback into the cluster → WIDE SNAPBACK</li>
              <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-[oklch(0.78_0.16_150)]" /> Slope &gt; 0 with price hugging fast MA → TRENDING</li>
            </ul>
          </div>

          {/* SVG viz */}
          <div className="relative border border-white/15 rounded-sm bg-black p-4 overflow-hidden">
            <div className="flex items-center justify-between mb-3 text-[10px] uppercase tracking-[0.14em] text-white/55">
              <span>NVDA · 2M BARS</span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[oklch(0.74_0.17_250)]" /> SMA20
                <span className="ml-2 h-1.5 w-1.5 rounded-full bg-[oklch(0.82_0.16_75)]" /> SMA200
              </span>
            </div>
            <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} className="w-full h-auto">
              {/* horizontal grid */}
              {[0.2, 0.4, 0.6, 0.8].map((p, i) => (
                <line key={i} x1="0" x2={W} y1={H * p} y2={H * p} stroke="rgba(255,255,255,0.05)" />
              ))}
              {/* cluster band — appears at the end */}
              <rect x="0" y={cy - 14} width={W} height="28" fill="oklch(0.82 0.16 75 / 0.10)" stroke="oklch(0.82 0.16 75 / 0.30)" strokeDasharray="3 3" style={{ animation: 'ms-cluster 6s ease-in-out infinite' }} />

              {/* SMA fast (wide → tight) */}
              <path
                d={smoothPath(-30, 6, 6)}
                fill="none"
                stroke="oklch(0.74 0.17 250)"
                strokeWidth="1.8"
                style={{ animation: 'ms-fast 6s ease-in-out infinite' }}
              />
              {/* SMA slow (wide → tight, shifted) */}
              <path
                d={smoothPath(28, 4, 4, 1.2)}
                fill="none"
                stroke="oklch(0.82 0.16 75)"
                strokeWidth="1.8"
                style={{ animation: 'ms-slow 6s ease-in-out infinite' }}
              />
              {/* current-price marker */}
              <circle cx={W - 26} cy={cy} r="5" fill="oklch(0.82 0.16 75)" style={{ animation: 'ms-pulse 1.4s ease-in-out infinite' }} />
              <line x1={W - 26} x2={W - 26} y1={cy - 16} y2={cy + 16} stroke="oklch(0.82 0.16 75)" strokeWidth="1" opacity="0.5" />
              {/* "INSIDE" label */}
              <text x={W - 70} y={cy - 22} fill="oklch(0.82 0.16 75)" fontSize="10" fontFamily="IBM Plex Mono" letterSpacing="1.5">INSIDE</text>
            </svg>
            <div className="mt-3 flex items-center justify-between text-[9.5px] uppercase tracking-[0.14em] text-white/55">
              <span>T-0:90 · WIDE</span>
              <span className="text-[oklch(0.82_0.16_75)]">→</span>
              <span className="text-white">T-0 · CLUSTER FORMED · NARROW</span>
            </div>
            <style>{`
              @keyframes ms-fast    { 0%,15%{transform:translateY(0)} 60%,100%{transform:translateY(38px)} }
              @keyframes ms-slow    { 0%,15%{transform:translateY(0)} 60%,100%{transform:translateY(-26px)} }
              @keyframes ms-cluster { 0%,30%{opacity:0} 60%,100%{opacity:1} }
              @keyframes ms-pulse   { 0%,100%{r:5; opacity:1} 50%{r:8; opacity:0.6} }
            `}</style>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── interactive "try a rule" sandbox ──────────────────────────────────────
function RuleSandbox({ compact }) {
  const { SCAN_RESULTS, STATES, STATE_FILTERS, ZONES } = window.MS_DATA;
  const [states, setStates] = React.useState(['narrow', 'wide_snapback']);
  const [zones, setZones]   = React.useState(['Inside']);
  const [score, setScore]   = React.useState(85);

  const toggle = (set, val) => set.includes(val) ? set.filter((x) => x !== val) : [...set, val];
  const matches = SCAN_RESULTS.filter((r) =>
    states.includes(r.state) && zones.includes(r.zone) && r.score >= score
  );

  return (
    <section className={`${compact ? 'px-4 py-10' : 'px-8 py-16'}`}>
      <div className="max-w-[1180px] mx-auto">
        <div className={`flex ${compact ? 'flex-col' : 'items-end justify-between'} gap-3 mb-7`}>
          <div>
            <span className="text-[10px] uppercase tracking-[0.22em] text-[oklch(0.82_0.16_75)]">TRY IT · LIVE DATA</span>
            <h2 className={`uppercase tracking-tight text-white mt-3 ${compact ? 'text-[26px]' : 'text-[40px]'} leading-[1.05]`}>BUILD A RULE. SEE IT MATCH.</h2>
          </div>
          <p className="text-[13px] text-white/75 leading-relaxed max-w-[44ch]">Toggle states, zones, and the score threshold. Numbers below recompute against today&apos;s 09:15 NY scan in real time.</p>
        </div>

        <div className={`grid ${compact ? 'grid-cols-1 gap-4' : 'grid-cols-[1.4fr_1fr] gap-6'}`}>
          {/* LEFT — controls */}
          <div className="border border-white/15 rounded-sm bg-[#0B0B0B] p-5 flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <span className="text-[10.5px] uppercase tracking-[0.12em] text-[oklch(0.78_0.12_200)]">STATES <span className="text-white/45">· {states.length} SELECTED</span></span>
              <div className="flex flex-wrap gap-1.5">
                {STATE_FILTERS.filter((s) => s.id !== 'all').map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setStates(toggle(states, s.id))}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-[11px] border transition-colors uppercase tracking-[0.04em] whitespace-nowrap ${
                      states.includes(s.id)
                        ? 'border-[oklch(0.82_0.16_75/0.55)] bg-[oklch(0.82_0.16_75/0.10)] text-white'
                        : 'border-white/18 text-white/70 hover:border-white/30'
                    }`}
                  >
                    <span className="h-1.5 w-1.5 rounded-full" style={{ background: STATES[s.id].tone }} />
                    {STATES[s.id].label}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-[10.5px] uppercase tracking-[0.12em] text-[oklch(0.78_0.12_200)]">PRIOR45 ZONES <span className="text-white/45">· {zones.length} SELECTED</span></span>
              <div className="flex flex-wrap gap-1.5">
                {ZONES.map((z) => (
                  <button
                    key={z}
                    onClick={() => setZones(toggle(zones, z))}
                    className={`px-2.5 py-1 rounded-sm text-[11px] border transition-colors uppercase tracking-[0.04em] whitespace-nowrap ${
                      zones.includes(z)
                        ? 'border-[oklch(0.82_0.16_75/0.55)] bg-[oklch(0.82_0.16_75/0.10)] text-white'
                        : 'border-white/18 text-white/70 hover:border-white/30'
                    }`}
                  >{z}</button>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-baseline justify-between">
                <span className="text-[10.5px] uppercase tracking-[0.12em] text-[oklch(0.78_0.12_200)]">MIN SCORE</span>
                <span className="font-mono tabular-nums text-[18px] text-white">{score}<span className="text-white/45 text-[12px]">/100</span></span>
              </div>
              <div className="relative h-6">
                <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[3px] bg-white/10 rounded-sm" />
                <div className="absolute left-0 top-1/2 -translate-y-1/2 h-[3px] rounded-sm" style={{ width: `${score}%`, background: 'oklch(0.82 0.16 75)' }} />
                <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-3.5 w-2 bg-[oklch(0.82_0.16_75)] rounded-sm shadow-[0_0_8px_oklch(0.82_0.16_75)]" style={{ left: `${score}%` }} />
                <input type="range" min="0" max="100" value={score} onChange={(e) => setScore(+e.target.value)} className="absolute inset-0 w-full opacity-0 cursor-pointer" aria-label="Minimum score" />
              </div>
            </div>
          </div>

          {/* RIGHT — live result */}
          <div className="border border-[oklch(0.82_0.16_75/0.4)] rounded-sm bg-[#0B0B0B] p-5 flex flex-col gap-4">
            <div>
              <span className="text-[10.5px] uppercase tracking-[0.12em] text-[oklch(0.82_0.16_75)]">WOULD FIRE TODAY</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="font-mono tabular-nums text-[52px] leading-none text-white">{String(matches.length).padStart(2, '0')}</span>
                <span className="text-[12px] uppercase tracking-[0.12em] text-white/55">of {SCAN_RESULTS.length} candidates</span>
              </div>
            </div>
            <div className="h-px bg-white/15" />
            <div className="flex flex-col gap-1.5 min-h-[120px]">
              <span className="text-[10px] uppercase tracking-[0.14em] text-white/55 mb-1">MATCHING SYMBOLS</span>
              {matches.length === 0 ? (
                <span className="text-[12px] text-white/55">No matches with this rule today. Try lowering the score or adding more states.</span>
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {matches.slice(0, 12).map((m) => (
                    <span key={m.symbol} className="inline-flex items-center gap-1.5 px-2 py-1 rounded-sm border border-white/15 bg-black text-[11px]">
                      <span className="h-1.5 w-1.5 rounded-full" style={{ background: STATES[m.state].tone }} />
                      <span className="text-[oklch(0.86_0.14_75)]">{m.symbol}</span>
                      <span className="text-white tabular-nums text-[10.5px]">{m.score}</span>
                    </span>
                  ))}
                </div>
              )}
            </div>
            <button className="mt-auto w-full inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-sm border border-[oklch(0.82_0.16_75/0.6)] bg-[oklch(0.82_0.16_75/0.18)] text-[oklch(0.82_0.16_75)] text-[11.5px] uppercase tracking-[0.14em] hover:bg-[oklch(0.82_0.16_75/0.28)]">
              SUBSCRIBE TO SAVE THIS RULE <W7FX_Icons.ArrowUpRight size={12} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { TickerTape, HeroScanner, BigStats, MethodViz, RuleSandbox });
