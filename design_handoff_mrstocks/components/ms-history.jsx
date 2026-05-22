// Screen 5 — History (/history and /history/[date])
// Calendar month heatmap. Each day cell colored by candidate density.

const W5_Icons = window.MS_Icons;

// ─── deterministic mock history for May 2026 ───────────────────────────────
// (today = May 20 per the system clock). Weekends omitted from scan, future days empty.
const MAY_2026 = (() => {
  // year, month, day, count (null = weekend, undefined = future), aplus, fired
  const data = [
    { d: 1,  count: 27, aplus: 2, fired: 1 },
    { d: 4,  count: 41, aplus: 5, fired: 3 },
    { d: 5,  count: 36, aplus: 4, fired: 2 },
    { d: 6,  count: 18, aplus: 1, fired: 0 },
    { d: 7,  count: 22, aplus: 2, fired: 1 },
    { d: 8,  count: 51, aplus: 7, fired: 5 },
    { d: 11, count: 33, aplus: 3, fired: 2 },
    { d: 12, count: 47, aplus: 6, fired: 4 },
    { d: 13, count: 29, aplus: 2, fired: 1 },
    { d: 14, count: 38, aplus: 4, fired: 3 },
    { d: 15, count: 12, aplus: 0, fired: 0 },
    { d: 18, count: 44, aplus: 6, fired: 4 },
    { d: 19, count: 56, aplus: 8, fired: 6 },
    { d: 20, count: 47, aplus: 7, fired: 5 }, // today
  ];
  const byDay = Object.fromEntries(data.map((r) => [r.d, r]));
  // build full month: May 2026 has 31 days, May 1 is Friday (verified)
  // dayOfWeek: 0=Sun..6=Sat → May 1, 2026 = Friday = 5
  const startDow = 5;
  const daysInMonth = 31;
  const month = [];
  for (let d = 1; d <= daysInMonth; d++) {
    const dow = (startDow + d - 1) % 7;
    const isWeekend = dow === 0 || dow === 6;
    const isFuture = d > 20;
    const r = byDay[d];
    month.push({
      d, dow, isWeekend, isFuture,
      isToday: d === 20,
      count: r?.count ?? (isWeekend ? null : (isFuture ? null : 0)),
      aplus: r?.aplus ?? 0,
      fired: r?.fired ?? 0,
    });
  }
  return month;
})();

// ─── heatmap color scale (single-hue amber) ────────────────────────────────
function heatStyle(count, isToday, isFuture, isWeekend) {
  if (isFuture)  return { background: '#080808', color: 'rgba(255,255,255,0.18)', border: '1px solid rgba(255,255,255,0.06)' };
  if (isWeekend) return { background: '#060606', color: 'rgba(255,255,255,0.18)', border: '1px solid rgba(255,255,255,0.05)' };
  if (count == null) return { background: '#060606', color: 'rgba(255,255,255,0.18)', border: '1px solid rgba(255,255,255,0.05)' };
  // bucket: 0 / 1-15 / 16-30 / 31-45 / 46+
  let bg, fg = '#fff';
  if (count === 0)      { bg = '#0C0C0C'; fg = 'rgba(255,255,255,0.4)'; }
  else if (count <= 15) bg = 'oklch(0.24 0.06 75)';
  else if (count <= 30) bg = 'oklch(0.36 0.10 75)';
  else if (count <= 45) bg = 'oklch(0.52 0.14 75)';
  else                  bg = 'oklch(0.68 0.16 75)';
  const border = isToday ? '1.5px solid oklch(0.82 0.16 75)' : '1px solid rgba(255,255,255,0.10)';
  const shadow = isToday ? '0 0 12px oklch(0.82 0.16 75 / 0.55)' : 'none';
  return { background: bg, color: fg, border, boxShadow: shadow };
}

function HeatLegend() {
  const stops = [
    { lbl: '0',     bg: '#0C0C0C' },
    { lbl: '1-15',  bg: 'oklch(0.24 0.06 75)' },
    { lbl: '16-30', bg: 'oklch(0.36 0.10 75)' },
    { lbl: '31-45', bg: 'oklch(0.52 0.14 75)' },
    { lbl: '46+',   bg: 'oklch(0.68 0.16 75)' },
  ];
  return (
    <div className="inline-flex items-center gap-2 text-[9.5px] uppercase tracking-[0.1em] text-white/55">
      <span>FEWER</span>
      <div className="flex gap-px">
        {stops.map((s) => <span key={s.lbl} className="h-3 w-5 border border-white/10" style={{ background: s.bg }} title={s.lbl} />)}
      </div>
      <span>MORE</span>
    </div>
  );
}

