// Dashboard primitives — TopBar, filter chips, StockCard, Dashboard layout.
// Props sketches at top of each component. In real TSX these become interfaces.

const { STATES, STATE_FILTERS, ZONE_FILTERS, WATCHLISTS, SCAN_RESULTS } = window.MS_DATA;
const Icons = window.MS_Icons;

// ─── primitive: state badge ────────────────────────────────────────────────
// props: { state: keyof STATES, size?: 'sm' | 'md', dot?: boolean }
function StateBadge({ state, size = 'sm', dot = true }) {
  const s = STATES[state]; if (!s) return null;
  const padding = size === 'md' ? 'px-2.5 py-1 text-[11px]' : 'px-2 py-0.5 text-[10px]';
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded ${padding} font-mono uppercase tracking-[0.08em] font-medium`}
      style={{ color: s.tone, background: s.soft, boxShadow: `inset 0 0 0 1px ${s.tone.replace(')', ' / 0.3)')}` }}
    >
      {dot && <span className="h-1.5 w-1.5 rounded-full" style={{ background: s.tone }} />}
      {s.label}
    </span>
  );
}

// ─── primitive: direction / "watch" badge ──────────────────────────────────
// props: { dir: 'long_above' | 'short_below' | 'wait' }
function DirBadge({ dir }) {
  const map = {
    long_above:  { label: 'LONG · ABOVE CLUSTER',  arrow: '↑' },
    short_below: { label: 'SHORT · BELOW CLUSTER', arrow: '↓' },
    wait:        { label: 'WAIT · NO TRIGGER',     arrow: '·' },
  };
  const v = map[dir];
  return (
    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded font-mono text-[9.5px] uppercase tracking-[0.08em] text-white/75 border border-white/22 bg-white/[0.02] whitespace-nowrap">
      <span className="text-white/65">{v.arrow}</span>{v.label}
    </span>
  );
}

// ─── primitive: score meter ────────────────────────────────────────────────
function ScoreMeter({ score, mono = true }) {
  const hue = score >= 90 ? 150 : score >= 75 ? 250 : score >= 60 ? 72 : 30;
  const tone = `oklch(0.74 0.16 ${hue})`;
  return (
    <div className="flex flex-col items-end gap-1 min-w-[44px]">
      <span className={`text-[22px] leading-none ${mono ? 'font-mono' : ''} tabular-nums font-medium`} style={{ color: tone }}>{score}</span>
      <div className="h-[3px] w-11 rounded-full bg-white/10 overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${score}%`, background: tone }} />
      </div>
    </div>
  );
}

// ─── stock card ────────────────────────────────────────────────────────────
// props: { row: ScanResult, onClick?, onStar?, compact?: boolean }
function StockCard({ row, compact = false, onOpen }) {
  const [starred, setStarred] = React.useState(row.starred);
  const gapPositive = row.gap >= 0;
  const open = () => onOpen?.(row);
  const onKey = (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); }
  };
  return (
    <div
      role="link"
      tabIndex={0}
      aria-label={`${row.symbol} — open detail`}
      onClick={open}
      onKeyDown={onKey}
      className="group relative text-left w-full rounded-sm border border-white/22 bg-[#0B0B0B] hover:bg-[#121212] hover:border-white/25 transition-colors p-3.5 flex flex-col gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-[oklch(0.74_0.17_250)] cursor-pointer"
    >
      {/* top row: symbol + badges + star */}
      <div className="flex items-start gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="font-mono text-[20px] leading-none tracking-tight text-[oklch(0.86_0.14_75)] font-medium">{row.symbol}</span>
            <StateBadge state={row.state} />
          </div>
          <DirBadge dir={row.dir} />
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); setStarred(!starred); }}
          aria-label={starred ? 'Remove from watchlist' : 'Add to watchlist'}
          className={`shrink-0 -mr-1 -mt-1 p-1.5 rounded transition-colors ${starred ? 'text-[oklch(0.80_0.16_72)]' : 'text-white/55 hover:text-white/70'}`}
        >
          {starred ? <Icons.StarFilled size={14} /> : <Icons.Star size={14} />}
        </button>
      </div>

      {/* middle row: price + gap + score */}
      <div className="flex items-end justify-between gap-3 pt-1">
        <div className="flex items-baseline gap-2 min-w-0">
          <span className="font-mono text-[26px] leading-none tabular-nums text-white tracking-tight">
            ${row.price.toFixed(2)}
          </span>
          <span className={`font-mono text-[12px] tabular-nums ${gapPositive ? 'text-[oklch(0.78_0.16_150)]' : 'text-[oklch(0.74_0.17_28)]'}`}>
            {gapPositive ? '+' : ''}{row.gap.toFixed(2)}%
          </span>
        </div>
        <ScoreMeter score={row.score} />
      </div>

      {/* divider */}
      <div className="h-px bg-white/8" />

      {/* numeric 2x3 grid */}
      <div className="grid grid-cols-2 gap-x-3 gap-y-3 text-[11px]">
        <Metric label="MA dist"    value={`${row.maDistAtr.toFixed(2)} ATR`} />
        <Metric label="MA dist %"  value={`${row.maDistPct.toFixed(2)}%`} />
        <Metric label="ATR"        value={row.atr.toFixed(2)} />
        <Metric label="Vol $"      value={row.volUsd} />
        <Metric label="Slope fast" value={row.slopeFast.toFixed(2)} signed />
        <Metric label="Prior45"    value={row.zone} mono={false} accent={row.zone === 'Inside' ? 'inside' : 'edge'} />
      </div>
    </div>
  );
}

