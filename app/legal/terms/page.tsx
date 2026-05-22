import Nav from '@/components/marketing/Nav';
import Footer from '@/components/marketing/Footer';

export const metadata = { title: 'Terms — MR/STOCKS' };

export default function TermsPage() {
  return (
    <main className="bg-black text-white min-h-screen flex flex-col">
      <Nav />
      <section className="flex-1 max-w-[720px] w-full mx-auto px-4 md:px-6 py-10 md:py-16">
        <header className="mb-6 border-b border-white/12 pb-4">
          <span className="text-[10px] uppercase tracking-[0.22em] text-[oklch(0.82_0.16_75)]">
            LEGAL
          </span>
          <h1 className="uppercase tracking-tight text-white mt-2 text-[28px] md:text-[36px]">
            Terms of Service
          </h1>
          <p className="text-[11px] uppercase tracking-[0.12em] text-white/55 mt-2">
            LAST UPDATED · 22-MAY-2026
          </p>
        </header>

        <div className="flex flex-col gap-5 text-[13.5px] text-white/80 leading-relaxed">
          <p className="border border-amber-700/30 bg-amber-900/10 px-3 py-2 rounded-sm text-[12px] text-[oklch(0.82_0.16_75)] uppercase tracking-[0.08em]">
            PLACEHOLDER — Replace with your legal counsel&apos;s text before
            public launch.
          </p>
          <p>
            These Terms govern your access to and use of MR/STOCKS, a
            subscription-based pre-market stock-scanner service operated by
            MR/STOCKS LLC (&quot;we,&quot; &quot;us&quot;). By creating an
            account or subscribing you agree to be bound by these Terms.
          </p>
          <h2 className="text-[12px] uppercase tracking-[0.12em] text-white mt-3">
            01 · Eligibility
          </h2>
          <p>
            You must be 18 or older and able to enter into a binding contract
            to use the Service. The Service is provided for informational
            purposes only.
          </p>
          <h2 className="text-[12px] uppercase tracking-[0.12em] text-white mt-3">
            02 · Not Financial Advice
          </h2>
          <p>
            Nothing on this site constitutes financial, investment, or trading
            advice. Candidates surfaced by the scanner are signals from a
            pattern detector, not recommendations to buy or sell securities.
            You are solely responsible for your trading decisions.
          </p>
          <h2 className="text-[12px] uppercase tracking-[0.12em] text-white mt-3">
            03 · Subscriptions &amp; Billing
          </h2>
          <p>
            Subscriptions are processed by Whop on our behalf. Cancellations
            take effect at the end of the current billing period. Refunds are
            at our discretion.
          </p>
          <h2 className="text-[12px] uppercase tracking-[0.12em] text-white mt-3">
            04 · Disclaimers
          </h2>
          <p>
            The Service is provided &quot;as is&quot; without warranties of
            any kind. We do not guarantee uptime, accuracy of data, or
            absence of errors. Market data may be delayed.
          </p>
          <h2 className="text-[12px] uppercase tracking-[0.12em] text-white mt-3">
            05 · Limitation of Liability
          </h2>
          <p>
            To the maximum extent permitted by law, our aggregate liability
            shall not exceed the fees you paid in the 12 months preceding the
            claim.
          </p>
          <h2 className="text-[12px] uppercase tracking-[0.12em] text-white mt-3">
            06 · Contact
          </h2>
          <p>For questions about these Terms, email support@mrstocks.cash.</p>
        </div>
      </section>
      <Footer />
    </main>
  );
}
