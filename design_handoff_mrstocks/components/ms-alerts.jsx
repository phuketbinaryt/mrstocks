// Screen 4 — Alerts (/alerts and /alerts/new)
// Props sketches at top of each component.

const { ALERT_RULES, STATES: W4_STATES, STATE_FILTERS: W4_STATE_FILTERS, ZONES: W4_ZONES, WATCHLISTS: W4_WATCHLISTS } = window.MS_DATA;
const W4_Icons = window.MS_Icons;

// ─── shared atoms: toggle, slider, chip-toggle ─────────────────────────────
function Toggle({ on, onChange, labelOn = 'ON', labelOff = 'OFF', size = 'sm' }) {
  return (
    <button
      onClick={() => onChange?.(!on)}
      role="switch"
      aria-checked={on}
      className={`inline-flex items-stretch border rounded-sm overflow-hidden text-[9.5px] uppercase tracking-[0.12em] ${
        on ? 'border-[oklch(0.82_0.16_75/0.6)]' : 'border-white/22'
      }`}
    >
      <span className={`px-1.5 ${size === 'sm' ? 'py-0.5' : 'py-1'} ${on ? 'bg-[oklch(0.82_0.16_75/0.18)] text-[oklch(0.82_0.16_75)]' : 'bg-white/4 text-white/55'}`}>{labelOn}</span>
      <span className={`px-1.5 ${size === 'sm' ? 'py-0.5' : 'py-1'} ${!on ? 'bg-white/10 text-white' : 'bg-transparent text-white/45'}`}>{labelOff}</span>
    </button>
  );
}

