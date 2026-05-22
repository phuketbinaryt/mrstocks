// Screen 3 — Watchlists (/watchlists and /watchlists/[id])
// Props sketches at the top of each component.

const { WATCHLIST_DETAIL, SCAN_RESULTS: W3_RESULTS, STATES: W3_STATES } = window.MS_DATA;
const W3_Icons = window.MS_Icons;
const AMBER = 'oklch(0.82 0.16 75)';
const CYAN  = 'oklch(0.78 0.12 200)';
const GREEN = 'oklch(0.78 0.16 150)';

// ─── helpers ───────────────────────────────────────────────────────────────
function symbolRow(sym) { return W3_RESULTS.find((r) => r.symbol === sym); }

// ─── list view: row item (mobile) ──────────────────────────────────────────
function WatchlistRowItem({ wl, onOpen, dense = false }) {
  return (
    <button
      onClick={() => onOpen?.(wl.id)}
      className="group w-full text-left border-b border-white/15 hover:bg-[oklch(0.82_0.16_75/0.04)] focus:outline-none focus-visible:bg-[oklch(0.82_0.16_75/0.06)] transition-colors px-4 py-3.5 flex items-center gap-3"
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[14px] text-white font-medium uppercase tracking-[0.04em] truncate">{wl.name}</span>
          {wl.isDefault && (
            <span className="text-[9px] uppercase tracking-[0.15em] px-1.5 py-[1px] rounded-sm border border-[oklch(0.82_0.16_75/0.5)] text-[oklch(0.82_0.16_75)] bg-[oklch(0.82_0.16_75/0.08)]">DEFAULT</span>
          )}
        </div>
        <div className="flex items-center gap-2 text-[10.5px] uppercase tracking-[0.08em]">
          <span className="text-[oklch(0.78_0.12_200)]">SYM <span className="text-white tabular-nums">{String(wl.symbols.length).padStart(2,'0')}</span></span>
          <span className="text-[oklch(0.82_0.16_75/0.5)]">│</span>
          <span className="text-[oklch(0.78_0.12_200)]">TODAY <span className={wl.hitsToday > 0 ? 'text-[oklch(0.78_0.16_150)]' : 'text-white/55'}>{String(wl.hitsToday).padStart(2,'0')}</span></span>
          <span className="text-[oklch(0.82_0.16_75/0.5)]">│</span>
          <span className="text-white/65">UPD {wl.updated}</span>
        </div>
      </div>
      <WatchlistRowKebab />
    </button>
  );
}

function WatchlistRowKebab() {
  return (
    <span className="shrink-0 p-1.5 rounded-sm text-white/60 group-hover:text-white border border-transparent group-hover:border-white/15">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="19" cy="12" r="1.6"/></svg>
    </span>
  );
}

// ─── list view: desktop table row ──────────────────────────────────────────
function WatchlistTableRow({ wl, onOpen }) {
  return (
    <button
      onClick={() => onOpen?.(wl.id)}
      className="group w-full text-left grid grid-cols-[1fr_64px_64px_140px_120px_44px] items-center gap-4 px-5 py-3 border-b border-white/12 hover:bg-[oklch(0.82_0.16_75/0.04)] transition-colors"
    >
      <div className="flex items-center gap-2 min-w-0">
        <span className="text-[14px] text-white font-medium uppercase tracking-[0.04em] truncate">{wl.name}</span>
        {wl.isDefault && (
          <span className="text-[9px] uppercase tracking-[0.15em] px-1.5 py-[1px] rounded-sm border border-[oklch(0.82_0.16_75/0.5)] text-[oklch(0.82_0.16_75)] bg-[oklch(0.82_0.16_75/0.08)]">DEFAULT</span>
        )}
      </div>
      <span className="text-right tabular-nums text-[13px] text-white">{String(wl.symbols.length).padStart(2,'0')}</span>
      <span className={`text-right tabular-nums text-[13px] ${wl.hitsToday > 0 ? 'text-[oklch(0.78_0.16_150)]' : 'text-white/55'}`}>{String(wl.hitsToday).padStart(2,'0')}</span>
      <span className="text-[10.5px] uppercase tracking-[0.08em] text-white/70 tabular-nums">{wl.updated}</span>
      <div className="flex items-center gap-1.5 overflow-hidden">
        {wl.symbols.slice(0,4).map((s) => (
          <span key={s} className="px-1.5 py-0.5 rounded-sm border border-white/15 text-[9.5px] uppercase tracking-[0.04em] text-[oklch(0.82_0.16_75)] whitespace-nowrap">{s}</span>
        ))}
        {wl.symbols.length > 4 && <span className="text-[10px] text-white/55">+{wl.symbols.length - 4}</span>}
      </div>
      <WatchlistRowKebab />
    </button>
  );
}