// ─── calendar grid ─────────────────────────────────────────────────────────
function CalendarGrid({ month = MAY_2026, compact, onPick, selected }) {
  // Add leading blank cells so day 1 lands in the right column (Mon-first week)
  const firstDow = month[0].dow; // Sun=0..Sat=6
  // Use Mon-first: shift so Monday=0, Sunday=6
  const monStart = (firstDow + 6) % 7;
  const blanks = Array.from({ length: monStart }, (_, i) => ({ blank: true, k: 'b' + i }));
  const cells = [...blanks, ...month];

  return (
    <div className={`grid grid-cols-7 ${compact ? 'gap-1' : 'gap-1.5'}`}>
      {/* dow header */}
      {['MON','TUE','WED','THU','FRI','SAT','SUN'].map((dow) => (
        <div key={dow} className={`text-center text-[9px] uppercase tracking-[0.18em] text-white/45 ${compact ? 'pb-1' : 'pb-2'}`}>{dow}</div>
      ))}
      {cells.map((c, i) =>
        c.blank
          ? <div key={c.k} />
          : (
            <button
              key={c.d}
              onClick={() => onPick?.(c.d)}
              disabled={c.isFuture || c.isWeekend}
              className={`relative ${compact ? 'aspect-square' : 'aspect-[1.1/1]'} rounded-sm p-1.5 text-left transition-shadow ${(c.isFuture || c.isWeekend) ? 'cursor-default' : 'hover:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.25)] cursor-pointer'} ${selected === c.d ? 'ring-1 ring-[oklch(0.82_0.16_75)] ring-offset-1 ring-offset-black' : ''}`}
              style={heatStyle(c.count, c.isToday, c.isFuture, c.isWeekend)}
            >
              <div className="flex items-start justify-between text-[9.5px] tabular-nums">
                <span className="leading-none opacity-80">{String(c.d).padStart(2,'0')}</span>
                {c.isToday && <span className="text-[8px] uppercase tracking-[0.1em] leading-none px-1 py-px rounded-sm bg-black/60 text-[oklch(0.82_0.16_75)]">NOW</span>}
                {c.aplus > 0 && !c.isToday && (
                  <span className="inline-flex gap-0.5">
                    {Array.from({ length: Math.min(c.aplus, 3) }).map((_, k) => (
                      <span key={k} className="h-1 w-1 rounded-full bg-white/85" />
                    ))}
                  </span>
                )}
              </div>
              {c.count != null && !c.isWeekend && !c.isFuture && (
                <div className={`absolute inset-x-0 ${compact ? 'bottom-1' : 'bottom-2'} text-center`}>
                  <div className={`font-mono tabular-nums ${compact ? 'text-[15px]' : 'text-[20px]'} leading-none ${c.count >= 31 ? 'text-white' : 'text-white/85'}`}>
                    {c.count > 0 ? c.count : '·'}
                  </div>
                </div>
              )}
              {c.isWeekend && <div className="absolute inset-0 grid place-items-center text-[9.5px] uppercase tracking-[0.1em] text-white/30">—</div>}
              {c.isFuture && <div className="absolute inset-0 grid place-items-center text-[9.5px] uppercase tracking-[0.12em] text-white/22">·</div>}
            </button>
          )
      )}
    </div>
  );
}

// ─── stats panel ───────────────────────────────────────────────────────────
function MonthStats({ month = MAY_2026 }) {
  const scanned = month.filter((c) => !c.isWeekend && !c.isFuture);
  const totals = scanned.reduce((acc, c) => ({
    cands: acc.cands + (c.count || 0),
    aplus: acc.aplus + (c.aplus || 0),
    fired: acc.fired + (c.fired || 0),
    days:  acc.days + (c.count != null ? 1 : 0),
  }), { cands: 0, aplus: 0, fired: 0, days: 0 });
  const peak = scanned.reduce((p, c) => (c.count > p.count ? c : p), { count: 0, d: 0 });
  const avg = totals.days > 0 ? (totals.cands / totals.days).toFixed(1) : '0';

  return (
    <div className="border border-white/12 rounded-sm bg-[#0B0B0B] divide-y divide-white/12">
      <StatRow label="DAYS SCANNED" value={`${totals.days}/${scanned.length + month.filter((c) => c.isFuture).length}`} hint="MAY 2026" />
      <StatRow label="TOTAL CANDIDATES" value={String(totals.cands)} hint="CUMULATIVE" />
      <StatRow label="AVG PER DAY" value={avg} hint="ALL CANDIDATES" />
      <StatRow label="A+ HITS" value={String(totals.aplus)} hint="SCORE ≥ 90" tone="oklch(0.78 0.16 150)" />
      <StatRow label="ALERTS FIRED" value={String(totals.fired)} hint="DELIVERED · EMAIL / PUSH" />
      <StatRow label="PEAK DAY" value={`${String(peak.d).padStart(2,'0')}-MAY`} hint={`${peak.count} CANDIDATES`} tone="oklch(0.82 0.16 75)" />
    </div>
  );
}