function ChipToggle({ active, onClick, dotColor, children }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-[11px] border transition-colors uppercase tracking-[0.04em] whitespace-nowrap ${
        active
          ? 'border-[oklch(0.82_0.16_75/0.55)] bg-[oklch(0.82_0.16_75/0.10)] text-white'
          : 'border-white/18 text-white/70 hover:text-white hover:border-white/30'
      }`}
    >
      {dotColor && <span className="h-1.5 w-1.5 rounded-full" style={{ background: dotColor }} />}
      {children}
      {active && <W4_Icons.X size={10} className="opacity-60" />}
    </button>
  );
}

function ScoreSlider({ value, onChange }) {
  const pct = value;
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between">
        <span className="text-[10px] uppercase tracking-[0.12em] text-[oklch(0.78_0.12_200)]">SCORE THRESHOLD</span>
        <span className="font-mono tabular-nums text-[18px] text-white">{value}<span className="text-white/50 text-[12px]">/100</span></span>
      </div>
      <div className="relative h-7">
        {/* track */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[3px] bg-white/10 rounded-sm" />
        {/* fill */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-[3px] rounded-sm" style={{ width: `${pct}%`, background: 'oklch(0.82 0.16 75)', boxShadow: '0 0 8px oklch(0.82 0.16 75 / 0.6)' }} />
        {/* tick marks at 60/75/90 */}
        {[60, 75, 90].map((t) => (
          <div key={t} className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-px h-2 bg-white/30" style={{ left: `${t}%` }} />
        ))}
        {/* thumb */}
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-4 w-2 bg-[oklch(0.82_0.16_75)] rounded-sm shadow-[0_0_10px_oklch(0.82_0.16_75)]" style={{ left: `${pct}%` }} />
        {/* invisible input */}
        <input
          type="range" min="0" max="100" value={value}
          onChange={(e) => onChange?.(+e.target.value)}
          className="absolute inset-0 w-full opacity-0 cursor-pointer"
          aria-label="Minimum score"
        />
      </div>
      <div className="flex justify-between text-[9.5px] uppercase tracking-[0.1em] text-white/45 tabular-nums">
        <span>0</span><span>C · 60</span><span>B · 75</span><span>A+ · 90</span><span>100</span>
      </div>
    </div>
  );
}

// ─── alert rule row ────────────────────────────────────────────────────────
function AlertRuleRow({ rule, compact, onToggle, onEdit }) {
  return (
    <div
      className={`border-b border-white/12 ${rule.enabled ? '' : 'opacity-55'} ${
        compact ? 'px-3 py-3.5' : 'px-5 py-4'
      } grid gap-y-2 ${
        compact
          ? 'grid-cols-[14px_minmax(0,1fr)_auto_auto]'
          : 'grid-cols-[14px_minmax(0,1fr)_180px_auto_auto]'
      } items-center gap-x-3`}
    >
      {/* enabled dot */}
      <span
        className={`row-span-1 h-1.5 w-1.5 rounded-full justify-self-center ${
          rule.enabled
            ? 'bg-[oklch(0.78_0.16_150)] shadow-[0_0_6px_oklch(0.78_0.16_150)]'
            : 'bg-white/25'
        }`}
      />
      {/* name */}
      <span className="text-[13.5px] text-white font-medium uppercase tracking-[0.04em] truncate">{rule.name}</span>
      {/* desktop only: stats column */}
      {!compact && (
        <div className="flex flex-col items-end text-[10px] uppercase tracking-[0.08em] leading-tight">
          <span className="text-white/55">LAST <span className="text-white tabular-nums">{rule.lastFired}</span></span>
          <span className="text-white/55">7D · <span className={rule.hitsWeek > 0 ? 'text-[oklch(0.78_0.16_150)]' : 'text-white/55'}>{String(rule.hitsWeek).padStart(2,'0')} HITS</span></span>
        </div>
      )}
      <Toggle on={rule.enabled} onChange={() => onToggle?.(rule.id)} />
      <button
        onClick={() => onEdit?.(rule.id)}
        className="px-2 py-1 rounded-sm border border-white/18 text-[10.5px] uppercase tracking-[0.1em] text-white/75 hover:text-white hover:border-white/35"
      >
        EDIT
      </button>

      {/* predicate row — spans across all columns under the header */}
      <div className={`${compact ? 'col-span-4' : 'col-span-5'} pl-[26px]`}>
        <PredicateLine rule={rule} />
      </div>

      {/* mobile only: stats footer */}
      {compact && (
        <div className="col-span-4 pl-[26px] flex items-center gap-2 text-[9.5px] uppercase tracking-[0.1em] text-white/55">
          <ChannelChips channels={rule.channels} />
          <span className="text-[oklch(0.82_0.16_75/0.5)]">·</span>
          <span>LAST <span className="text-white tabular-nums">{rule.lastFired}</span></span>
          <span className="text-[oklch(0.82_0.16_75/0.5)]">·</span>
          <span>7D <span className={rule.hitsWeek > 0 ? 'text-[oklch(0.78_0.16_150)]' : 'text-white/55'}>{String(rule.hitsWeek).padStart(2,'0')}</span></span>
        </div>
      )}
      {/* desktop only: channel chips footer (under the name column) */}
      {!compact && (
        <div className="col-span-5 pl-[26px]">
          <ChannelChips channels={rule.channels} />
        </div>
      )}
    </div>
  );
}

// One-line predicate: STATES · ZONE · WATCHLIST · ≥ SCORE
function PredicateLine({ rule }) {
  const stateLabels = rule.states.map((s, i) => (
    <React.Fragment key={s}>
      {i > 0 && <span className="text-white/45 mx-1.5">OR</span>}
      <span style={{ color: W4_STATES[s].tone }}>{W4_STATES[s].label}</span>
    </React.Fragment>
  ));
  const sep = <span className="text-[oklch(0.82_0.16_75/0.45)] mx-2">·</span>;
  return (
    <div className="text-[11px] uppercase tracking-[0.06em] leading-relaxed">
      {stateLabels}
      {sep}
      <span className="text-white">{rule.zones.join(' / ')}</span>
      {rule.watchlist && <>{sep}<span className="text-[oklch(0.78_0.12_200)]">{W4_WATCHLISTS.find((w) => w.id === rule.watchlist)?.name}</span></>}
      {sep}
      <span className="text-white/65">SCORE ≥ <span className="text-white tabular-nums">{rule.minScore}</span></span>
    </div>
  );
}

function ChannelChips({ channels }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      {channels.includes('email') && <span className="px-1.5 py-px rounded-sm border border-white/15 text-[9.5px] uppercase tracking-[0.1em] text-[oklch(0.78_0.12_200)]">EMAIL</span>}
      {channels.includes('push')  && <span className="px-1.5 py-px rounded-sm border border-white/15 text-[9.5px] uppercase tracking-[0.1em] text-[oklch(0.78_0.12_200)]">PUSH</span>}
    </span>
  );
}

// ─── alerts list view ──────────────────────────────────────────────────────
// props: { variant: 'default'|'empty'|'loading', layout: 'mobile'|'desktop' }
function AlertsList({ variant = 'default', layout = 'mobile' }) {
  const compact = layout === 'mobile';
  const [rules, setRules] = React.useState(ALERT_RULES);
  const onToggle = (id) => setRules(rules.map((r) => r.id === id ? { ...r, enabled: !r.enabled } : r));

  return (
    <div className="h-full w-full bg-black text-white flex flex-col overflow-hidden">
      <TopBar compact={compact} title="ALERTS" />
      <div className={`flex items-center gap-3 ${compact ? 'px-3 py-2.5' : 'px-5 py-3'} border-b border-white/12 bg-[#050505]`}>
        <span className="text-[9.5px] uppercase tracking-[0.18em] text-[oklch(0.82_0.16_75)]">ALL RULES</span>
        <span className="text-[oklch(0.82_0.16_75/0.5)]">│</span>
        <span className="text-[10.5px] uppercase tracking-[0.08em] text-[oklch(0.78_0.12_200)]">ACTIVE <span className="text-white tabular-nums">{String(rules.filter((r) => r.enabled).length).padStart(2,'0')}</span>/<span className="text-white">{String(rules.length).padStart(2,'0')}</span></span>
        <div className="flex-1" />
        <button className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm border border-[oklch(0.82_0.16_75/0.5)] bg-[oklch(0.82_0.16_75/0.12)] text-[oklch(0.82_0.16_75)] text-[10.5px] uppercase tracking-[0.1em] hover:bg-[oklch(0.82_0.16_75/0.2)]">
          + NEW RULE
        </button>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar">
        {variant === 'default' && rules.map((r) => <AlertRuleRow key={r.id} rule={r} compact={compact} onToggle={onToggle} />)}
        {variant === 'empty' && <AlertsEmpty compact={compact} />}
        {variant === 'loading' && <AlertsLoading compact={compact} />}
      </div>

      <StatusBar compact={compact} count={rules.filter((r) => r.enabled).length} variant={variant} />
    </div>
  );
}