// ─── list view ─────────────────────────────────────────────────────────────
// props: { variant: 'default'|'empty'|'loading', layout: 'mobile'|'desktop', onOpen? }
function WatchlistsList({ variant = 'default', layout = 'mobile', onOpen }) {
  const compact = layout === 'mobile';
  const lists = WATCHLIST_DETAIL;

  return (
    <div className="h-full w-full bg-black text-white flex flex-col overflow-hidden">
      <TopBar compact={compact} title="WATCHLISTS" />

      {/* secondary header */}
      <div className={`flex items-center gap-3 ${compact ? 'px-3 py-2.5' : 'px-5 py-3'} border-b border-white/12 bg-[#050505]`}>
        <span className="text-[9.5px] uppercase tracking-[0.18em] text-[oklch(0.82_0.16_75)]">ALL LISTS</span>
        <span className="text-[oklch(0.82_0.16_75/0.5)]">│</span>
        <span className="text-[10.5px] uppercase tracking-[0.08em] text-[oklch(0.78_0.12_200)]">COUNT <span className="text-white tabular-nums">{String(lists.length).padStart(2,'0')}</span></span>
        <div className="flex-1" />
        {!compact && (
          <span className="text-[10.5px] uppercase tracking-[0.08em] text-white/65 inline-flex items-center gap-1.5">
            <W3_Icons.Search size={11} /> SEARCH LISTS
          </span>
        )}
        <button className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm border border-[oklch(0.82_0.16_75/0.5)] bg-[oklch(0.82_0.16_75/0.12)] text-[oklch(0.82_0.16_75)] text-[10.5px] uppercase tracking-[0.1em] hover:bg-[oklch(0.82_0.16_75/0.2)]">
          + NEW LIST
        </button>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar">
        {variant === 'default' && (
          compact ? (
            <div>{lists.map((wl) => <WatchlistRowItem key={wl.id} wl={wl} onOpen={onOpen} />)}</div>
          ) : (
            <div>
              {/* table header */}
              <div className="grid grid-cols-[1fr_64px_64px_140px_120px_44px] items-center gap-4 px-5 py-2 border-b border-white/15 bg-[#050505] text-[9.5px] uppercase tracking-[0.12em] text-[oklch(0.78_0.12_200)]">
                <span>NAME</span>
                <span className="text-right">SYM</span>
                <span className="text-right">TODAY</span>
                <span>UPDATED</span>
                <span>PREVIEW</span>
                <span />
              </div>
              {lists.map((wl) => <WatchlistTableRow key={wl.id} wl={wl} onOpen={onOpen} />)}
            </div>
          )
        )}
        {variant === 'empty' && <WatchlistsEmpty compact={compact} />}
        {variant === 'loading' && <WatchlistsLoading compact={compact} />}
      </div>

      <StatusBar compact={compact} count={lists.length} variant={variant} />
    </div>
  );
}