function Metric({ label, value, signed = false, mono = true, accent }) {
  let tone = 'text-white';
  if (signed) {
    const n = parseFloat(value);
    if (n > 0) tone = 'text-[oklch(0.78_0.16_150)]';
    else if (n < 0) tone = 'text-[oklch(0.74_0.17_28)]';
  }
  if (accent === 'inside') tone = 'text-[oklch(0.74_0.17_250)]';
  if (accent === 'edge')   tone = 'text-[oklch(0.80_0.16_72)]';
  return (
    <div className="flex flex-col gap-0.5 min-w-0">
      <span className="text-[oklch(0.78_0.12_200)] uppercase tracking-[0.06em] text-[9.5px] leading-tight">{label}</span>
      <span className={`${mono ? 'font-mono' : ''} tabular-nums text-[13px] leading-tight ${tone} truncate`}>
        {signed && parseFloat(value) > 0 ? '+' : ''}{value}
      </span>
    </div>
  );
}

// ─── top bar ───────────────────────────────────────────────────────────────
// props: { generatedAt: string, nextScan: string, compact?: boolean, onMenu? }
function TopBar({ generatedAt = '09:15 NY · 20-MAY', nextScan = '23H 14M', compact = false, onMenu, title = 'OPENING SCANNER', showScanStatus = true, showFKeys = false }) {
  return (
    <header
      className="sticky top-0 z-20 backdrop-blur-md bg-black/85 border-b-[1.5px]"
      style={{ borderBottomColor: 'oklch(0.82 0.16 75 / 0.55)' }}
    >
      <div className={`flex items-center gap-3 ${compact ? 'px-3 h-11' : 'px-5 h-12'}`}>
        {compact && (
          <button aria-label="Menu" onClick={onMenu} className="text-white/78 hover:text-white p-1 -ml-1">
            <Icons.Menu size={16} />
          </button>
        )}
        {/* logo + wordmark */}
        <div className="flex items-center gap-2 shrink-0">
          <Icons.Logo size={compact ? 14 : 16} />
          {!compact && <>
            <span className="text-[11px] tracking-[0.22em] uppercase text-[oklch(0.82_0.16_75)] font-medium">MR/STOCKS</span>
            <span className="text-white/30">│</span>
            <span className="text-[11.5px] tracking-[0.14em] uppercase text-white font-medium">{title}</span>
          </>}
          {compact && <span className="text-[11.5px] tracking-[0.14em] uppercase text-white font-medium">{title}</span>}
        </div>

        {/* center: timestamp + countdown */}
        {!compact && (
          <div className="flex-1 flex justify-center">
            <div className="flex items-center gap-3 text-[11px] text-white/85">
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 border border-[oklch(0.78_0.16_150/0.55)] bg-[oklch(0.78_0.16_150/0.10)] rounded-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-[oklch(0.78_0.16_150)] shadow-[0_0_8px_oklch(0.78_0.16_150)]" />
                <span className="text-[oklch(0.78_0.16_150)] tracking-[0.1em] uppercase">LIVE</span>
                <span className="text-white/78">SCAN {generatedAt}</span>
              </span>
              <span className="inline-flex items-center gap-1.5 text-white/75 uppercase tracking-[0.08em]">
                NEXT <span className="text-white">{nextScan}</span>
              </span>
            </div>
          </div>
        )}

        {/* right: function keys + avatar */}
        <div className="flex items-center gap-1.5 ml-auto shrink-0">
          {!compact && showFKeys && (
            <div className="hidden lg:flex items-center gap-1 mr-2">
              <FKey label="F1" hint="HELP" />
              <FKey label="F2" hint="ALERT" />
              <FKey label="F3" hint="WATCH" />
            </div>
          )}
          <button aria-label="Alerts" className="relative p-1.5 rounded-sm text-white/75 hover:text-white hover:bg-white/10 border border-transparent hover:border-white/15">
            <Icons.Bell size={14} />
            <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-[oklch(0.82_0.16_75)]" />
          </button>
          <button className="flex items-center gap-1.5 pl-1 pr-1.5 py-1 rounded-sm hover:bg-white/10 text-white/85 border border-white/15">
            <span className="h-5 w-5 rounded-sm bg-[oklch(0.82_0.16_75/0.18)] text-[oklch(0.82_0.16_75)] grid place-items-center text-[10px] font-medium">LM</span>
            {!compact && <Icons.ChevronDown size={11} />}
          </button>
        </div>
      </div>

      {/* compact: timestamp row under bar */}
      {compact && (
        <div className="px-3 pb-2 flex items-center gap-2 text-[10px] text-white/78">
          <span className="inline-flex items-center gap-1.5 px-1.5 py-0.5 border border-[oklch(0.78_0.16_150/0.55)] bg-[oklch(0.78_0.16_150/0.10)] rounded-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-[oklch(0.78_0.16_150)]" />
            <span className="text-[oklch(0.78_0.16_150)] tracking-[0.1em] uppercase">LIVE</span>
          </span>
          <span className="uppercase tracking-[0.08em] truncate">SCAN {generatedAt}</span>
          <span className="ml-auto uppercase tracking-[0.08em] whitespace-nowrap">NEXT <span className="text-white">{nextScan}</span></span>
        </div>
      )}
    </header>
  );
}

