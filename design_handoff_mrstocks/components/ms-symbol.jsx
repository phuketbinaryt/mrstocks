// Screen 2 — Symbol detail (/dashboard/[symbol])
// Props: { row: ScanResult & detail, variant?: 'default'|'loading'|'notfound', layout: 'mobile'|'desktop' }

const { STATES: S2_STATES, ZONES: S2_ZONES } = window.MS_DATA;
const S2_Icons = window.MS_Icons;

// ─── enrich a scan row with detail data for the deep-dive view ────────────
function enrichRow(r) {
  if (!r) return null;
  // Make cluster bounds correspond loosely to ATR/MA distance fields.
  const clusterMid  = r.price - (r.maDistAtr * r.atr * Math.sign(r.gap || 1));
  const clusterLow  = clusterMid - r.atr * 0.45;
  const clusterHigh = clusterMid + r.atr * 0.45;
  return {
    ...r,
    smaFast: clusterMid + r.atr * 0.10,
    smaSlow: clusterMid - r.atr * 0.05,
    slopeSlow: +(r.slopeFast * 0.62).toFixed(2),
    avgVolUsd: r.volUsd,
    clusterLow, clusterMid, clusterHigh,
    bucketIdx: { 'Lower #3': 0, 'Lower #2': 1, 'Lower #1': 2, 'Inside': 3, 'Upper #1': 4, 'Upper #2': 5, 'Upper #3': 6 }[r.zone] ?? 3,
    distanceToCluster: +(Math.abs(r.price - clusterMid)).toFixed(2),
    notes: {
      NVDA: 'Coiled inside prior 45-min cluster after 3 sessions of compression. SMA20/200 within 0.31 ATR — tightest reading in 6 weeks.',
      AAPL: 'SMA20 holding above SMA200 by 0.06%. Tight power-zone setup; long bias if opening prints above 230.10 cluster high.',
      MSFT: 'Trending day with SMA20 acting as dynamic support, slope +2.04. Watch for pullback retest of fast MA near 410.80.',
      META: 'Wide range — snapback candidate. Price extended above prior cluster by 1.18 ATR. Short bias on rejection.',
      TSLA: 'Lower bucket — gap-down opening below prior45 cluster. Watch for failed retest of cluster low at 247.40.',
    }[r.symbol] || 'No additional scanner notes for this candidate.',
  };
}