function AlertsEmpty({ compact }) {
  return (
    <div className={`flex flex-col items-center text-center ${compact ? 'pt-16 px-6' : 'pt-24 px-12'}`}>
      <div className="h-14 w-14 rounded border border-white/15 bg-[#0B0B0B] grid place-items-center mb-5 text-[oklch(0.82_0.16_75)]">
        <W4_Icons.Bell size={20} />
      </div>
      <div className="text-[10px] uppercase tracking-[0.18em] text-[oklch(0.82_0.16_75)] mb-2">NO ALERTS YET</div>
      <h2 className="text-[18px] text-white font-medium tracking-tight max-w-[30ch] uppercase">Set a rule and we&apos;ll notify you when A+ setups match.</h2>
      <p className="text-[12.5px] text-white/70 mt-2 max-w-[44ch]">Combine setup states, prior45 zones, a watchlist, and a minimum score. Alerts fire from the 09:15 NY scan via email or web push.</p>
      <button className="mt-6 inline-flex items-center gap-2 px-3.5 py-2 rounded-sm border border-[oklch(0.82_0.16_75/0.5)] bg-[oklch(0.82_0.16_75/0.14)] text-[oklch(0.82_0.16_75)] text-[11px] uppercase tracking-[0.12em]">
        + NEW RULE
      </button>
    </div>
  );
}