function FKey({ label, hint }) {
  return (
    <button className="group inline-flex items-stretch border border-white/15 hover:border-[oklch(0.82_0.16_75/0.5)] hover:bg-[oklch(0.82_0.16_75/0.08)] rounded-sm overflow-hidden">
      <span className="px-1.5 py-0.5 text-[9.5px] tracking-[0.08em] bg-white/10 text-[oklch(0.82_0.16_75)] uppercase">{label}</span>
      <span className="px-1.5 py-0.5 text-[9.5px] tracking-[0.1em] uppercase text-white/78 group-hover:text-white">{hint}</span>
    </button>
  );
}

// ─── filter chip rows ──────────────────────────────────────────────────────
// props: { active: { state, zone, watchlist }, setActive, compact? }
function FilterRows({ active, setActive, compact }) {
  return (
    <div className={`border-b border-white/18 bg-[#050505] ${compact ? '' : ''}`}>
      <ChipRow
        label="STATE"
        items={STATE_FILTERS}
        activeId={active.state}
        onPick={(id) => setActive({ ...active, state: id })}
        compact={compact}
      />
      <ChipRow
        label="PRIOR45"
        items={ZONE_FILTERS}
        activeId={active.zone}
        onPick={(id) => setActive({ ...active, zone: id })}
        compact={compact}
      />
      <WatchlistRow active={active.watchlist} setActive={(id) => setActive({ ...active, watchlist: id })} compact={compact} />
    </div>
  );
}

