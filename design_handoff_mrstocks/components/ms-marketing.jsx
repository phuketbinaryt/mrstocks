// Screen 7 — Marketing landing (/)
// Single long page. Same terminal aesthetic; more whitespace + larger type than the app screens.

const W7_Icons = window.MS_Icons;

// ─── top nav ───────────────────────────────────────────────────────────────
function MarketingNav({ compact }) {
  return (
    <header className={`flex items-center gap-3 ${compact ? 'px-4 h-12' : 'px-8 h-14'} border-b border-white/12`}>
      <div className="flex items-center gap-2 shrink-0">
        <W7_Icons.Logo size={compact ? 16 : 18} />
        <span className="text-[12px] tracking-[0.22em] uppercase text-[oklch(0.82_0.16_75)] font-medium">MR/STOCKS</span>
      </div>
      {!compact && (
        <nav className="ml-8 flex items-center gap-6 text-[11.5px] uppercase tracking-[0.12em] text-white/75">
          <a className="hover:text-white cursor-pointer">METHOD</a>
          <a className="hover:text-white cursor-pointer">PRICING</a>
          <a className="hover:text-white cursor-pointer">CHANGELOG</a>
          <a className="hover:text-white cursor-pointer">FAQ</a>
        </nav>
      )}
      <div className="flex-1" />
      {!compact && (
        <span className="hidden md:inline-flex items-center gap-1.5 px-2 py-0.5 border border-[oklch(0.78_0.16_150/0.55)] bg-[oklch(0.78_0.16_150/0.10)] rounded-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-[oklch(0.78_0.16_150)] shadow-[0_0_8px_oklch(0.78_0.16_150)]" />
          <span className="text-[10.5px] text-[oklch(0.78_0.16_150)] tracking-[0.1em] uppercase">LIVE</span>
          <span className="text-[10.5px] text-white/65 uppercase tracking-[0.08em]">SCAN 09:15 NY</span>
        </span>
      )}
      {!compact && <a className="text-[11px] uppercase tracking-[0.1em] text-white/75 hover:text-white cursor-pointer">SIGN IN</a>}
      <a className={`inline-flex items-center gap-1.5 ${compact ? 'px-2.5 py-1' : 'px-3 py-1.5'} rounded-sm border border-[oklch(0.82_0.16_75/0.55)] bg-[oklch(0.82_0.16_75/0.14)] text-[oklch(0.82_0.16_75)] text-[11px] uppercase tracking-[0.12em] hover:bg-[oklch(0.82_0.16_75/0.22)] cursor-pointer whitespace-nowrap`}>
        SUBSCRIBE
      </a>
      {compact && (
        <button aria-label="Menu" className="p-1.5 rounded-sm text-white/75 hover:text-white border border-white/15 ml-1">
          <W7_Icons.Menu size={14} />
        </button>
      )}
    </header>
  );
}