function WatchlistsEmpty({ compact }) {
  return (
    <div className={`flex flex-col items-center text-center ${compact ? 'pt-16 px-6' : 'pt-24 px-12'}`}>
      <div className="h-14 w-14 rounded border border-white/15 bg-[#0B0B0B] grid place-items-center mb-5 text-[oklch(0.82_0.16_75)]">
        <W3_Icons.Inbox size={20} />
      </div>
      <div className="text-[10px] uppercase tracking-[0.18em] text-[oklch(0.82_0.16_75)] mb-2">NO WATCHLISTS YET</div>
      <h2 className="text-[18px] text-white font-medium tracking-tight max-w-[28ch] uppercase">Create your first watchlist to filter today's scan.</h2>
      <p className="text-[12.5px] text-white/70 mt-2 max-w-[44ch]">A watchlist groups symbols you care about. Set one as your default and the dashboard filters to it on load.</p>
      <button className="mt-6 inline-flex items-center gap-2 px-3.5 py-2 rounded-sm border border-[oklch(0.82_0.16_75/0.5)] bg-[oklch(0.82_0.16_75/0.14)] text-[oklch(0.82_0.16_75)] text-[11px] uppercase tracking-[0.12em]">
        + NEW WATCHLIST
      </button>
    </div>
  );
}

function WatchlistsLoading({ compact }) {
  return (
    <div className="animate-pulse">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="border-b border-white/12 px-4 py-3.5 flex items-center gap-3">
          <div className="flex-1">
            <div className="h-3.5 w-40 rounded-sm bg-white/10 mb-2" />
            <div className="flex gap-2">
              <div className="h-2.5 w-14 rounded-sm bg-white/8" />
              <div className="h-2.5 w-16 rounded-sm bg-white/8" />
              <div className="h-2.5 w-20 rounded-sm bg-white/8" />
            </div>
          </div>
          <div className="h-4 w-4 rounded-sm bg-white/8" />
        </div>
      ))}
    </div>
  );
}

// ─── detail view: symbol chip ──────────────────────────────────────────────
function SymbolChip({ sym, onRemove }) {
  const row = symbolRow(sym);
  const state = row?.state;
  const tone = state ? W3_STATES[state].tone : 'oklch(0.82 0.16 75)';
  return (
    <span className="inline-flex items-center gap-1.5 pl-1.5 pr-1 py-1 rounded-sm border border-white/15 bg-[#0B0B0B] text-[12px] hover:border-white/25 group">
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: tone }} />
      <span className="text-white font-medium tracking-tight">{sym}</span>
      {row && (
        <span className={`text-[10px] tabular-nums ${row.gap >= 0 ? 'text-[oklch(0.78_0.16_150)]' : 'text-[oklch(0.74_0.17_28)]'}`}>
          {row.gap >= 0 ? '+' : ''}{row.gap.toFixed(2)}%
        </span>
      )}
      <button
        onClick={(e) => { e.stopPropagation(); onRemove?.(sym); }}
        aria-label={`Remove ${sym}`}
        className="ml-0.5 p-0.5 rounded-sm text-white/55 hover:text-[oklch(0.74_0.17_28)] hover:bg-white/8"
      >
        <W3_Icons.X size={11} />
      </button>
    </span>
  );
}