function ChipRow({ label, items, activeId, onPick, compact }) {
  return (
    <div className={`flex items-center gap-2 ${compact ? 'px-4 py-2' : 'px-6 py-2.5'} border-b border-white/15`}>
      <span className="text-[9.5px] uppercase tracking-[0.18em] text-[oklch(0.82_0.16_75)] shrink-0 w-[58px]">{label}</span>
      <div className="flex gap-1.5 overflow-x-auto no-scrollbar -mr-4 pr-4">
        {items.map((it) => {
          const isActive = activeId === it.id;
          const stateTone = STATES[it.id]?.tone;
          return (
            <button
              key={it.id}
              onClick={() => onPick(it.id)}
              className={`shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-[11px] border transition-colors ${
                isActive
                  ? 'bg-white/10 border-white/15 text-white'
                  : 'border-white/22 text-white/75 hover:text-white hover:border-white/22'
              }`}
            >
              {stateTone && it.id !== 'all' && (
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: stateTone }} />
              )}
              {it.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function WatchlistRow({ active, setActive, compact }) {
  const [open, setOpen] = React.useState(false);
  const current = WATCHLISTS.find((w) => w.id === active) || WATCHLISTS[0];
  return (
    <div className={`flex items-center gap-2 ${compact ? 'px-4 py-2' : 'px-6 py-2.5'}`}>
      <span className="font-mono text-[9.5px] uppercase tracking-[0.12em] text-white/70 shrink-0 w-[58px]">LIST</span>
      <div className="relative">
        <button
          onClick={() => setOpen((o) => !o)}
          className="inline-flex items-center gap-2 px-2.5 py-1 rounded-sm text-[11px] border border-white/18 bg-white/[0.03] text-white hover:bg-white/[0.06]"
        >
          {current.name}
          <span className="font-mono text-[10px] text-[oklch(0.78_0.12_200)]">{current.count}</span>
          <Icons.ChevronDown size={12} className="text-white/65" />
        </button>
        {open && (
          <div className="absolute top-full left-0 mt-1 z-30 w-56 rounded-sm border border-white/18 bg-[#121212] shadow-2xl p-1">
            {WATCHLISTS.map((w) => (
              <button
                key={w.id}
                onClick={() => { setActive(w.id); setOpen(false); }}
                className={`w-full text-left flex items-center justify-between px-2 py-1.5 rounded text-[12px] ${
                  active === w.id ? 'bg-white/10 text-white' : 'text-white/70 hover:bg-white/8 hover:text-white'
                }`}
              >
                <span>{w.name}</span>
                <span className="font-mono text-[10px] text-[oklch(0.78_0.12_200)]">{w.count}</span>
              </button>
            ))}
            <div className="h-px bg-white/8 my-1" />
            <button className="w-full text-left px-2 py-1.5 rounded text-[12px] text-[oklch(0.74_0.17_250)] hover:bg-white/8 inline-flex items-center gap-1.5">
              <span className="text-white/65">+</span> New watchlist
            </button>
          </div>
        )}
      </div>
      <div className="flex-1" />
      <div className="hidden md:flex items-center gap-2 text-[11px] text-white/65 font-mono">
        <span>{SCAN_RESULTS.length} candidates</span>
        <span className="text-white/30">·</span>
        <span className="inline-flex items-center gap-1 cursor-pointer hover:text-white/70"><Icons.Filter size={11} /> Sort: score</span>
      </div>
    </div>
  );
}

// ─── card grid ─────────────────────────────────────────────────────────────
function CardGrid({ rows, columns }) {
  const cls = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
  }[columns] || 'grid-cols-1';
  return (
    <div className={`grid ${cls} gap-3 p-4`}>
      {rows.map((r) => <StockCard key={r.symbol} row={r} />)}
    </div>
  );
}

// ─── loading skeleton card ─────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="rounded-sm border border-white/18 bg-[#0B0B0B] p-3.5 flex flex-col gap-3 animate-pulse">
      <div className="flex items-center gap-2">
        <div className="h-5 w-14 rounded bg-white/10" />
        <div className="h-4 w-16 rounded bg-white/8" />
        <div className="ml-auto h-4 w-4 rounded bg-white/8" />
      </div>
      <div className="h-3 w-28 rounded bg-white/8" />
      <div className="flex items-end justify-between pt-1">
        <div className="h-7 w-24 rounded bg-white/10" />
        <div className="h-7 w-10 rounded bg-white/8" />
      </div>
      <div className="h-px bg-white/6" />
      <div className="grid grid-cols-2 gap-x-3 gap-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-1"><div className="h-2.5 w-12 rounded bg-white/8" /><div className="h-3 w-16 rounded bg-white/10" /></div>
        ))}
      </div>
    </div>
  );
}

