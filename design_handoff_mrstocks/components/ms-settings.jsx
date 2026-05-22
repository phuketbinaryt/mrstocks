// Screen 6 — Settings (/settings)
// Sections: Profile · Notifications · Subscription · Sign out

const W6_Icons = window.MS_Icons;

// ─── shared row primitives ─────────────────────────────────────────────────
function SettingsSection({ eyebrow, title, hint, children }) {
  return (
    <section className="border border-white/12 rounded-sm bg-[#0B0B0B]">
      <header className="px-4 py-3 border-b border-white/12 flex items-baseline gap-2.5">
        <span className="text-[9.5px] uppercase tracking-[0.18em] text-[oklch(0.82_0.16_75)]">{eyebrow}</span>
        <h3 className="text-[12px] text-white font-medium uppercase tracking-[0.14em]">{title}</h3>
        {hint && <span className="text-[10.5px] text-white/55 ml-1">— {hint}</span>}
      </header>
      <div className="divide-y divide-white/10">{children}</div>
    </section>
  );
}

function SettingsRow({ label, hint, children }) {
  return (
    <div className="px-4 py-3.5 flex items-center justify-between gap-4">
      <div className="flex flex-col min-w-0">
        <span className="text-[12px] text-white uppercase tracking-[0.08em]">{label}</span>
        {hint && <span className="text-[10.5px] text-white/55 mt-0.5">{hint}</span>}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

function SettingsField({ label, hint, children }) {
  return (
    <div className="px-4 py-3.5 flex flex-col gap-1.5">
      <div className="flex items-baseline gap-2">
        <span className="text-[10.5px] text-[oklch(0.78_0.12_200)] uppercase tracking-[0.1em]">{label}</span>
        {hint && <span className="text-[10px] text-white/55">— {hint}</span>}
      </div>
      {children}
    </div>
  );
}

function Input({ value, onChange, placeholder, disabled, after }) {
  return (
    <div className="flex items-stretch border border-white/22 focus-within:border-[oklch(0.82_0.16_75/0.7)] rounded-sm bg-[#080808] overflow-hidden">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className="flex-1 bg-transparent px-3 py-2 text-[13px] text-white placeholder-white/35 outline-none disabled:text-white/60"
      />
      {after && <div className="flex items-center px-2 border-l border-white/15 bg-white/4">{after}</div>}
    </div>
  );
}

function RadioRow({ value, current, onPick, title, hint }) {
  const on = value === current;
  return (
    <button
      onClick={() => onPick?.(value)}
      className={`w-full text-left flex items-start gap-3 px-4 py-3 border-b border-white/8 last:border-b-0 ${on ? 'bg-[oklch(0.82_0.16_75/0.06)]' : 'hover:bg-white/4'}`}
    >
      <span className={`mt-0.5 h-3.5 w-3.5 rounded-full border ${on ? 'border-[oklch(0.82_0.16_75)]' : 'border-white/35'} grid place-items-center`}>
        {on && <span className="h-1.5 w-1.5 rounded-full bg-[oklch(0.82_0.16_75)] shadow-[0_0_6px_oklch(0.82_0.16_75)]" />}
      </span>
      <div className="flex flex-col">
        <span className={`text-[12px] uppercase tracking-[0.06em] ${on ? 'text-white' : 'text-white/85'}`}>{title}</span>
        {hint && <span className="text-[10.5px] text-white/55 mt-0.5">{hint}</span>}
      </div>
    </button>
  );
}

// ─── settings page ─────────────────────────────────────────────────────────
function SettingsView({ variant = 'default', layout = 'mobile', pushState = 'pending' }) {
  // pushState: 'pending' (default) | 'enabled' | 'denied'
  const compact = layout === 'mobile';
  const [displayName, setDisplayName] = React.useState('Leo Mendez');
  const [emailFreq, setEmailFreq] = React.useState('per_hit');
  const [push, setPush] = React.useState(pushState);

  if (variant === 'loading') {
    return (
      <div className="h-full w-full bg-black text-white flex flex-col overflow-hidden">
        <TopBar compact={compact} title="SETTINGS" />
        <SettingsHeader compact={compact} />
        <div className={`flex-1 overflow-y-auto no-scrollbar p-${compact ? 3 : 5} space-y-5 animate-pulse`}>
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="border border-white/10 rounded-sm bg-[#0B0B0B]">
              <div className="h-9 border-b border-white/10 px-4 flex items-center"><div className="h-3 w-32 bg-white/10 rounded-sm" /></div>
              {Array.from({ length: 3 }).map((_, j) => (
                <div key={j} className="px-4 py-3.5 border-b border-white/8 last:border-b-0 flex justify-between">
                  <div className="h-3 w-28 bg-white/8 rounded-sm" />
                  <div className="h-7 w-40 bg-white/8 rounded-sm" />
                </div>
              ))}
            </div>
          ))}
        </div>
        <StatusBar compact={compact} count={0} variant="loading" />
      </div>
    );
  }

  return (
    <div className="h-full w-full bg-black text-white flex flex-col overflow-hidden">
      <TopBar compact={compact} title="SETTINGS" />
      <SettingsHeader compact={compact} />
      <div className="flex-1 overflow-y-auto no-scrollbar">
        <div className={`mx-auto ${compact ? 'px-3 py-4' : 'px-5 py-6 max-w-[760px]'} flex flex-col gap-5`}>

          {/* PROFILE */}
          <SettingsSection eyebrow="01" title="PROFILE">
            <SettingsField label="ACCOUNT EMAIL" hint="USED FOR LOGIN AND ALERT DELIVERY">
              <Input
                value="leo.mendez@protonmail.com"
                disabled
                after={<button className="text-[10.5px] uppercase tracking-[0.1em] text-[oklch(0.82_0.16_75)] hover:text-white px-1">CHANGE</button>}
              />
            </SettingsField>
            <SettingsField label="DISPLAY NAME" hint="SHOWN ON YOUR AVATAR">
              <Input value={displayName} onChange={setDisplayName} />
            </SettingsField>
            <SettingsField label="TIMEZONE">
              <Input value="America/New_York · GMT-04:00" disabled after={<button className="text-[10.5px] uppercase tracking-[0.1em] text-[oklch(0.82_0.16_75)] hover:text-white px-1">EDIT</button>} />
            </SettingsField>
          </SettingsSection>

          {/* NOTIFICATIONS */}
          <SettingsSection eyebrow="02" title="NOTIFICATIONS">
            <SettingsField label="EMAIL FREQUENCY" hint="HOW OFTEN WE EMAIL WHEN RULES MATCH">
              <div className="border border-white/15 rounded-sm bg-[#080808] overflow-hidden">
                <RadioRow value="digest"  current={emailFreq} onPick={setEmailFreq}
                  title="DAILY DIGEST"   hint="One email at 09:30 NY with all morning hits" />
                <RadioRow value="per_hit" current={emailFreq} onPick={setEmailFreq}
                  title="PER HIT"        hint="Email immediately when any rule matches" />
                <RadioRow value="off"     current={emailFreq} onPick={setEmailFreq}
                  title="OFF"            hint="No email — only in-app and web push" />
              </div>
            </SettingsField>

            <SettingsField label="WEB PUSH" hint="BROWSER NOTIFICATION ON RULE MATCH">
              <PushControl state={push} onChange={setPush} />
            </SettingsField>
          </SettingsSection>

          {/* SUBSCRIPTION */}
          <SettingsSection eyebrow="03" title="SUBSCRIPTION">
            <div className="px-4 py-4 flex items-start gap-4 flex-wrap">
              <div className="flex flex-col gap-1 min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-sm border border-[oklch(0.78_0.16_150/0.55)] bg-[oklch(0.78_0.16_150/0.10)]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[oklch(0.78_0.16_150)] shadow-[0_0_6px_oklch(0.78_0.16_150)]" />
                    <span className="text-[10px] uppercase tracking-[0.14em] text-[oklch(0.78_0.16_150)]">ACTIVE</span>
                  </span>
                  <span className="text-[10.5px] uppercase tracking-[0.08em] text-white/55">SINCE 12-MAR 2026</span>
                </div>
                <div className="font-mono tabular-nums text-[22px] text-white leading-tight">MEMBER · $29<span className="text-white/55 text-[14px]">/MO</span></div>
                <div className="text-[10.5px] uppercase tracking-[0.08em] text-white/65">RENEWS 12-JUN 2026 · BILLED VIA WHOP</div>
              </div>
              <button className="inline-flex items-center gap-1.5 px-3 py-2 rounded-sm border border-[oklch(0.82_0.16_75/0.5)] bg-[oklch(0.82_0.16_75/0.12)] text-[oklch(0.82_0.16_75)] text-[11px] uppercase tracking-[0.12em] hover:bg-[oklch(0.82_0.16_75/0.2)]">
                MANAGE BILLING <W6_Icons.ArrowUpRight size={11} />
              </button>
            </div>
            <div className="px-4 py-3 flex items-center justify-between gap-3 text-[10.5px] uppercase tracking-[0.08em] text-white/65">
              <span>NEXT INVOICE · $29.00 · 12-JUN 2026</span>
              <a className="text-[oklch(0.78_0.12_200)] hover:text-white inline-flex items-center gap-1 cursor-pointer">VIEW INVOICES <W6_Icons.ArrowUpRight size={10} /></a>
            </div>
          </SettingsSection>

          {/* SIGN OUT */}
          <section className="flex items-center gap-3 pt-2">
            <button className="px-3.5 py-2 rounded-sm border border-white/15 bg-[#0B0B0B] text-[11px] uppercase tracking-[0.12em] text-white/75 hover:text-white hover:border-white/30">
              SIGN OUT
            </button>
            <button className="px-3.5 py-2 rounded-sm border border-[oklch(0.72_0.18_28/0.5)] bg-[oklch(0.72_0.18_28/0.08)] text-[11px] uppercase tracking-[0.12em] text-[oklch(0.74_0.17_28)] hover:bg-[oklch(0.72_0.18_28/0.15)]">
              DELETE ACCOUNT
            </button>
            <div className="flex-1" />
            <span className="text-[10px] uppercase tracking-[0.1em] text-white/45 hidden md:inline">SCANNER V2.4 · BUILD 26.05.20</span>
          </section>

        </div>
      </div>
      <StatusBar compact={compact} count={0} variant="default" />
    </div>
  );
}