function StatRow({ label, value, hint, tone }) {
  return (
    <div className="flex items-center justify-between gap-3 px-3.5 py-2.5">
      <div className="flex flex-col">
        <span className="text-[10px] uppercase tracking-[0.12em] text-[oklch(0.78_0.12_200)]">{label}</span>
        <span className="text-[9.5px] uppercase tracking-[0.08em] text-white/45">{hint}</span>
      </div>
      <span className="font-mono tabular-nums text-[18px]" style={{ color: tone || '#fff' }}>{value}</span>
    </div>
  );
}

// ─── history page ──────────────────────────────────────────────────────────
// props: { variant: 'default'|'empty'|'loading'|'detail', layout: 'mobile'|'desktop' }
function HistoryView({ variant = 'default', layout = 'mobile' }) {
  const compact = layout === 'mobile';
  const [selected, setSelected] = React.useState(20);

  if (variant === 'detail') return <HistoryDay date="2026-05-19" layout={layout} />;

  return (
    <div className="h-full w-full bg-black text-white flex flex-col overflow-hidden">
      <TopBar compact={compact} title="HISTORY" />

      {/* month nav */}
      <div className={`flex items-center gap-3 ${compact ? 'px-3 py-2.5' : 'px-5 py-3'} border-b border-white/12 bg-[#050505]`}>
        <button className="inline-flex items-center justify-center w-7 h-7 rounded-sm border border-white/15 text-white/75 hover:text-white hover:border-white/30" aria-label="Previous month">
          <W5_Icons.ChevronLeft size={14} />
        </button>
        <span className="text-[13px] uppercase tracking-[0.14em] text-white font-medium">MAY 2026</span>
        <button className="inline-flex items-center justify-center w-7 h-7 rounded-sm border border-white/15 text-white/55 hover:text-white hover:border-white/30" aria-label="Next month" disabled>
          <W5_Icons.ChevronRight size={14} />
        </button>
        <span className="text-[oklch(0.82_0.16_75/0.5)] mx-1">│</span>
        <button className="text-[10.5px] uppercase tracking-[0.1em] text-white/65 hover:text-white">JUMP TO TODAY</button>
        <div className="flex-1" />
        {!compact && <HeatLegend />}
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar">
        {variant === 'default' && (
          <div className={`${compact ? 'px-3 py-4' : 'px-5 py-5'} flex flex-col gap-5`}>
            <div className={compact ? '' : 'grid grid-cols-[1fr_280px] gap-6'}>
              <CalendarGrid compact={compact} onPick={setSelected} selected={selected} />
              {!compact && <MonthStats />}
            </div>
            {compact && <MonthStats />}
            {compact && <HeatLegend />}

            {selected && <SelectedDayCard d={selected} compact={compact} />}
          </div>
        )}
        {variant === 'empty' && <HistoryEmpty compact={compact} />}
        {variant === 'loading' && <HistoryLoading compact={compact} />}
      </div>

      <StatusBar compact={compact} count={MAY_2026.filter((c) => !c.isWeekend && !c.isFuture && c.count > 0).length} variant={variant === 'loading' ? 'loading' : 'default'} />
    </div>
  );
}

function SelectedDayCard({ d, compact }) {
  const day = MAY_2026.find((c) => c.d === d);
  if (!day || day.isWeekend || day.isFuture) return null;
  const dow = ['SUN','MON','TUE','WED','THU','FRI','SAT'][day.dow];
  return (
    <div className="border border-white/15 rounded-sm bg-[#0B0B0B] p-4 flex items-center gap-4">
      <div className="flex flex-col leading-tight">
        <span className="text-[9.5px] uppercase tracking-[0.14em] text-[oklch(0.82_0.16_75)]">{dow}</span>
        <span className="font-mono tabular-nums text-[28px] text-white">{String(day.d).padStart(2,'0')}-MAY</span>
      </div>
      <div className="h-10 w-px bg-white/15" />
      <Stat lbl="CANDIDATES" v={String(day.count).padStart(2,'0')} />
      <Stat lbl="A+ HITS"    v={String(day.aplus).padStart(2,'0')} tone="oklch(0.78 0.16 150)" />
      <Stat lbl="ALERTS"     v={String(day.fired).padStart(2,'0')} tone="oklch(0.82 0.16 75)" />
      <div className="flex-1" />
      <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm border border-[oklch(0.82_0.16_75/0.5)] bg-[oklch(0.82_0.16_75/0.12)] text-[oklch(0.82_0.16_75)] text-[11px] uppercase tracking-[0.12em] hover:bg-[oklch(0.82_0.16_75/0.2)]">
        OPEN SCAN <W5_Icons.ChevronRight size={11} />
      </button>
    </div>
  );
}

