import { ArrowUpRight } from 'lucide-react';

export interface PricingProps {
  /** Whop hosted checkout URL — passed in from a server component so we
   *  don't import the server-only env from a client tree. */
  checkoutUrl: string;
}

export default function Pricing({ checkoutUrl }: PricingProps) {
  const features = [
    'All US large-cap candidates · daily',
    'Unlimited watchlists',
    'Unlimited alert rules · email + web push',
    'Historical scans · last 90 days',
    'Pre-market data — never delayed',
    'Cancel anytime · billed via Whop',
  ];

  return (
    <section
      id="pricing"
      className="px-4 md:px-8 py-10 md:py-16 border-y border-white/12 bg-[#050505]"
    >
      <div className="max-w-[640px] mx-auto text-center">
        <span className="text-[10px] uppercase tracking-[0.22em] text-[oklch(0.82_0.16_75)]">
          PRICING
        </span>
        <h2 className="uppercase tracking-tight text-white mt-3 text-[28px] md:text-[40px]">
          ONE PLAN. ONE PRICE.
        </h2>
      </div>
      <div
        className="max-w-[480px] mx-auto mt-8 border border-[oklch(0.82_0.16_75/0.4)] rounded-sm bg-[#0B0B0B] p-7"
        style={{ boxShadow: '0 0 60px oklch(0.82 0.16 75 / 0.1)' }}
      >
        <div className="flex items-baseline justify-between mb-1">
          <span className="text-[11px] uppercase tracking-[0.18em] text-[oklch(0.82_0.16_75)]">
            MEMBER
          </span>
          <span className="font-mono tabular-nums text-[42px] text-white leading-none">
            $29<span className="text-white/55 text-[18px]">/MO</span>
          </span>
        </div>
        <p className="text-[11.5px] uppercase tracking-[0.08em] text-white/55">
          FULL ACCESS · NO TIERS · NO ADD-ONS
        </p>
        <div className="h-px bg-white/12 my-5" />
        <ul className="flex flex-col gap-2.5">
          {features.map((f) => (
            <li
              key={f}
              className="flex items-start gap-2.5 text-[13px] text-white/85"
            >
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[oklch(0.78_0.16_150)] shadow-[0_0_4px_oklch(0.78_0.16_150)] shrink-0" />
              {f}
            </li>
          ))}
        </ul>
        <a
          href={checkoutUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 w-full inline-flex items-center justify-center gap-2 px-3.5 py-3 rounded-sm border border-[oklch(0.82_0.16_75/0.6)] bg-[oklch(0.82_0.16_75/0.20)] text-[oklch(0.82_0.16_75)] text-[13px] uppercase tracking-[0.14em] hover:bg-[oklch(0.82_0.16_75/0.30)]"
        >
          SUBSCRIBE VIA WHOP <ArrowUpRight size={13} />
        </a>
        <p className="text-center mt-3 text-[10px] uppercase tracking-[0.12em] text-white/45">
          SECURE CHECKOUT · CARDS · APPLE PAY · CRYPTO
        </p>
      </div>
    </section>
  );
}