function SettingsHeader({ compact }) {
  return (
    <div className={`flex items-center gap-3 ${compact ? 'px-3 py-2.5' : 'px-5 py-3'} border-b border-white/12 bg-[#050505]`}>
      <span className="text-[9.5px] uppercase tracking-[0.18em] text-[oklch(0.82_0.16_75)]">ACCOUNT</span>
      <span className="text-[oklch(0.82_0.16_75/0.5)]">│</span>
      <span className="text-[10.5px] uppercase tracking-[0.08em] text-white/75">LEO MENDEZ <span className="text-white/45">· leo.mendez@protonmail.com</span></span>
      <div className="flex-1" />
      <span className="text-[10.5px] uppercase tracking-[0.08em] text-[oklch(0.78_0.16_150)] hidden md:inline">ALL CHANGES SAVED</span>
    </div>
  );
}

function PushControl({ state, onChange }) {
  if (state === 'enabled') {
    return (
      <div className="flex items-center justify-between gap-3 border border-[oklch(0.78_0.16_150/0.4)] rounded-sm bg-[oklch(0.78_0.16_150/0.06)] px-3 py-2.5">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-[oklch(0.78_0.16_150)] shadow-[0_0_6px_oklch(0.78_0.16_150)]" />
          <span className="text-[12px] uppercase tracking-[0.08em] text-white">PUSH ENABLED · CHROME · MACBOOK PRO</span>
        </div>
        <button onClick={() => onChange?.('pending')} className="text-[10.5px] uppercase tracking-[0.1em] text-white/65 hover:text-[oklch(0.74_0.17_28)] px-2 py-1 rounded-sm border border-white/15">DISABLE</button>
      </div>
    );
  }
  if (state === 'denied') {
    return (
      <div className="flex items-center justify-between gap-3 border border-[oklch(0.72_0.18_28/0.4)] rounded-sm bg-[oklch(0.72_0.18_28/0.06)] px-3 py-2.5">
        <div className="flex items-center gap-2 min-w-0">
          <span className="h-1.5 w-1.5 rounded-full bg-[oklch(0.74_0.17_28)]" />
          <div className="flex flex-col min-w-0">
            <span className="text-[12px] uppercase tracking-[0.08em] text-white">BLOCKED IN BROWSER</span>
            <span className="text-[10.5px] text-white/65 truncate">Re-enable in site settings to receive web push.</span>
          </div>
        </div>
        <button className="text-[10.5px] uppercase tracking-[0.1em] text-[oklch(0.82_0.16_75)] hover:text-white px-2 py-1 rounded-sm border border-[oklch(0.82_0.16_75/0.5)]">HOW TO FIX</button>
      </div>
    );
  }
  // pending — show "Enable" button
  return (
    <div className="flex items-center justify-between gap-3 border border-white/15 rounded-sm bg-[#080808] px-3 py-2.5">
      <div className="flex items-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full bg-white/35" />
        <span className="text-[12px] uppercase tracking-[0.08em] text-white/75">NOT ENABLED</span>
      </div>
      <button
        onClick={() => onChange?.('enabled')}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm border border-[oklch(0.82_0.16_75/0.5)] bg-[oklch(0.82_0.16_75/0.12)] text-[oklch(0.82_0.16_75)] text-[11px] uppercase tracking-[0.12em] hover:bg-[oklch(0.82_0.16_75/0.2)]"
      >
        <W6_Icons.Bell size={11} /> ENABLE PUSH
      </button>
    </div>
  );
}

Object.assign(window, { SettingsView, PushControl });