// ─── detail view ───────────────────────────────────────────────────────────
// props: { id, variant: 'default'|'empty'|'loading', layout: 'mobile'|'desktop' }
function WatchlistDetail({ id = 'tech_leaders', variant = 'default', layout = 'mobile' }) {
  const compact = layout === 'mobile';
  const wl = WATCHLIST_DETAIL.find((w) => w.id === id) || WATCHLIST_DETAIL[0];
  const [symbols, setSymbols] = React.useState(wl.symbols);
  const [query, setQuery] = React.useState('');
  const isEmpty = variant === 'empty';
  const isLoading = variant === 'loading';
  const effSymbols = isEmpty ? [] : symbols;

  // signals for this watchlist = SCAN_RESULTS whose symbol is in the list
  const signals = effSymbols
    .map(symbolRow)
    .filter(Boolean);

  return (
    <div className="h-full w-full bg-black text-white flex flex-col overflow-hidden">
      <TopBar compact={compact} title="WATCHLISTS" />

      {/* breadcrumb / header */}
      <div className={`flex items-center gap-3 ${compact ? 'px-3 h-11' : 'px-5 h-12'} border-b border-white/12 bg-[#050505]`}>
        <button aria-label="Back" className="-ml-1 p-1.5 rounded-sm text-white/75 hover:text-white hover:bg-white/10">
          <W3_Icons.ChevronLeft size={14} />
        </button>
        <span className="text-[10px] uppercase tracking-[0.14em] text-[oklch(0.82_0.16_75)]">WATCHLIST</span>
        <span className="text-[oklch(0.82_0.16_75/0.5)]">│</span>
        <span className="text-[13px] uppercase tracking-[0.06em] text-white font-medium truncate">{wl.name}</span>
        {wl.isDefault && !compact && (
          <span className="text-[9px] uppercase tracking-[0.15em] px-1.5 py-[1px] rounded-sm border border-[oklch(0.82_0.16_75/0.5)] text-[oklch(0.82_0.16_75)]">DEFAULT</span>
        )}
        <div className="flex-1" />
        {!compact && (
          <>
            <label className="inline-flex items-center gap-2 text-[10.5px] uppercase tracking-[0.08em] text-white/75 cursor-pointer">
              <input type="checkbox" defaultChecked={wl.isDefault} className="accent-[oklch(0.82_0.16_75)]" />
              SET AS DEFAULT
            </label>
            <button className="px-2 py-1 rounded-sm border border-white/15 text-[10.5px] uppercase tracking-[0.08em] text-white/75 hover:text-white hover:border-white/25">RENAME</button>
          </>
        )}
        <button className="px-2 py-1 rounded-sm border border-white/15 text-[10.5px] uppercase tracking-[0.08em] text-[oklch(0.74_0.17_28)] hover:bg-[oklch(0.72_0.18_28/0.08)]">DELETE</button>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar">
        {isLoading ? <WatchlistDetailLoading compact={compact} /> : (
          <>
            {/* SYMBOLS section */}
            <section className={`${compact ? 'px-3 py-4' : 'px-5 py-5'} border-b border-white/12`}>
              <div className="flex items-baseline gap-2 mb-3">
                <span className="text-[9.5px] uppercase tracking-[0.18em] text-[oklch(0.82_0.16_75)]">01</span>
                <h3 className="text-[12px] text-white font-medium uppercase tracking-[0.12em]">SYMBOLS</h3>
                <span className="text-[oklch(0.82_0.16_75/0.5)]">│</span>
                <span className="text-[10.5px] uppercase tracking-[0.08em] text-[oklch(0.78_0.12_200)]">COUNT <span className="text-white tabular-nums">{String(effSymbols.length).padStart(2,'0')}</span></span>
              </div>

              {/* chips + input */}
              <div className="flex flex-wrap gap-1.5 items-center">
                {effSymbols.map((s) => (
                  <SymbolChip key={s} sym={s} onRemove={(x) => setSymbols(symbols.filter((y) => y !== x))} />
                ))}
                <SymbolSearch query={query} setQuery={setQuery} onAdd={(s) => setSymbols([...new Set([...symbols, s])])} existing={effSymbols} />
              </div>

              {isEmpty && (
                <div className="mt-5 border border-dashed border-white/15 rounded-sm px-4 py-6 text-center">
                  <div className="text-[10px] uppercase tracking-[0.18em] text-[oklch(0.82_0.16_75)] mb-1.5">EMPTY LIST</div>
                  <p className="text-[12.5px] text-white/75">Type a ticker above to add your first symbol. Try <span className="text-[oklch(0.82_0.16_75)]">NVDA</span>, <span className="text-[oklch(0.82_0.16_75)]">AAPL</span>, <span className="text-[oklch(0.82_0.16_75)]">PLTR</span>.</p>
                </div>
              )}
            </section>

            {/* TODAY'S SIGNALS section */}
            <section className={`${compact ? 'px-3 py-4' : 'px-5 py-5'}`}>
              <div className="flex items-baseline gap-2 mb-3">
                <span className="text-[9.5px] uppercase tracking-[0.18em] text-[oklch(0.82_0.16_75)]">02</span>
                <h3 className="text-[12px] text-white font-medium uppercase tracking-[0.12em]">TODAY&apos;S SIGNALS</h3>
                <span className="text-[oklch(0.82_0.16_75/0.5)]">│</span>
                <span className="text-[10.5px] uppercase tracking-[0.08em] text-[oklch(0.78_0.12_200)]">HITS <span className={signals.length > 0 ? 'text-[oklch(0.78_0.16_150)]' : 'text-white/55'}>{String(signals.length).padStart(2,'0')}</span></span>
                <div className="flex-1" />
                <span className="text-[9.5px] uppercase tracking-[0.12em] text-white/55 hidden md:inline">FROM 09:15 NY SCAN</span>
              </div>

              {signals.length > 0 ? (
                <div className={`grid ${compact ? 'grid-cols-1' : 'grid-cols-3'} gap-3`}>
                  {signals.map((row) => <StockCard key={row.symbol} row={row} />)}
                </div>
              ) : (
                <div className="border border-dashed border-white/15 rounded-sm px-4 py-8 text-center">
                  <p className="text-[12.5px] text-white/65">
                    {effSymbols.length === 0
                      ? 'Add symbols above to see today\u2019s scan results filtered to this list.'
                      : 'None of these symbols hit today\u2019s scan. Daily alerts notify you when A+ setups appear.'}
                  </p>
                </div>
              )}
            </section>
          </>
        )}
      </div>

      <StatusBar compact={compact} count={effSymbols.length} variant={isLoading ? 'loading' : 'default'} />
    </div>
  );
}