// ─── hero ──────────────────────────────────────────────────────────────────
function Hero({ compact }) {
  return (
    <section className={`${compact ? 'px-4 pt-8 pb-8' : 'px-8 pt-16 pb-12'} relative overflow-hidden`}>
      {/* faint grid background */}
      <div
        className="absolute inset-0 opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
          backgroundSize: compact ? '24px 24px' : '40px 40px',
        }}
      />
      {/* amber glow */}
      <div className="absolute -top-40 left-1/4 h-[460px] w-[700px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, oklch(0.82 0.16 75 / 0.18) 0%, transparent 60%)' }} />

      <div className={`relative max-w-[1240px] mx-auto grid ${compact ? 'grid-cols-1 gap-8' : 'grid-cols-[1.05fr_1fr] gap-12'} items-center`}>
        {/* LEFT — copy + CTAs */}
        <div className="flex flex-col">
          <span className="inline-flex self-start items-center gap-2 px-3 py-1 rounded-sm border border-white/15 bg-[#0B0B0B] mb-6">
            <span className="h-1.5 w-1.5 rounded-full bg-[oklch(0.82_0.16_75)] shadow-[0_0_6px_oklch(0.82_0.16_75)]" />
            <span className="text-[10.5px] uppercase tracking-[0.18em] text-[oklch(0.82_0.16_75)]">OPENING SCANNER · v2.4</span>
          </span>
          <h1 className={`uppercase tracking-[-0.01em] leading-[0.94] ${compact ? 'text-[42px]' : 'text-[68px]'} text-white`}>
            PRE-MARKET <br/>
            <span className="text-[oklch(0.82_0.16_75)]">SIGNALS.</span><br/>
            EVERY MARKET <br/>
            MORNING.{' '}<span className="text-white/50">BEFORE YOU LOG IN.</span>
          </h1>
          <p className={`mt-6 text-white/75 leading-relaxed ${compact ? 'text-[14px]' : 'text-[16px]'} max-w-[54ch]`}>
            We scan ~500 US large-caps every market morning at <span className="text-[oklch(0.82_0.16_75)]">09:15&nbsp;NY</span>, surface the tight SMA20 × SMA200 setups, and push them to you before the open. No charts. No noise. Just the candidates.
          </p>
          <div className="mt-7 flex items-center gap-3 flex-wrap">
            <a className="inline-flex items-center gap-2 px-4 py-2.5 rounded-sm border border-[oklch(0.82_0.16_75/0.6)] bg-[oklch(0.82_0.16_75/0.18)] text-[oklch(0.82_0.16_75)] text-[12px] uppercase tracking-[0.14em] hover:bg-[oklch(0.82_0.16_75/0.28)] cursor-pointer">
              SUBSCRIBE · $29/MO <W7_Icons.ArrowUpRight size={12} />
            </a>
            <a className="inline-flex items-center gap-2 px-4 py-2.5 rounded-sm border border-white/22 bg-[#0B0B0B] text-white text-[12px] uppercase tracking-[0.14em] hover:border-white/35 cursor-pointer">
              SEE TODAY&apos;S SCAN
            </a>
          </div>
          <div className="mt-6 flex items-center gap-3 text-[10.5px] uppercase tracking-[0.12em] text-white/55">
            <span><span className="text-white tabular-nums">2,140</span> MEMBERS</span>
            <span className="text-[oklch(0.82_0.16_75/0.5)]">·</span>
            <span>CANCEL ANYTIME</span>
            <span className="text-[oklch(0.82_0.16_75/0.5)]">·</span>
            <span>BILLED VIA WHOP</span>
          </div>
        </div>

        {/* RIGHT — animated scanner */}
        <div className={compact ? 'h-[340px]' : 'h-[440px]'}>
          <HeroScanner compact={compact} />
        </div>
      </div>
    </section>
  );
}

// ─── dashboard preview ─────────────────────────────────────────────────────
function ProductPreview({ compact }) {
  return (
    <section className={`${compact ? 'px-3 pb-10' : 'px-8 pb-16'}`}>
      <div className="max-w-[1180px] mx-auto">
        <div className="relative">
          {/* glow under */}
          <div className="absolute -inset-8 rounded-sm pointer-events-none" style={{ background: 'radial-gradient(ellipse at center, oklch(0.82 0.16 75 / 0.08), transparent 70%)' }} />
          {/* browser chrome */}
          <div className="relative border border-white/18 rounded-sm bg-[#0B0B0B] overflow-hidden">
            <div className="flex items-center gap-2 h-7 px-3 border-b border-white/12 bg-[#080808]">
              <span className="h-2 w-2 rounded-full bg-white/15" />
              <span className="h-2 w-2 rounded-full bg-white/15" />
              <span className="h-2 w-2 rounded-full bg-white/15" />
              <span className="ml-3 text-[10px] uppercase tracking-[0.12em] text-white/45 truncate">mrstocks.app/dashboard</span>
            </div>
            <div className="relative" style={{ height: compact ? 520 : 640 }}>
              <Dashboard variant="default" layout={compact ? 'mobile' : 'desktop'} />
            </div>
          </div>
        </div>
        <p className={`text-center mt-5 text-[10.5px] uppercase tracking-[0.14em] text-white/55 ${compact ? '' : ''}`}>
          THE DASHBOARD · 09:15 NY · 12 CANDIDATES SHOWN
        </p>
      </div>
    </section>
  );
}

