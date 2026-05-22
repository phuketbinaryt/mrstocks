import { ChevronDown } from 'lucide-react';

export default function FAQ() {
  const items = [
    {
      q: 'WHAT IS A "TIGHT POWER-ZONE" SETUP?',
      a: 'A configuration where the 20-period and 200-period SMAs on 2-minute bars are within a small ATR-normalized distance. Tightness is graded into states (NARROW, WIDE SNAPBACK, TRENDING, etc.).',
    },
    {
      q: 'DO YOU OFFER A FREE TRIAL?',
      a: 'Not currently. We bill via Whop with monthly cancellation — your second month is paid only if you keep it after seeing a full week of scans.',
    },
    {
      q: 'WHICH SYMBOLS ARE SCANNED?',
      a: 'Around 500 US large-caps with sufficient pre-market liquidity. The eligible universe is fixed and rebalanced quarterly.',
    },
    {
      q: 'IS THIS FINANCIAL ADVICE?',
      a: 'No. We surface candidates. You decide whether to trade them. Past performance is not indicative of future results.',
    },
  ];

  return (
    <section id="faq" className="px-4 md:px-8 py-10 md:py-16">
      <div className="max-w-[760px] mx-auto">
        <div className="mb-8">
          <span className="text-[10px] uppercase tracking-[0.22em] text-[oklch(0.82_0.16_75)]">
            FAQ
          </span>
          <h2 className="uppercase tracking-tight text-white mt-3 text-[24px] md:text-[32px]">
            QUESTIONS, BEFORE YOU SUBSCRIBE
          </h2>
        </div>
        <div className="border border-white/12 rounded-sm bg-[#0B0B0B] divide-y divide-white/10">
          {items.map((it) => (
            <details key={it.q} className="group">
              <summary className="cursor-pointer list-none px-4 py-3.5 flex items-center justify-between gap-3 hover:bg-white/4">
                <span className="text-[12px] uppercase tracking-[0.06em] text-white">{it.q}</span>
                <span className="text-[oklch(0.82_0.16_75)] group-open:rotate-180 transition-transform">
                  <ChevronDown size={14} />
                </span>
              </summary>
              <div className="px-4 pb-4 text-[13px] text-white/75 leading-relaxed">{it.a}</div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
