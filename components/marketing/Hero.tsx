import { ArrowUpRight } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative overflow-hidden px-4 md:px-8 pt-8 md:pt-16 pb-8 md:pb-12">
      {/* faint grid background */}
      <div
        className="absolute inset-0 opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />
      {/* amber glow */}
      <div
        className="absolute -top-40 left-1/4 h-[460px] w-[700px] rounded-full pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, oklch(0.82 0.16 75 / 0.18) 0%, transparent 60%)',
        }}
      />

      <div className="relative max-w-[1240px] mx-auto grid grid-cols-1 md:grid-cols-[1.05fr_1fr] items-center gap-8 md:gap-12">
        {/* LEFT — copy + CTAs */}
        <div className="flex flex-col">
          <span className="inline-flex self-start items-center gap-2 px-3 py-1 rounded-sm border border-white/15 bg-[#0B0B0B] mb-6">
            <span className="h-1.5 w-1.5 rounded-full bg-[oklch(0.82_0.16_75)] shadow-[0_0_6px_oklch(0.82_0.16_75)]" />
            <span className="text-[10.5px] uppercase tracking-[0.18em] text-[oklch(0.82_0.16_75)]">
              OPENING SCANNER · v2.4
            </span>
          </span>

          <h1 className="uppercase tracking-[-0.01em] leading-[0.94] text-[42px] md:text-[68px] text-white">
            PRE-MARKET <br />
            <span className="text-[oklch(0.82_0.16_75)]">SIGNALS.</span>
            <br />
            EVERY MARKET <br />
            MORNING. <span className="text-white/50">BEFORE YOU LOG IN.</span>
          </h1>

          <p className="mt-6 text-white/75 leading-relaxed text-[14px] md:text-[16px] max-w-[54ch]">
            We scan ~500 US large-caps every market morning at{' '}
            <span className="text-[oklch(0.82_0.16_75)]">09:15&nbsp;NY</span>, surface the tight
            SMA20 × SMA200 setups, and push them to you before the open. No charts. No noise.
            Just the candidates.
          </p>

          <div className="mt-7 flex items-center gap-3 flex-wrap">
            <a
              href="#pricing"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-sm border border-[oklch(0.82_0.16_75/0.6)] bg-[oklch(0.82_0.16_75/0.18)] text-[oklch(0.82_0.16_75)] text-[12px] uppercase tracking-[0.14em] hover:bg-[oklch(0.82_0.16_75/0.28)]"
            >
              SUBSCRIBE · $29/MO <ArrowUpRight size={12} />
            </a>
            <a
              href="#method"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-sm border border-white/22 bg-[#0B0B0B] text-white text-[12px] uppercase tracking-[0.14em] hover:border-white/35"
            >
              HOW IT WORKS
            </a>
          </div>

          <div className="mt-6 flex items-center gap-3 text-[10.5px] uppercase tracking-[0.12em] text-white/55 flex-wrap">
            <span>
              <span className="text-white tabular-nums">2,140</span> MEMBERS
            </span>
            <span className="text-[oklch(0.82_0.16_75/0.5)]">·</span>
            <span>CANCEL ANYTIME</span>
            <span className="text-[oklch(0.82_0.16_75/0.5)]">·</span>
            <span>BILLED VIA WHOP</span>
          </div>
        </div>

        {/* RIGHT — static scanner-log preview (animated version arrives in a later phase) */}
        <ScannerLogStatic />
      </div>
    </section>
  );
}

/**
 * Static counterpart of the design's animated HeroScanner. Renders a fixed
 * "completed" log inside a bordered black card with a steady amber cursor.
 * Phase-3 (or whenever the dashboard data exists) will replace this with the
 * streaming version.
 */
function ScannerLogStatic() {
  const lines = [
    { ts: '09:14:58', body: 'SYS INIT scanner v2.4', tone: 'white/65' },
    { ts: '09:14:59', body: 'LOAD UNIVERSE us-lrg · 503 symbols', tone: 'white/65' },
    { ts: '09:15:00', body: 'EVAL NVDA → NARROW · SCORE 100 [PASS]', tone: 'amber' },
    { ts: '09:15:01', body: 'EVAL AAPL → NARROW · SCORE 96  [PASS]', tone: 'amber' },
    { ts: '09:15:02', body: 'EVAL MSFT → TRENDING · SCORE 94 [PASS]', tone: 'green' },
    { ts: '09:15:03', body: 'EVAL GOOGL → NARROW · SCORE 92 [PASS]', tone: 'amber' },
    { ts: '09:15:04', body: 'EVAL META → WIDE SNAPBACK · SCORE 88 [PASS]', tone: 'cyan' },
    { ts: '09:15:04', body: '... 487/503 evaluated', tone: 'white/45' },
    { ts: '09:15:05', body: 'RULES MATCH · 12 candidates', tone: 'green' },
    { ts: '09:15:05', body: 'PUSH · email + web push dispatched', tone: 'amber' },
    { ts: '09:15:05', body: 'READY · dashboard live', tone: 'green' },
  ];

  const colorFor = (tone: string): string => {
    switch (tone) {
      case 'amber':
        return 'oklch(0.82 0.16 75)';
      case 'cyan':
        return 'oklch(0.78 0.12 200)';
      case 'green':
        return 'oklch(0.78 0.16 150)';
      case 'white/45':
        return 'rgba(255,255,255,0.45)';
      case 'white/65':
      default:
        return 'rgba(255,255,255,0.65)';
    }
  };

  return (
    <div className="h-[340px] md:h-[440px] border border-white/15 rounded-sm bg-[#050505] overflow-hidden">
      <div className="flex items-center gap-2 px-3 h-7 border-b border-white/10 bg-[#080808]">
        <span className="h-1.5 w-1.5 rounded-full bg-[oklch(0.78_0.16_150)] shadow-[0_0_6px_oklch(0.78_0.16_150)]" />
        <span className="text-[10.5px] uppercase tracking-[0.12em] text-[oklch(0.78_0.16_150)]">
          LIVE LOG · 20-MAY
        </span>
        <span className="ml-auto text-[10px] uppercase tracking-[0.12em] text-white/45">
          SCANNER V2.4
        </span>
      </div>
      <div className="px-4 py-4 text-[11.5px] md:text-[12.5px] leading-[1.7] font-mono">
        {lines.map((l, i) => (
          <div key={i} className="flex items-start gap-3">
            <span className="text-white/35 tabular-nums">{l.ts}</span>
            <span className="text-[oklch(0.82_0.16_75/0.4)]">│</span>
            <span style={{ color: colorFor(l.tone) }}>{l.body}</span>
          </div>
        ))}
        <div className="mt-2 flex items-center gap-2">
          <span className="text-[oklch(0.82_0.16_75)] animate-pulse">▌</span>
        </div>
      </div>
    </div>
  );
}