// ─── feature row ───────────────────────────────────────────────────────────
function Features({ compact }) {
  const features = [
    {
      n: '01',
      title: 'DAILY SCAN',
      body: '~500 US large-caps evaluated every market morning at 09:15 NY. Tight power-zone setups are ranked and tagged with a state and a Prior45 position.',
      stat: '500',
      statLbl: 'SYMBOLS · 2-MIN BARS',
      tone: 'oklch(0.82 0.16 75)',
    },
    {
      n: '02',
      title: 'YOUR WATCHLIST',
      body: 'Filter to the names you actually trade. Set one as default and the dashboard opens to your shortlist every morning.',
      stat: '∞',
      statLbl: 'WATCHLISTS · NO LIMIT',
      tone: 'oklch(0.78 0.12 200)',
    },
    {
      n: '03',
      title: 'A+ ALERTS',
      body: 'Web push + email when a rule matches. Threshold, states, zones, and watchlist are all yours. We never email you junk.',
      stat: 'PUSH',
      statLbl: '+ EMAIL · INSTANT',
      tone: 'oklch(0.78 0.16 150)',
    },
  ];
  return (
    <section className={`${compact ? 'px-4 py-10' : 'px-8 py-16'} border-y border-white/12`}>
      <div className="max-w-[1180px] mx-auto">
        <div className={`grid ${compact ? 'grid-cols-1 gap-4' : 'grid-cols-3 gap-5'}`}>
          {features.map((f) => (
            <article key={f.n} className="border border-white/15 rounded-sm bg-[#0B0B0B] p-5 flex flex-col gap-4 hover:border-white/25 transition-colors">
              <div className="flex items-baseline justify-between">
                <span className="text-[9.5px] uppercase tracking-[0.18em]" style={{ color: f.tone }}>{f.n}</span>
                <span className="font-mono tabular-nums text-[28px] leading-none" style={{ color: f.tone }}>{f.stat}</span>
              </div>
              <h3 className="text-[16px] uppercase tracking-[0.06em] text-white font-medium">{f.title}</h3>
              <p className="text-[13px] text-white/75 leading-relaxed">{f.body}</p>
              <div className="mt-auto text-[9.5px] uppercase tracking-[0.14em] text-white/45">{f.statLbl}</div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── how it works ──────────────────────────────────────────────────────────
function HowItWorks({ compact }) {
  const steps = [
    { t: '09:15 NY', body: 'Scanner runs against the day&apos;s pre-market data. 2-minute bars, SMA20 × SMA200 across the eligible universe.' },
    { t: '09:15:04',  body: '~50 candidates emerge with a state (NARROW, WIDE SNAPBACK, TRENDING…) and a Prior45 zone position.' },
    { t: '09:15:05',  body: 'Rules fire. We push and email the hits. You open the dashboard and act on the signals manually.' },
  ];
  return (
    <section className={`${compact ? 'px-4 py-10' : 'px-8 py-16'}`}>
      <div className="max-w-[1180px] mx-auto">
        <div className="text-center mb-10">
          <span className="text-[10px] uppercase tracking-[0.22em] text-[oklch(0.82_0.16_75)]">METHOD</span>
          <h2 className={`uppercase tracking-tight text-white mt-3 ${compact ? 'text-[28px]' : 'text-[44px]'}`}>FROM SCAN TO SIGNAL · 5 SECONDS</h2>
        </div>
        <div className={`grid ${compact ? 'grid-cols-1 gap-3' : 'grid-cols-3 gap-4'} relative`}>
          {!compact && <div className="absolute top-[26px] left-[12%] right-[12%] h-px bg-gradient-to-r from-transparent via-[oklch(0.82_0.16_75/0.6)] to-transparent" />}
          {steps.map((s, i) => (
            <div key={s.t} className="relative flex flex-col items-start gap-3 p-5 border border-white/15 rounded-sm bg-[#0B0B0B]">
              <span className="font-mono tabular-nums text-[20px] text-[oklch(0.82_0.16_75)] leading-none">{s.t}</span>
              <span className="text-[9.5px] uppercase tracking-[0.18em] text-white/55">STEP {String(i + 1).padStart(2, '0')}</span>
              <p className="text-[13px] text-white/80 leading-relaxed" dangerouslySetInnerHTML={{ __html: s.body }} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── pricing ───────────────────────────────────────────────────────────────
function Pricing({ compact }) {
  const features = [
    'All US large-cap candidates · daily',
    'Unlimited watchlists',
    'Unlimited alert rules · email + web push',
    'Historical scans · last 90 days',
    'Pre-market data — never delayed',
    'Cancel anytime · billed via Whop',
  ];
  return (
    <section id="pricing" className={`${compact ? 'px-4 py-10' : 'px-8 py-16'} border-y border-white/12 bg-[#050505]`}>
      <div className="max-w-[640px] mx-auto text-center">
        <span className="text-[10px] uppercase tracking-[0.22em] text-[oklch(0.82_0.16_75)]">PRICING</span>
        <h2 className={`uppercase tracking-tight text-white mt-3 ${compact ? 'text-[28px]' : 'text-[40px]'}`}>ONE PLAN. ONE PRICE.</h2>
      </div>
      <div className="max-w-[480px] mx-auto mt-8 border border-[oklch(0.82_0.16_75/0.4)] rounded-sm bg-[#0B0B0B] p-7" style={{ boxShadow: '0 0 60px oklch(0.82 0.16 75 / 0.1)' }}>
        <div className="flex items-baseline justify-between mb-1">
          <span className="text-[11px] uppercase tracking-[0.18em] text-[oklch(0.82_0.16_75)]">MEMBER</span>
          <span className="font-mono tabular-nums text-[42px] text-white leading-none">$29<span className="text-white/55 text-[18px]">/MO</span></span>
        </div>
        <p className="text-[11.5px] uppercase tracking-[0.08em] text-white/55">FULL ACCESS · NO TIERS · NO ADD-ONS</p>
        <div className="h-px bg-white/12 my-5" />
        <ul className="flex flex-col gap-2.5">
          {features.map((f) => (
            <li key={f} className="flex items-start gap-2.5 text-[13px] text-white/85">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[oklch(0.78_0.16_150)] shadow-[0_0_4px_oklch(0.78_0.16_150)] shrink-0" />
              {f}
            </li>
          ))}
        </ul>
        <button className="mt-6 w-full inline-flex items-center justify-center gap-2 px-3.5 py-3 rounded-sm border border-[oklch(0.82_0.16_75/0.6)] bg-[oklch(0.82_0.16_75/0.20)] text-[oklch(0.82_0.16_75)] text-[13px] uppercase tracking-[0.14em] hover:bg-[oklch(0.82_0.16_75/0.30)]">
          SUBSCRIBE VIA WHOP <W7_Icons.ArrowUpRight size={13} />
        </button>
        <p className="text-center mt-3 text-[10px] uppercase tracking-[0.12em] text-white/45">SECURE CHECKOUT · CARDS · APPLE PAY · CRYPTO</p>
      </div>
    </section>
  );
}

// ─── FAQ ───────────────────────────────────────────────────────────────────
function FAQ({ compact }) {
  const items = [
    { q: 'WHAT IS A "TIGHT POWER-ZONE" SETUP?', a: 'A configuration where the 20-period and 200-period SMAs on 2-minute bars are within a small ATR-normalized distance. Tightness is graded into states (NARROW, WIDE SNAPBACK, TRENDING, etc.).' },
    { q: 'DO YOU OFFER A FREE TRIAL?',          a: 'Not currently. We bill via Whop with monthly cancellation — your second month is paid only if you keep it after seeing a full week of scans.' },
    { q: 'WHICH SYMBOLS ARE SCANNED?',          a: 'Around 500 US large-caps with sufficient pre-market liquidity. The eligible universe is fixed and rebalanced quarterly.' },
    { q: 'IS THIS FINANCIAL ADVICE?',           a: 'No. We surface candidates. You decide whether to trade them. Past performance is not indicative of future results.' },
  ];
  return (
    <section className={`${compact ? 'px-4 py-10' : 'px-8 py-16'}`}>
      <div className="max-w-[760px] mx-auto">
        <div className="mb-8">
          <span className="text-[10px] uppercase tracking-[0.22em] text-[oklch(0.82_0.16_75)]">FAQ</span>
          <h2 className={`uppercase tracking-tight text-white mt-3 ${compact ? 'text-[24px]' : 'text-[32px]'}`}>QUESTIONS, BEFORE YOU SUBSCRIBE</h2>
        </div>
        <div className="border border-white/12 rounded-sm bg-[#0B0B0B] divide-y divide-white/10">
          {items.map((it) => (
            <details key={it.q} className="group">
              <summary className="cursor-pointer list-none px-4 py-3.5 flex items-center justify-between gap-3 hover:bg-white/4">
                <span className="text-[12px] uppercase tracking-[0.06em] text-white">{it.q}</span>
                <span className="text-[oklch(0.82_0.16_75)] group-open:rotate-180 transition-transform"><W7_Icons.ChevronDown size={14} /></span>
              </summary>
              <div className="px-4 pb-4 text-[13px] text-white/75 leading-relaxed">{it.a}</div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── footer ────────────────────────────────────────────────────────────────
function Footer({ compact }) {
  const cols = [
    { h: 'PRODUCT',  items: ['Method', 'Pricing', 'Changelog', 'Status'] },
    { h: 'COMPANY',  items: ['About', 'Contact', 'Press'] },
    { h: 'EDUCATION',items: ['What is SMA20/200?', 'Prior45 zones', 'Trader\u2019s guide'] },
    { h: 'LEGAL',    items: ['Terms', 'Privacy', 'Disclaimer', 'Refunds'] },
  ];
  return (
    <footer className={`${compact ? 'px-4 py-10' : 'px-8 py-14'} bg-black border-t border-white/12`}>
      <div className="max-w-[1180px] mx-auto">
        <div className={`grid ${compact ? 'grid-cols-2 gap-6' : 'grid-cols-[1.4fr_repeat(4,1fr)] gap-8'} mb-10`}>
          <div className="col-span-2 md:col-span-1 flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <W7_Icons.Logo size={18} />
              <span className="text-[12px] tracking-[0.22em] uppercase text-[oklch(0.82_0.16_75)] font-medium">MR/STOCKS</span>
            </div>
            <p className="text-[11.5px] text-white/55 leading-relaxed max-w-[34ch]">Pre-market signals for traders who would rather wait for a clean setup than chase noise.</p>
          </div>
          {cols.map((c) => (
            <div key={c.h} className="flex flex-col gap-2.5">
              <span className="text-[9.5px] uppercase tracking-[0.18em] text-[oklch(0.82_0.16_75)]">{c.h}</span>
              <ul className="flex flex-col gap-1.5">
                {c.items.map((it) => <li key={it}><a className="text-[11.5px] uppercase tracking-[0.06em] text-white/70 hover:text-white cursor-pointer">{it}</a></li>)}
              </ul>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between gap-3 pt-5 border-t border-white/10 text-[10px] uppercase tracking-[0.14em] text-white/45 flex-wrap">
          <span>© 2026 MR/STOCKS LLC · ALL RIGHTS RESERVED</span>
          <span>NOT FINANCIAL ADVICE · MEMBER USE ONLY</span>
        </div>
      </div>
    </footer>
  );
}

// ─── page ──────────────────────────────────────────────────────────────────
function MarketingPage({ layout = 'desktop' }) {
  const compact = layout === 'mobile';
  return (
    <div className="h-full w-full bg-black text-white overflow-y-auto no-scrollbar">
      <MarketingNav compact={compact} />
      <TickerTape />
      <Hero compact={compact} />
      <BigStats compact={compact} />
      <MethodViz compact={compact} />
      <ProductPreview compact={compact} />
      <RuleSandbox compact={compact} />
      <Features compact={compact} />
      <Pricing compact={compact} />
      <FAQ compact={compact} />
      <Footer compact={compact} />
    </div>
  );
}

Object.assign(window, { MarketingPage });