function AlertsLoading({ compact }) {
  return (
    <div className="animate-pulse">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="border-b border-white/12 px-4 py-4 flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <div className="h-1.5 w-1.5 rounded-full bg-white/10" />
            <div className="h-3.5 w-40 rounded-sm bg-white/10" />
            <div className="ml-auto h-5 w-14 rounded-sm bg-white/8" />
            <div className="h-5 w-12 rounded-sm bg-white/8" />
          </div>
          <div className="flex gap-2 pl-4">
            <div className="h-2.5 w-16 rounded-sm bg-white/8" />
            <div className="h-2.5 w-20 rounded-sm bg-white/8" />
            <div className="h-2.5 w-24 rounded-sm bg-white/8" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── alert editor (new / edit) ─────────────────────────────────────────────
// props: { layout: 'mobile'|'desktop', initial?: AlertRule }
function AlertEditor({ layout = 'mobile', initial }) {
  const compact = layout === 'mobile';
  const [name, setName] = React.useState(initial?.name ?? '');
  const [states, setStates] = React.useState(initial?.states ?? ['narrow']);
  const [zones, setZones] = React.useState(initial?.zones ?? ['Inside']);
  const [watchlist, setWatchlist] = React.useState(initial?.watchlist ?? null);
  const [minScore, setMinScore] = React.useState(initial?.minScore ?? 85);
  const [email, setEmail] = React.useState((initial?.channels ?? ['email']).includes('email'));
  const [push, setPush] = React.useState((initial?.channels ?? ['email']).includes('push'));

  const toggleSet = (set, value) => set.includes(value) ? set.filter((x) => x !== value) : [...set, value];

  // mock preview: how many of today's results would have matched
  const matches = window.MS_DATA.SCAN_RESULTS.filter((r) =>
    states.includes(r.state) && zones.includes(r.zone) && r.score >= minScore
  ).length;

  return (
    <div className="h-full w-full bg-black text-white flex flex-col overflow-hidden">
      <TopBar compact={compact} title="ALERTS / NEW" />
      <div className={`flex items-center gap-3 ${compact ? 'px-3 h-11' : 'px-5 h-12'} border-b border-white/12 bg-[#050505]`}>
        <button aria-label="Back" className="-ml-1 p-1.5 rounded-sm text-white/75 hover:text-white hover:bg-white/10">
          <W4_Icons.ChevronLeft size={14} />
        </button>
        <span className="text-[10px] uppercase tracking-[0.14em] text-[oklch(0.82_0.16_75)]">RULE</span>
        <span className="text-[oklch(0.82_0.16_75/0.5)]">│</span>
        <span className="text-[13px] uppercase tracking-[0.06em] text-white font-medium truncate">{name || 'UNTITLED RULE'}</span>
        <div className="flex-1" />
        <span className="text-[10.5px] uppercase tracking-[0.08em] text-[oklch(0.78_0.12_200)] hidden md:inline">PREVIEW · MATCHES TODAY <span className={matches > 0 ? 'text-[oklch(0.78_0.16_150)]' : 'text-white/55'}>{String(matches).padStart(2,'0')}</span></span>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar pb-20">
        <div className={`${compact ? 'px-3' : 'px-5'} ${compact ? 'pt-4' : 'pt-5'} grid grid-cols-1 ${compact ? '' : 'md:grid-cols-12 gap-x-8'} gap-y-6`}>
          {/* LEFT / TOP COLUMN */}
          <div className={compact ? '' : 'md:col-span-8 flex flex-col gap-6'}>
            <FormSection eyebrow="01" title="NAME">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. A+ tech setups"
                className="w-full bg-[#0B0B0B] border border-white/22 focus:border-[oklch(0.82_0.16_75/0.7)] focus:outline-none rounded-sm px-3 py-2 text-[14px] text-white placeholder-white/35 tracking-[0.02em]"
              />
              <p className="text-[10.5px] text-white/55 mt-1.5 uppercase tracking-[0.08em]">SHOWN IN NOTIFICATIONS AND THE RULE LIST</p>
            </FormSection>

            <FormSection eyebrow="02" title="WHEN">
              <div className="flex flex-col gap-4">
                <SubLabel>SETUP STATES <Hint count={states.length} /></SubLabel>
                <div className="flex flex-wrap gap-1.5">
                  {W4_STATE_FILTERS.filter((s) => s.id !== 'all').map((s) => (
                    <ChipToggle
                      key={s.id}
                      active={states.includes(s.id)}
                      dotColor={W4_STATES[s.id]?.tone}
                      onClick={() => setStates(toggleSet(states, s.id))}
                    >{W4_STATES[s.id]?.label || s.label}</ChipToggle>
                  ))}
                </div>

                <SubLabel>PRIOR45 ZONES <Hint count={zones.length} /></SubLabel>
                <div className="flex flex-wrap gap-1.5">
                  {W4_ZONES.map((z) => (
                    <ChipToggle key={z} active={zones.includes(z)} onClick={() => setZones(toggleSet(zones, z))}>{z}</ChipToggle>
                  ))}
                </div>

                <SubLabel>WATCHLIST <span className="text-white/45 normal-case ml-1">(optional)</span></SubLabel>
                <div className="flex flex-wrap gap-1.5">
                  <ChipToggle active={watchlist === null} onClick={() => setWatchlist(null)}>ANY</ChipToggle>
                  {W4_WATCHLISTS.filter((w) => w.id !== 'all').map((w) => (
                    <ChipToggle key={w.id} active={watchlist === w.id} onClick={() => setWatchlist(w.id)}>{w.name}</ChipToggle>
                  ))}
                </div>

                <SubLabel>MIN SCORE</SubLabel>
                <ScoreSlider value={minScore} onChange={setMinScore} />
              </div>
            </FormSection>
          </div>

          {/* RIGHT / BOTTOM COLUMN */}
          <div className={compact ? '' : 'md:col-span-4 flex flex-col gap-6'}>
            <FormSection eyebrow="03" title="NOTIFY">
              <div className="flex flex-col gap-3">
                <ChannelRow label="EMAIL"     hint="DAILY DIGEST + INDIVIDUAL HITS"          on={email} onChange={setEmail} />
                <ChannelRow label="WEB PUSH"  hint="BROWSER NOTIFICATION ON HIT"             on={push}  onChange={setPush} />
              </div>
            </FormSection>

            <FormSection eyebrow="04" title="PREVIEW">
              <div className="border border-white/15 rounded-sm bg-[#0B0B0B] p-4 flex flex-col gap-3">
                <div className="flex items-baseline justify-between">
                  <span className="text-[10.5px] uppercase tracking-[0.1em] text-[oklch(0.78_0.12_200)]">MATCHES</span>
                  <span className="font-mono tabular-nums text-[28px] text-white">{String(matches).padStart(2,'0')}</span>
                </div>
                <p className="text-[11.5px] text-white/65 leading-relaxed">
                  {matches > 0
                    ? <>This rule would have triggered <span className="text-[oklch(0.78_0.16_150)]">{matches}</span> alert{matches === 1 ? '' : 's'} this morning.</>
                    : <>No matches today. Try lowering the score threshold or adding more states.</>
                  }
                </p>
              </div>
            </FormSection>
          </div>
        </div>
      </div>

      {/* sticky save/cancel bar */}
      <div className={`border-t-[1.5px] border-white/22 bg-black ${compact ? 'px-3 py-2.5' : 'px-5 py-3'} flex items-center gap-2`}>
        <span className="text-[10px] uppercase tracking-[0.1em] text-white/55 hidden md:inline">UNSAVED CHANGES</span>
        <div className="flex-1" />
        <button className="px-3 py-1.5 rounded-sm border border-white/22 text-[11px] uppercase tracking-[0.1em] text-white/75 hover:text-white hover:border-white/35">CANCEL</button>
        <button className="px-3.5 py-1.5 rounded-sm border border-[oklch(0.82_0.16_75/0.6)] bg-[oklch(0.82_0.16_75/0.18)] text-[oklch(0.82_0.16_75)] text-[11px] uppercase tracking-[0.12em] inline-flex items-center gap-1.5">
          SAVE RULE <span className="text-white/55">⏎</span>
        </button>
      </div>
    </div>
  );
}

function FormSection({ eyebrow, title, subtitle, children }) {
  return (
    <section>
      <div className="flex items-baseline gap-2 mb-3">
        <span className="text-[9.5px] uppercase tracking-[0.18em] text-[oklch(0.82_0.16_75)]">{eyebrow}</span>
        <h3 className="text-[12px] text-white font-medium uppercase tracking-[0.14em]">{title}</h3>
        {subtitle && <span className="text-[10.5px] text-white/55">— {subtitle}</span>}
      </div>
      {children}
    </section>
  );
}

function SubLabel({ children }) {
  return <div className="text-[10.5px] uppercase tracking-[0.1em] text-[oklch(0.78_0.12_200)] mb-1.5">{children}</div>;
}

function Hint({ count }) {
  return <span className="ml-1.5 text-white/55 text-[10px]">· {count} SELECTED</span>;
}

function ChannelRow({ label, hint, on, onChange }) {
  return (
    <div className="flex items-center justify-between gap-3 border border-white/15 rounded-sm bg-[#0B0B0B] px-3 py-2.5">
      <div className="flex flex-col">
        <span className="text-[12px] text-white font-medium uppercase tracking-[0.08em]">{label}</span>
        <span className="text-[10px] uppercase tracking-[0.08em] text-white/55">{hint}</span>
      </div>
      <Toggle on={on} onChange={onChange} size="md" />
    </div>
  );
}

Object.assign(window, { AlertsList, AlertEditor, ChipToggle, Toggle, ScoreSlider });