function SkeletonChipRow({ width, n = 6 }) {
  return (
    <div className="flex items-center gap-2 px-6 py-2.5 border-b border-white/15">
      <div className="h-3 w-12 rounded bg-white/8 animate-pulse" />
      <div className="flex gap-1.5 ml-1">
        {Array.from({ length: n }).map((_, i) => (
          <div key={i} className="h-6 rounded-sm bg-white/8 animate-pulse" style={{ width: 60 + (i * 13) % 40 }} />
        ))}
      </div>
    </div>
  );
}

// ─── empty / loading screens ───────────────────────────────────────────────
function EmptyState({ compact }) {
  return (
    <div className={`flex flex-col items-center text-center ${compact ? 'pt-16 px-6' : 'pt-24 px-12'}`}>
      <div className="relative mb-6">
        <div className="h-16 w-16 rounded border border-white/18 bg-[#0B0B0B] grid place-items-center">
          <Icons.Sparkles size={22} stroke="oklch(0.74 0.17 250)" />
        </div>
        <div className="absolute -inset-2 rounded bg-[oklch(0.74_0.17_250)] opacity-[0.08] blur-2xl -z-10" />
      </div>
      <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/75 mb-2">NO SCAN YET TODAY</div>
      <h2 className="text-[20px] text-white font-medium tracking-tight max-w-[26ch]">The opening scanner runs at 09:15 NY each market morning.</h2>
      <p className="text-[13px] text-white/75 mt-2 max-w-[40ch]">Today's results will appear here automatically. You'll get a push notification when A+ setups are found.</p>
      <div className="mt-7 inline-flex items-center gap-3 px-4 py-2.5 rounded-sm border border-white/22 bg-[#0B0B0B] font-mono text-[11px]">
        <Icons.Clock size={12} stroke="oklch(0.78 0.16 150)" />
        <span className="text-white/75">Next scan in</span>
        <span className="text-white tabular-nums">07h 42m 18s</span>
      </div>
      <div className="mt-5 flex items-center gap-3 text-[11.5px] text-white/70">
        <a className="inline-flex items-center gap-1 hover:text-white">Yesterday's scan <Icons.ArrowUpRight size={11} /></a>
        <span className="text-white/30">·</span>
        <a className="inline-flex items-center gap-1 hover:text-white">Configure alerts <Icons.ArrowUpRight size={11} /></a>
      </div>
    </div>
  );
}

function LoadingScreen({ compact, columns = 1 }) {
  const cls = { 1: 'grid-cols-1', 2: 'grid-cols-2', 3: 'grid-cols-3', 4: 'grid-cols-4' }[columns] || 'grid-cols-1';
  return (
    <>
      {/* skeleton chip rows */}
      <div className="border-b border-white/18 bg-[#050505]">
        <SkeletonChipRow n={7} />
        <SkeletonChipRow n={8} />
        <div className="flex items-center gap-2 px-6 py-2.5">
          <div className="h-3 w-12 rounded bg-white/8 animate-pulse" />
          <div className="h-6 w-32 rounded-sm bg-white/8 animate-pulse" />
        </div>
      </div>
      {/* status banner */}
      <div className="px-6 py-2 flex items-center gap-2 text-[11px] font-mono text-white/75 border-b border-white/15 bg-[oklch(0.30_0.08_250/0.15)]">
        <span className="h-1.5 w-1.5 rounded-full bg-[oklch(0.74_0.17_250)] animate-pulse" />
        SCAN IN PROGRESS · 09:15:04 NY · evaluating 487 / 503 candidates
        <span className="ml-auto text-white/60">SMA20 × SMA200 · 2m bars</span>
      </div>
      <div className={`grid ${cls} gap-3 p-4`}>
        {Array.from({ length: columns * 3 }).map((_, i) => <SkeletonCard key={i} />)}
      </div>
    </>
  );
}