// ─── Prior45 zone band ─────────────────────────────────────────────────────
// Visual: 7 stacked buckets (Lower #3..Inside..Upper #3) with cluster low/mid/high marks
// and a current-price marker. The Inside bucket gets a soft fill.
function ZoneBand({ row }) {
  const buckets = ['Lower #3','Lower #2','Lower #1','Inside','Upper #1','Upper #2','Upper #3'];
  const stateTone = S2_STATES[row.state].tone;
  // Project price → 0..1 across the band: cluster occupies the middle three slots (idx 2..5).
  // Each bucket = 1/7. We assume ±1 ATR maps roughly to one bucket outside.
  const insideStart = 3 / 7;
  const insideEnd   = 4 / 7;
  const clusterSpan = row.clusterHigh - row.clusterLow;
  const pos = clusterSpan > 0
    ? insideStart + ((row.price - row.clusterLow) / clusterSpan) * (insideEnd - insideStart)
    : 0.5;
  const clampedPos = Math.max(0.02, Math.min(0.98, pos));
  return (
    <div className="flex flex-col gap-3">
      {/* numeric scale */}
      <div className="flex items-end justify-between text-[10px] font-mono text-white/65">
        <span>cluster low<br/><span className="text-white/75 text-[11px]">${row.clusterLow.toFixed(2)}</span></span>
        <span className="text-center">mid<br/><span className="text-white/75 text-[11px]">${row.clusterMid.toFixed(2)}</span></span>
        <span className="text-right">cluster high<br/><span className="text-white/75 text-[11px]">${row.clusterHigh.toFixed(2)}</span></span>
      </div>
      {/* band */}
      <div className="relative h-9 rounded-sm overflow-hidden border border-white/22 bg-[#050505]">
        {/* 7 bucket cells */}
        <div className="absolute inset-0 grid grid-cols-7">
          {buckets.map((b, i) => {
            const inside = b === 'Inside';
            const here = i === row.bucketIdx;
            return (
              <div
                key={b}
                className="border-r border-white/18 last:border-r-0 relative"
                style={{
                  background: inside ? 'oklch(0.30 0.06 250 / 0.30)' : 'transparent',
                }}
              >
                {here && !inside && (
                  <div className="absolute inset-0" style={{ background: `${stateTone.replace(')', ' / 0.18)')}` }} />
                )}
              </div>
            );
          })}
        </div>
        {/* cluster boundaries */}
        <div className="absolute top-0 bottom-0 w-px bg-white/25" style={{ left: `${insideStart * 100}%` }} />
        <div className="absolute top-0 bottom-0 w-px bg-white/25" style={{ left: `${insideEnd * 100}%` }} />
        {/* price marker */}
        <div className="absolute top-0 bottom-0 w-[2px]" style={{ left: `calc(${clampedPos * 100}% - 1px)`, background: stateTone, boxShadow: `0 0 8px ${stateTone}` }} />
        <div className="absolute -top-1.5" style={{ left: `calc(${clampedPos * 100}% - 5px)` }}>
          <svg width="10" height="6" viewBox="0 0 10 6"><path d="M5 6 L0 0 L10 0 Z" fill={stateTone} /></svg>
        </div>
      </div>
      {/* labels */}
      <div className="grid grid-cols-7 gap-px text-[9.5px] font-mono uppercase tracking-[0.05em] text-white/60">
        {buckets.map((b, i) => (
          <span key={b} className={`text-center ${i === row.bucketIdx ? 'text-white' : ''}`}>
            {b.replace('Lower ','L').replace('Upper ','U').replace('Inside','IN')}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Detail section (collapsible on mobile) ────────────────────────────────
function DetailSection({ title, children, defaultOpen = true, collapsible = false, eyebrow }) {
  const [open, setOpen] = React.useState(defaultOpen);
  return (
    <section className="border-t border-white/18 first:border-t-0">
      <button
        onClick={() => collapsible && setOpen((o) => !o)}
        className={`w-full flex items-center justify-between gap-3 py-3.5 px-4 md:px-5 ${collapsible ? 'cursor-pointer' : 'cursor-default'}`}
        aria-expanded={open}
      >
        <div className="flex items-baseline gap-2.5 whitespace-nowrap">
          {eyebrow && <span className="text-[9.5px] uppercase tracking-[0.15em] text-[oklch(0.82_0.16_75)]">{eyebrow}</span>}
          <h3 className="text-[12px] text-white font-medium uppercase tracking-[0.12em]">{title}</h3>
        </div>
        {collapsible && (
          <span className="text-white/65" style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .15s' }}>
            <S2_Icons.ChevronDown size={14} />
          </span>
        )}
      </button>
      {open && <div className="px-4 md:px-5 pb-5">{children}</div>}
    </section>
  );
}

// ─── Generic key-value rows ────────────────────────────────────────────────
function KV({ rows, columns = 2 }) {
  const cls = columns === 2 ? 'grid-cols-2' : columns === 3 ? 'grid-cols-3' : 'grid-cols-1';
  return (
    <div className={`grid ${cls} gap-x-5 gap-y-2.5`}>
      {rows.map(([k, v, tone]) => (
        <div key={k} className="flex items-baseline justify-between gap-3 border-b border-white/15 py-1.5">
          <span className="text-[10.5px] text-[oklch(0.78_0.12_200)] uppercase tracking-[0.08em] whitespace-nowrap">{k}</span>
          <span className={`tabular-nums text-[13px] whitespace-nowrap ${tone || 'text-white'}`}>{v}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Symbol header ─────────────────────────────────────────────────────────
function SymbolHeader({ row, compact, starred, setStarred }) {
  return (
    <header className="sticky top-0 z-10 bg-black/85 backdrop-blur-md border-b border-white/22">
      <div className={`flex items-center gap-3 ${compact ? 'px-4 h-12' : 'px-6 h-14'}`}>
        <button aria-label="Back to dashboard" className="-ml-1 p-1.5 rounded text-white/75 hover:text-white hover:bg-white/8">
          <S2_Icons.ChevronLeft size={16} />
        </button>
        <div className="flex items-center gap-2 min-w-0">
          <span className="font-mono text-[15px] text-[oklch(0.86_0.14_75)] tracking-tight">{row.symbol}</span>
          <span className="text-white/30">·</span>
          <span className="text-[12px] text-white/75 truncate">{ {NVDA:'NVIDIA Corp', AAPL:'Apple Inc.', MSFT:'Microsoft Corp', META:'Meta Platforms', TSLA:'Tesla Inc.', GOOGL:'Alphabet Inc.', AMZN:'Amazon.com', AMD:'Advanced Micro Devices'}[row.symbol] || 'US large-cap'}</span>
        </div>
        <div className="ml-auto flex items-center gap-1">
          <button
            onClick={() => setStarred(!starred)}
            aria-label={starred ? 'Remove from watchlist' : 'Add to watchlist'}
            className={`p-2 rounded hover:bg-white/8 ${starred ? 'text-[oklch(0.80_0.16_72)]' : 'text-white/75'}`}
          >
            {starred ? <S2_Icons.StarFilled size={15} /> : <S2_Icons.Star size={15} />}
          </button>
          {!compact && (
            <button className="p-2 rounded text-white/75 hover:text-white hover:bg-white/8" aria-label="Refresh"><S2_Icons.Refresh size={15} /></button>
          )}
        </div>
      </div>
    </header>
  );
}

// ─── Hero metric block ─────────────────────────────────────────────────────
function HeroBlock({ row, compact }) {
  const gapPos = row.gap >= 0;
  return (
    <div className={`${compact ? 'px-4 pt-5 pb-6' : 'px-6 pt-7 pb-8'} border-b border-white/18`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-2 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <StateBadge state={row.state} size="md" />
            <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-white/65">SCORE</span>
            <span className="font-mono text-[13px] text-white tabular-nums">{row.score}</span>
            <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-white/65 ml-1">PRIOR45</span>
            <span className="font-mono text-[12px] text-white tabular-nums">{row.zone}</span>
          </div>
          <div className="flex items-baseline gap-3 mt-1">
            <span className={`font-mono ${compact ? 'text-[42px]' : 'text-[56px]'} leading-[0.95] tabular-nums tracking-tight text-white`}>
              ${row.price.toFixed(2)}
            </span>
            <span className={`font-mono ${compact ? 'text-[14px]' : 'text-[18px]'} tabular-nums ${gapPos ? 'text-[oklch(0.78_0.16_150)]' : 'text-[oklch(0.74_0.17_28)]'}`}>
              {gapPos ? '+' : ''}{row.gap.toFixed(2)}%
            </span>
          </div>
          <div className="flex items-center gap-2 text-[11px] font-mono text-white/70 flex-wrap">
            <span className="whitespace-nowrap">PRE-MKT · 08:42 NY</span>
            <span className="text-[oklch(0.82_0.16_75/0.5)]">│</span>
            <span className="whitespace-nowrap">VOL <span className="text-[oklch(0.78_0.12_200)] tabular-nums">{row.volUsd}</span></span>
          </div>
        </div>
        {!compact && (
          <div className="shrink-0 grid grid-cols-3 gap-5 px-5 py-4 rounded-sm border border-white/22 bg-[#0B0B0B]">
            <MiniStat label="SMA 20" value={`$${row.smaFast.toFixed(2)}`} />
            <MiniStat label="SMA 200" value={`$${row.smaSlow.toFixed(2)}`} />
            <MiniStat label="MA DIST" value={`${row.maDistAtr.toFixed(2)} ATR`} />
          </div>
        )}
      </div>
    </div>
  );
}

function MiniStat({ label, value, tone }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[10px] font-mono uppercase tracking-[0.12em] text-white/65">{label}</span>
      <span className={`font-mono tabular-nums text-[14px] ${tone || 'text-white'}`}>{value}</span>
    </div>
  );
}

// ─── SymbolDetail composer ─────────────────────────────────────────────────
function SymbolDetail({ symbol = 'NVDA', variant = 'default', layout = 'mobile' }) {
  const raw = window.MS_DATA.SCAN_RESULTS.find((r) => r.symbol === symbol) || window.MS_DATA.SCAN_RESULTS[0];
  const row = enrichRow(raw);
  const compact = layout === 'mobile';
  const [starred, setStarred] = React.useState(row.starred);

  if (variant === 'notfound') {
    return (
      <div className="h-full w-full bg-black text-white flex flex-col">
        <SymbolHeader row={{ ...row, symbol: 'XXXX' }} compact={compact} starred={false} setStarred={() => {}} />
        <div className="flex-1 grid place-items-center px-8">
          <div className="text-center max-w-[36ch]">
            <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/75 mb-2">NOT IN TODAY'S SCAN</div>
            <h2 className="text-[20px] text-white font-medium tracking-tight">XXXX wasn't a candidate in the 09:15 NY scan.</h2>
            <p className="text-[13px] text-white/75 mt-2">Symbol may not be in the eligible large-cap universe, or it failed the liquidity / SMA filters today.</p>
            <button className="mt-6 px-3.5 py-2 rounded-sm border border-white/22 bg-white/8 hover:bg-white/10 text-[12.5px] text-white">Back to dashboard</button>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'loading') {
    return (
      <div className="h-full w-full bg-black text-white flex flex-col">
        <SymbolHeader row={row} compact={compact} starred={starred} setStarred={setStarred} />
        <div className="px-4 md:px-6 pt-6 pb-8 border-b border-white/18 animate-pulse">
          <div className="flex gap-2 mb-3">
            <div className="h-5 w-20 rounded bg-white/10" />
            <div className="h-5 w-14 rounded bg-white/8" />
          </div>
          <div className="h-12 w-56 rounded bg-white/10 mb-2" />
          <div className="h-3 w-40 rounded bg-white/8" />
        </div>
        {['Moving averages','Prior45 zone','Liquidity','Notes'].map((t) => (
          <div key={t} className="px-4 md:px-6 py-4 border-b border-white/18 animate-pulse">
            <div className="h-4 w-32 rounded bg-white/8 mb-4" />
            <div className="grid grid-cols-2 gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex justify-between"><div className="h-3 w-14 rounded bg-white/8" /><div className="h-3 w-16 rounded bg-white/10" /></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="h-full w-full bg-black text-white flex flex-col">
      <SymbolHeader row={row} compact={compact} starred={starred} setStarred={setStarred} />
      <div className="flex-1 overflow-y-auto no-scrollbar pb-24">
        <HeroBlock row={row} compact={compact} />

        {/* Desktop: two-column grid; Mobile: stacked collapsible */}
        {!compact ? (
          <div className="grid grid-cols-12 gap-0">
            <div className="col-span-7 border-r border-white/18">
              <DetailSection title="Moving averages" eyebrow="01">
                <KV
                  columns={2}
                  rows={[
                    ['SMA fast (20)',  `$${row.smaFast.toFixed(2)}`],
                    ['SMA slow (200)', `$${row.smaSlow.toFixed(2)}`],
                    ['Distance · $',   `$${row.distanceToCluster.toFixed(2)}`],
                    ['Distance · ATR', `${row.maDistAtr.toFixed(2)}`],
                    ['Distance · %',   `${row.maDistPct.toFixed(2)}%`],
                    ['Slope · fast',   `${row.slopeFast > 0 ? '+' : ''}${row.slopeFast.toFixed(2)}`, row.slopeFast >= 0 ? 'text-[oklch(0.78_0.16_150)]' : 'text-[oklch(0.74_0.17_28)]'],
                    ['Slope · slow',   `${row.slopeSlow > 0 ? '+' : ''}${row.slopeSlow.toFixed(2)}`, row.slopeSlow >= 0 ? 'text-[oklch(0.78_0.16_150)]' : 'text-[oklch(0.74_0.17_28)]'],
                  ]}
                />
              </DetailSection>
              <DetailSection title="Prior45 zone" eyebrow="02">
                <div className="flex flex-col gap-5">
                  <KV columns={3} rows={[
                    ['Position', row.zone],
                    ['Side',     row.dir === 'long_above' ? 'Long' : row.dir === 'short_below' ? 'Short' : '—'],
                    ['Distance', `${row.maDistAtr.toFixed(2)} ATR`],
                  ]} />
                  <ZoneBand row={row} />
                </div>
              </DetailSection>
            </div>
            <div className="col-span-5">
              <DetailSection title="Liquidity" eyebrow="03">
                <KV columns={1} rows={[
                  ['Avg $ volume', row.volUsd],
                  ['ATR (2m)',     row.atr.toFixed(2)],
                  ['Score',        `${row.score} / 100`],
                ]} />
              </DetailSection>
              <DetailSection title="Scanner notes" eyebrow="04">
                <p className="text-[13px] leading-relaxed text-white/70">{row.notes}</p>
                <div className="mt-3 text-[10px] uppercase tracking-[0.14em] text-[oklch(0.82_0.16_75)]">FLAGGED 09:15:04 NY · scanner v2.4</div>
              </DetailSection>
            </div>
          </div>
        ) : (
          <>
            <DetailSection title="Moving averages" eyebrow="01" collapsible defaultOpen>
              <KV rows={[
                ['SMA fast 20',  `$${row.smaFast.toFixed(2)}`],
                ['SMA slow 200', `$${row.smaSlow.toFixed(2)}`],
                ['Dist · $',     `$${row.distanceToCluster.toFixed(2)}`],
                ['Dist · ATR',   `${row.maDistAtr.toFixed(2)}`],
                ['Dist · %',     `${row.maDistPct.toFixed(2)}%`],
                ['Slope fast',   `${row.slopeFast > 0 ? '+' : ''}${row.slopeFast.toFixed(2)}`, row.slopeFast >= 0 ? 'text-[oklch(0.78_0.16_150)]' : 'text-[oklch(0.74_0.17_28)]'],
              ]} />
            </DetailSection>
            <DetailSection title="Prior45 zone" eyebrow="02" collapsible defaultOpen>
              <div className="flex flex-col gap-4">
                <KV rows={[
                  ['Position', row.zone],
                  ['Side', row.dir === 'long_above' ? 'Long' : row.dir === 'short_below' ? 'Short' : '—'],
                ]} />
                <ZoneBand row={row} />
              </div>
            </DetailSection>
            <DetailSection title="Liquidity" eyebrow="03" collapsible defaultOpen={false}>
              <KV rows={[
                ['Avg $ volume', row.volUsd],
                ['ATR (2m)',     row.atr.toFixed(2)],
                ['Score',        `${row.score} / 100`],
              ]} />
            </DetailSection>
            <DetailSection title="Scanner notes" eyebrow="04" collapsible defaultOpen={false}>
              <p className="text-[13px] leading-relaxed text-white/70">{row.notes}</p>
            </DetailSection>
          </>
        )}
      </div>

      {/* sticky CTA */}
      <div className={`sticky bottom-0 ${compact ? 'px-4 py-3' : 'px-6 py-4'} border-t border-white/22 bg-black/90 backdrop-blur-md flex items-center gap-3`}>
        <button
          onClick={() => setStarred(!starred)}
          className={`flex-1 inline-flex items-center justify-center gap-2 rounded-sm py-2.5 text-[13px] font-medium transition-colors ${
            starred
              ? 'bg-white/10 text-white border border-white/22'
              : 'bg-white text-black hover:bg-white/90'
          }`}
        >
          {starred ? <S2_Icons.StarFilled size={14} /> : <S2_Icons.Star size={14} />}
          {starred ? 'On your watchlist' : 'Add to watchlist'}
        </button>
        {!compact && (
          <button className="px-4 py-2.5 rounded-sm border border-white/22 bg-white/8 hover:bg-white/10 text-[13px] text-white inline-flex items-center gap-2">
            <S2_Icons.Bell size={13} /> Alert me on trigger
          </button>
        )}
      </div>
    </div>
  );
}

Object.assign(window, { SymbolDetail, ZoneBand });
