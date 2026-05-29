import { ArrowUpRight } from 'lucide-react';
import HeroScanner from '@/components/marketing/HeroScanner';

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

        {/* RIGHT — animated streaming scanner log (reduced-motion: full log) */}
        <div className="h-[340px] md:h-[440px]">
          <HeroScanner />
        </div>
      </div>
    </section>
  );
}