function Stat({ lbl, v, tone }) {
  return (
    <div className="flex flex-col leading-tight">
      <span className="text-[9px] uppercase tracking-[0.12em] text-white/55">{lbl}</span>
      <span className="font-mono tabular-nums text-[18px]" style={{ color: tone || '#fff' }}>{v}</span>
    </div>
  );
}

function HistoryEmpty({ compact }) {
  return (
    <div className={`flex flex-col items-center text-center ${compact ? 'pt-16 px-6' : 'pt-24 px-12'}`}>
      <div className="h-14 w-14 rounded border border-white/15 bg-[#0B0B0B] grid place-items-center mb-5 text-[oklch(0.82_0.16_75)]">
        <W5_Icons.Clock size={20} />
      </div>
      <div className="text-[10px] uppercase tracking-[0.18em] text-[oklch(0.82_0.16_75)] mb-2">NO HISTORY YET</div>
      <h2 className="text-[18px] text-white font-medium tracking-tight max-w-[34ch] uppercase">Your first scans will populate the heatmap.</h2>
      <p className="text-[12.5px] text-white/70 mt-2 max-w-[44ch]">Each market morning we save the day&apos;s candidates here. After ~5 trading days you&apos;ll start to see your personal scan-density pattern.</p>
    </div>
  );
}

function HistoryLoading({ compact }) {
  return (
    <div className={`${compact ? 'px-3 py-4' : 'px-5 py-5'} flex flex-col gap-5 animate-pulse`}>
      <div className="grid grid-cols-7 gap-1.5">
        {Array.from({ length: 7 }).map((_, i) => <div key={i} className="h-3 rounded-sm bg-white/8" />)}
        {Array.from({ length: 35 }).map((_, i) => (
          <div key={i} className="aspect-square rounded-sm bg-white/5 border border-white/8" />
        ))}
      </div>
    </div>
  );
}

// ─── day detail (history/[date]) ───────────────────────────────────────────
// Reuses the Dashboard but the secondary header shows the historical date.
function HistoryDay({ date = '2026-05-19', layout = 'mobile' }) {
  const compact = layout === 'mobile';
  return (
    <div className="h-full w-full bg-black text-white flex flex-col overflow-hidden">
      <TopBar compact={compact} title="HISTORY" generatedAt={'19-MAY 09:15 NY · ARCHIVE'} nextScan="—" />
      <div className={`flex items-center gap-3 ${compact ? 'px-3 py-2.5' : 'px-5 py-3'} border-b border-white/12 bg-[#050505]`}>
        <button aria-label="Back to calendar" className="-ml-1 p-1.5 rounded-sm text-white/75 hover:text-white hover:bg-white/10">
          <W5_Icons.ChevronLeft size={14} />
        </button>
        <span className="text-[9.5px] uppercase tracking-[0.16em] text-[oklch(0.82_0.16_75)]">ARCHIVE</span>
        <span className="text-[oklch(0.82_0.16_75/0.5)]">│</span>
        <span className="text-[13px] uppercase tracking-[0.06em] text-white font-medium">TUE · 19-MAY 2026</span>
        <span className="text-[oklch(0.82_0.16_75/0.5)]">│</span>
        <span className="text-[10.5px] uppercase tracking-[0.08em] text-[oklch(0.78_0.12_200)]">CAND <span className="text-white tabular-nums">56</span></span>
        <span className="text-[oklch(0.82_0.16_75/0.5)]">│</span>
        <span className="text-[10.5px] uppercase tracking-[0.08em] text-[oklch(0.78_0.12_200)]">A+ <span className="text-[oklch(0.78_0.16_150)] tabular-nums">08</span></span>
        <div className="flex-1" />
        <button className="text-[10.5px] uppercase tracking-[0.1em] text-white/65 hover:text-white inline-flex items-center gap-1">← PREV</button>
        <button className="text-[10.5px] uppercase tracking-[0.1em] text-white/65 hover:text-white inline-flex items-center gap-1">NEXT →</button>
      </div>
      <div className="flex-1 overflow-y-auto no-scrollbar">
        <div className={`grid ${compact ? 'grid-cols-1' : 'grid-cols-3'} gap-3 p-4`}>
          {window.MS_DATA.SCAN_RESULTS.map((r) => <StockCard key={r.symbol} row={r} />)}
        </div>
      </div>
      <StatusBar compact={compact} count={56} variant="default" />
    </div>
  );
}

Object.assign(window, { HistoryView, HistoryDay, CalendarGrid, MAY_2026 });
