// Screen 8 — Empty / error states gallery
// Showcases edge states the user listed plus a few related ones, all using the same visual language.

const W8_Icons = window.MS_Icons;

// ─── shared scaffold ───────────────────────────────────────────────────────
function StateCard({ tone = 'amber', icon, eyebrow, title, body, primary, secondary, statusLine }) {
  const colorMap = {
    amber: 'oklch(0.82 0.16 75)',
    red:   'oklch(0.74 0.17 28)',
    green: 'oklch(0.78 0.16 150)',
    cyan:  'oklch(0.78 0.12 200)',
    gray:  'oklch(0.65 0.01 250)',
  };
  const c = colorMap[tone];
  return (
    <div className="h-full w-full bg-black text-white flex flex-col">
      {/* mini header band so states look like they're in-app */}
      <div className="h-9 border-b border-white/12 px-4 flex items-center gap-3 bg-[#050505]">
        <span className="text-[9.5px] uppercase tracking-[0.18em]" style={{ color: c }}>{eyebrow}</span>
        {statusLine && <>
          <span className="text-[oklch(0.82_0.16_75/0.5)]">│</span>
          <span className="text-[10.5px] uppercase tracking-[0.08em] text-white/65">{statusLine}</span>
        </>}
      </div>
      <div className="flex-1 grid place-items-center px-6 py-10">
        <div className="flex flex-col items-center text-center max-w-[42ch]">
          <div className="relative mb-6">
            <div className="h-14 w-14 rounded-sm border border-white/15 bg-[#0B0B0B] grid place-items-center" style={{ color: c }}>
              {icon}
            </div>
            <div className="absolute -inset-3 rounded-sm pointer-events-none -z-10" style={{ background: `radial-gradient(circle, ${c.replace(')',' / 0.18)')} 0%, transparent 70%)` }} />
          </div>
          <h2 className="uppercase tracking-tight text-[22px] text-white">{title}</h2>
          <p className="text-[13px] text-white/75 leading-relaxed mt-3">{body}</p>
          {(primary || secondary) && (
            <div className="mt-7 flex items-center gap-2.5 flex-wrap justify-center">
              {primary && (
                <button
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-sm border text-[11px] uppercase tracking-[0.14em]"
                  style={{ borderColor: `${c.replace(')',' / 0.55)')}`, background: `${c.replace(')',' / 0.16)')}`, color: c }}
                >
                  {primary}
                </button>
              )}
              {secondary && (
                <button className="px-3.5 py-2 rounded-sm border border-white/22 bg-[#0B0B0B] text-white/75 hover:text-white hover:border-white/35 text-[11px] uppercase tracking-[0.14em]">{secondary}</button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── individual states ─────────────────────────────────────────────────────
function StateNoScan() {
  return (
    <StateCard
      tone="amber"
      eyebrow="NO SCAN YET"
      statusLine="OPENING SCANNER · IDLE"
      icon={<W8_Icons.Clock size={22} />}
      title="THE NEXT SCAN RUNS AT 09:15 NY."
      body={<>Today&apos;s results haven&apos;t generated yet — the scanner runs every market morning at <span className="text-[oklch(0.82_0.16_75)]">09:15&nbsp;NY</span>. We&apos;ll push a notification when A+ setups appear.</>}
      primary={<>NEXT SCAN · 07H 42M <W8_Icons.Clock size={11} /></>}
      secondary="YESTERDAY'S SCAN"
    />
  );
}

function StateSyncFailed() {
  return (
    <StateCard
      tone="red"
      eyebrow="SYNC FAILED"
      statusLine="DATA FEED · DEGRADED"
      icon={<W8_Icons.Refresh size={22} />}
      title="WE COULDN'T REACH THE SCANNER."
      body={<>The data feed didn&apos;t respond at 09:15 NY. Last successful scan was <span className="text-white">yesterday 09:17 NY</span>. We&apos;ll retry every 5 minutes until the market closes.</>}
      primary={<>RETRY NOW <W8_Icons.Refresh size={11} /></>}
      secondary="STATUS PAGE ↗"
    />
  );
}

function StateNoSubscription() {
  return (
    <StateCard
      tone="amber"
      eyebrow="LOCKED"
      statusLine="NO ACTIVE SUBSCRIPTION"
      icon={<W8_Icons.Sparkles size={22} />}
      title="SUBSCRIBE TO ACCESS THE OPENING SCANNER."
      body={<>You have an account but no active membership. Subscribe via <span className="text-[oklch(0.82_0.16_75)]">Whop</span> to unlock daily scans, watchlists, and A+ alerts. <span className="text-white">$29/mo · cancel anytime.</span></>}
      primary={<>SUBSCRIBE VIA WHOP <W8_Icons.ArrowUpRight size={11} /></>}
      secondary="PRICING ↗"
    />
  );
}

function StateWatchlistEmpty() {
  return (
    <StateCard
      tone="cyan"
      eyebrow="EMPTY LIST"
      statusLine="NEW WATCHLIST"
      icon={<W8_Icons.Inbox size={22} />}
      title="ADD YOUR FIRST SYMBOL."
      body={<>This watchlist is empty. Search to add tickers — try <span className="text-[oklch(0.82_0.16_75)]">NVDA</span>, <span className="text-[oklch(0.82_0.16_75)]">AAPL</span>, or <span className="text-[oklch(0.82_0.16_75)]">PLTR</span> to start.</>}
      primary={<>+ ADD SYMBOL</>}
      secondary="IMPORT CSV"
    />
  );
}

// extras —
function StatePushBlocked() {
  return (
    <StateCard
      tone="red"
      eyebrow="PUSH BLOCKED"
      statusLine="BROWSER PERMISSION · DENIED"
      icon={<W8_Icons.Bell size={22} />}
      title="WEB PUSH IS BLOCKED IN YOUR BROWSER."
      body="We can't send push notifications until you re-enable permission in your browser's site settings. Email alerts still work."
      primary={<>HOW TO FIX <W8_Icons.ArrowUpRight size={11} /></>}
      secondary="SWITCH TO EMAIL"
    />
  );
}

function StateMaintenance() {
  return (
    <StateCard
      tone="amber"
      eyebrow="MAINTENANCE"
      statusLine="SCHEDULED · 22-MAY 02:00 NY"
      icon={<W8_Icons.Filter size={22} />}
      title="BRIEF MAINTENANCE WINDOW."
      body="We're upgrading the scanner this Friday between 02:00–02:30 NY. The 09:15 scan will run normally; only the dashboard will be briefly read-only."
      primary="SUBSCRIBE TO STATUS"
      secondary="CHANGELOG"
    />
  );
}

// ─── full gallery grid ─────────────────────────────────────────────────────
function StatesGallery({ layout = 'desktop' }) {
  const states = [
    { id: 'no-scan',         label: 'Dashboard · no scan today',       comp: StateNoScan },
    { id: 'sync-failed',     label: 'Dashboard · sync failed',         comp: StateSyncFailed },
    { id: 'no-subscription', label: 'Account · no active subscription',comp: StateNoSubscription },
    { id: 'wl-empty',        label: 'Watchlist · empty list',          comp: StateWatchlistEmpty },
    { id: 'push-blocked',    label: 'Settings · push blocked',         comp: StatePushBlocked },
    { id: 'maintenance',     label: 'Banner · scheduled maintenance',  comp: StateMaintenance },
  ];
  const compact = layout === 'mobile';
  return (
    <div className="h-full w-full bg-black text-white overflow-y-auto no-scrollbar">
      <div className={`${compact ? 'px-3 py-4' : 'px-6 py-6'} border-b border-white/12`}>
        <div className="flex items-center gap-3">
          <span className="text-[9.5px] uppercase tracking-[0.18em] text-[oklch(0.82_0.16_75)]">STATES GALLERY</span>
          <span className="text-[oklch(0.82_0.16_75/0.5)]">│</span>
          <span className="text-[10.5px] uppercase tracking-[0.08em] text-white/70">{states.length} EDGE STATES · ONE VISUAL LANGUAGE</span>
        </div>
      </div>
      <div className={`grid ${compact ? 'grid-cols-1 gap-3 p-3' : 'grid-cols-2 gap-4 p-6'}`}>
        {states.map((s) => (
          <div key={s.id} className="border border-white/15 rounded-sm overflow-hidden">
            <div className="text-[9.5px] uppercase tracking-[0.18em] text-white/55 px-3 py-1.5 bg-[#050505] border-b border-white/10">{s.label}</div>
            <div style={{ height: compact ? 380 : 440 }}>
              <s.comp />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

Object.assign(window, { StatesGallery, StateNoScan, StateSyncFailed, StateNoSubscription, StateWatchlistEmpty, StatePushBlocked, StateMaintenance });