// ─── Dashboard composer ────────────────────────────────────────────────────
// props: { variant: 'default'|'empty'|'loading', layout: 'mobile'|'desktop' }
function Dashboard({ variant = 'default', layout = 'mobile' }) {
  const compact = layout === 'mobile';
  const columns = layout === 'mobile' ? 1 : 3;
  const [active, setActive] = React.useState({ state: 'all', zone: 'all', watchlist: 'all' });

  // filter SCAN_RESULTS
  const rows = SCAN_RESULTS.filter((r) => {
    if (active.state !== 'all' && r.state !== active.state) return false;
    if (active.zone !== 'all' && r.zone !== active.zone) return false;
    return true;
  });

  return (
    <div className="h-full w-full bg-black text-white flex flex-col overflow-hidden">
      <TopBar compact={compact} showFKeys />
      {variant !== 'empty' && variant !== 'loading' && (
        <FilterRows active={active} setActive={setActive} compact={compact} />
      )}
      <div className="flex-1 overflow-y-auto no-scrollbar">
        {variant === 'default' && (
          rows.length > 0 ? <CardGrid rows={rows} columns={columns} /> : <NoMatch />
        )}
        {variant === 'empty' && <EmptyState compact={compact} />}
        {variant === 'loading' && <LoadingScreen compact={compact} columns={columns} />}
      </div>
      <StatusBar compact={compact} count={rows.length} variant={variant} />
    </div>
  );
}

function StatusBar({ compact, count, variant }) {
  const state = variant === 'loading' ? 'SCANNING' : variant === 'empty' ? 'IDLE' : 'READY';
  const tone = state === 'SCANNING' ? 'oklch(0.82 0.16 75)' : state === 'IDLE' ? 'oklch(0.62 0.01 250)' : 'oklch(0.78 0.16 150)';
  return (
    <div className="border-t-[1.5px] border-white/22 bg-black">
      <div className={`flex items-center gap-3 ${compact ? 'px-3 h-7' : 'px-5 h-8'} text-[10px] uppercase tracking-[0.08em]`}>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: tone, boxShadow: `0 0 6px ${tone}` }} />
          <span style={{ color: tone }}>{state}</span>
        </span>
        <span className="text-[oklch(0.82_0.16_75/0.5)]">│</span>
        <span className="text-[oklch(0.78_0.12_200)]">CAND <span className="text-white">{String(count).padStart(3, '0')}</span><span className="text-white/55">/503</span></span>
        {!compact && <>
          <span className="text-[oklch(0.82_0.16_75/0.5)]">│</span>
          <span className="text-[oklch(0.78_0.12_200)]">UNIV <span className="text-white">US-LRG</span></span>
          <span className="text-[oklch(0.82_0.16_75/0.5)]">│</span>
          <span className="text-[oklch(0.78_0.12_200)]">TF <span className="text-white">2M</span></span>
          <span className="text-[oklch(0.82_0.16_75/0.5)]">│</span>
          <span className="text-[oklch(0.78_0.12_200)]">V<span className="text-white">2.4</span></span>
        </>}
        <span className="ml-auto inline-flex items-center gap-3">
          {!compact && <>
            <span><kbd className="text-[oklch(0.82_0.16_75)]">/</kbd> <span className="text-white/75">SEARCH</span></span>
            <span><kbd className="text-[oklch(0.82_0.16_75)]">F</kbd> <span className="text-white/75">FILTER</span></span>
            <span><kbd className="text-[oklch(0.82_0.16_75)]">W</kbd> <span className="text-white/75">WATCH</span></span>
            <span><kbd className="text-[oklch(0.82_0.16_75)]">?</kbd> <span className="text-white/75">HELP</span></span>
          </>}
          {compact && <span><kbd className="text-[oklch(0.82_0.16_75)]">/</kbd> <span className="text-white/75">SEARCH</span></span>}
        </span>
      </div>
    </div>
  );
}

function NoMatch() {
  return (
    <div className="p-12 text-center text-white/70 text-[13px]">
      No candidates match these filters. <span className="text-[oklch(0.74_0.17_250)] underline-offset-2 hover:underline cursor-pointer">Reset</span>
    </div>
  );
}

Object.assign(window, { Dashboard, StockCard, TopBar, FilterRows, EmptyState, LoadingScreen, StateBadge, ScoreMeter });