function SymbolSearch({ query, setQuery, onAdd, existing }) {
  const [focused, setFocused] = React.useState(false);
  const universe = ['NVDA','AAPL','MSFT','GOOGL','META','AMZN','AMD','TSLA','AVGO','PLTR','NFLX','ORCL','CRM','ADBE','UBER','SHOP','SQ','DIS','BA','CAT','JPM','BAC','WFC','GS'];
  const candidates = query.length === 0 ? [] :
    universe.filter((s) => s.toLowerCase().includes(query.toLowerCase()) && !existing.includes(s)).slice(0, 5);
  return (
    <div className="relative">
      <div className="inline-flex items-center gap-1.5 pl-2 pr-1 py-1 rounded-sm border border-dashed border-white/22 hover:border-white/35 bg-[#0B0B0B]">
        <W3_Icons.Search size={11} stroke="oklch(0.82 0.16 75)" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value.toUpperCase())}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 120)}
          placeholder="ADD TICKER"
          className="bg-transparent text-[12px] text-white placeholder-white/40 outline-none w-[100px] uppercase tracking-[0.04em]"
        />
      </div>
      {focused && candidates.length > 0 && (
        <div className="absolute top-full left-0 mt-1 z-30 min-w-[140px] rounded-sm border border-white/22 bg-[#121212] shadow-2xl p-0.5">
          {candidates.map((s) => (
            <button
              key={s}
              onMouseDown={(e) => { e.preventDefault(); onAdd?.(s); setQuery(''); }}
              className="w-full flex items-center justify-between px-2 py-1 rounded-sm text-[12px] text-white hover:bg-[oklch(0.82_0.16_75/0.12)]"
            >
              <span className="text-[oklch(0.82_0.16_75)]">{s}</span>
              <span className="text-[9.5px] uppercase tracking-[0.1em] text-white/55">ENTER</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function WatchlistDetailLoading({ compact }) {
  return (
    <div className="animate-pulse">
      <section className={`${compact ? 'px-3 py-4' : 'px-5 py-5'} border-b border-white/12`}>
        <div className="h-3 w-28 rounded-sm bg-white/10 mb-4" />
        <div className="flex flex-wrap gap-1.5">
          {Array.from({ length: 8 }).map((_, i) => <div key={i} className="h-7 w-20 rounded-sm bg-white/8" />)}
        </div>
      </section>
      <section className={`${compact ? 'px-3 py-4' : 'px-5 py-5'}`}>
        <div className="h-3 w-32 rounded-sm bg-white/10 mb-4" />
        <div className={`grid ${compact ? 'grid-cols-1' : 'grid-cols-3'} gap-3`}>
          {Array.from({ length: compact ? 3 : 6 }).map((_, i) => (
            <div key={i} className="h-36 rounded-sm bg-white/5 border border-white/8" />
          ))}
        </div>
      </section>
    </div>
  );
}

Object.assign(window, { WatchlistsList, WatchlistDetail, SymbolChip });
