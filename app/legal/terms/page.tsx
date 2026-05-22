import Nav from '@/components/marketing/Nav';
import Footer from '@/components/marketing/Footer';

export const metadata = { title: 'Terms — MR/STOCKS' };

export default function TermsPage() {
  return (
    <main className="bg-black text-white min-h-screen flex flex-col">
      <Nav />
      <section className="flex-1 max-w-[760px] w-full mx-auto px-4 md:px-6 py-10 md:py-16">
        <header className="mb-6 border-b border-white/12 pb-4">
          <span className="text-[10px] uppercase tracking-[0.22em] text-[oklch(0.82_0.16_75)]">
            LEGAL
          </span>
          <h1 className="uppercase tracking-tight text-white mt-2 text-[28px] md:text-[36px]">
            Terms of Service
          </h1>
          <p className="text-[11px] uppercase tracking-[0.12em] text-white/55 mt-2">
            LAST UPDATED · 23-MAY-2026
          </p>
        </header>

        <div className="flex flex-col gap-5 text-[13.5px] text-white/80 leading-relaxed">
          <p className="border border-white/15 bg-[#0B0B0B] px-3 py-2 rounded-sm text-[11.5px] text-white/70 leading-relaxed">
            These Terms are provided by MR/STOCKS LLC as the initial public
            terms for the Service. They are intended to be reasonable and
            workable for v1 launch. They are not a substitute for counsel-
            reviewed terms tailored to your jurisdiction; we recommend a
            qualified attorney review them before relying on them for any
            material dispute.
          </p>
          <p>
            These Terms of Service (&quot;Terms&quot;) govern your access to
            and use of the MR/STOCKS pre-market stock-scanner service (the
            &quot;Service&quot;) operated by MR/STOCKS LLC
            (&quot;we,&quot; &quot;us,&quot; &quot;our&quot;). By creating
            an account, subscribing, or otherwise using the Service, you
            (&quot;you&quot;) agree to be bound by these Terms. If you do
            not agree, do not use the Service.
          </p>

          <h2 className="text-[12px] uppercase tracking-[0.12em] text-white mt-3">
            01 · Service description
          </h2>
          <p>
            The Service ingests US equity market data and produces a
            curated list of pre-market trading candidates, organized by
            volatility and mean-reversion setup states. Output is delivered
            via the website at mrstocks.cash, optional email notifications,
            and optional browser push notifications. The Service is
            provided for informational and educational purposes only.
          </p>

          <h2 className="text-[12px] uppercase tracking-[0.12em] text-white mt-3">
            02 · Eligibility
          </h2>
          <p>
            You must be at least 18 years old and capable of entering into
            a binding contract under the laws of your jurisdiction. The
            Service is not directed at minors. You are responsible for
            ensuring that your use of the Service is lawful where you
            reside.
          </p>

          <h2 className="text-[12px] uppercase tracking-[0.12em] text-white mt-3">
            03 · Not financial advice
          </h2>
          <p>
            Nothing on the Service constitutes financial, investment,
            trading, tax, or legal advice. Candidates surfaced by the
            scanner are pattern-based signals produced by software; they
            are not recommendations to buy, sell, or hold any security.
            Past performance does not guarantee future results. You alone
            are responsible for evaluating whether any candidate or trade
            idea is suitable for your account, your risk tolerance, and
            your objectives.
          </p>
          <p>
            <strong className="text-white">Trading involves risk of loss</strong>
            , including the loss of your entire investment. Leveraged and
            options trading carry materially higher risk.
          </p>

          <h2 className="text-[12px] uppercase tracking-[0.12em] text-white mt-3" id="subscriptions">
            04 · Subscriptions &amp; billing
          </h2>
          <p>
            Paid features of the Service are sold on a recurring
            subscription basis. Subscriptions are processed by Whop, Inc.
            (&quot;Whop&quot;), our third-party payments provider. You
            authorize Whop to charge your designated payment method at the
            interval specified at checkout (monthly or annual) until you
            cancel.
          </p>
          <p>
            Cancellations take effect at the end of the then-current
            billing period; your access continues until that date. You can
            cancel at any time from your account settings or directly via
            Whop.
          </p>

          <h2 className="text-[12px] uppercase tracking-[0.12em] text-white mt-3" id="refunds">
            05 · Refunds
          </h2>
          <p>
            All subscription fees are non-refundable except where required
            by applicable law. We may, in our sole discretion, issue
            refunds or credits on a case-by-case basis (for example, in
            the event of a prolonged Service outage). Submit refund
            requests to <a href="mailto:support@mrstocks.cash" className="text-[oklch(0.82_0.16_75)] underline">support@mrstocks.cash</a>.
          </p>

          <h2 className="text-[12px] uppercase tracking-[0.12em] text-white mt-3">
            06 · Acceptable use
          </h2>
          <p>
            You agree not to: (a) share your account credentials or
            sublicense Service output to third parties; (b) scrape,
            redistribute, or republish the scanner output in bulk for
            commercial purposes; (c) reverse engineer the Service except
            to the extent permitted by law; (d) use the Service to
            facilitate market manipulation, wash trading, or any other
            unlawful conduct; or (e) interfere with the operation or
            integrity of the Service.
          </p>

          <h2 className="text-[12px] uppercase tracking-[0.12em] text-white mt-3">
            07 · Intellectual property
          </h2>
          <p>
            The Service, including its scanner logic, ranking model,
            UI, and content, is owned by MR/STOCKS LLC and protected by
            applicable IP laws. We grant you a limited, non-exclusive,
            non-transferable, revocable license to use the Service for
            personal, non-commercial trading research while your
            subscription is active.
          </p>

          <h2 className="text-[12px] uppercase tracking-[0.12em] text-white mt-3" id="disclaimers">
            08 · Disclaimers
          </h2>
          <p>
            THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS
            AVAILABLE&quot;, WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR
            IMPLIED, INCLUDING WITHOUT LIMITATION WARRANTIES OF
            MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE,
            NON-INFRINGEMENT, OR ACCURACY OF DATA. WE DO NOT WARRANT THAT
            THE SERVICE WILL BE UNINTERRUPTED, TIMELY, SECURE, OR
            ERROR-FREE. MARKET DATA MAY BE DELAYED OR INACCURATE.
          </p>

          <h2 className="text-[12px] uppercase tracking-[0.12em] text-white mt-3">
            09 · Limitation of liability
          </h2>
          <p>
            TO THE MAXIMUM EXTENT PERMITTED BY LAW, MR/STOCKS LLC, ITS
            OFFICERS, EMPLOYEES, AND AFFILIATES SHALL NOT BE LIABLE FOR
            ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE
            DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, ARISING OUT OF OR
            IN CONNECTION WITH YOUR USE OF THE SERVICE, EVEN IF ADVISED OF
            THE POSSIBILITY OF SUCH DAMAGES. OUR AGGREGATE LIABILITY UNDER
            THESE TERMS SHALL NOT EXCEED THE FEES YOU PAID US IN THE
            TWELVE (12) MONTHS PRECEDING THE EVENT GIVING RISE TO THE
            CLAIM.
          </p>

          <h2 className="text-[12px] uppercase tracking-[0.12em] text-white mt-3">
            10 · Indemnification
          </h2>
          <p>
            You agree to indemnify and hold harmless MR/STOCKS LLC and its
            affiliates from any claims, damages, liabilities, costs, or
            expenses (including reasonable attorneys&apos; fees) arising
            from your use of the Service, your trading decisions, or your
            breach of these Terms.
          </p>

          <h2 className="text-[12px] uppercase tracking-[0.12em] text-white mt-3">
            11 · Termination
          </h2>
          <p>
            We may suspend or terminate your access at any time, with or
            without cause, including for breach of these Terms. You may
            terminate by canceling your subscription and deleting your
            account. Sections 03, 05, 07, 08, 09, 10, 12, and 13 survive
            termination.
          </p>

          <h2 className="text-[12px] uppercase tracking-[0.12em] text-white mt-3">
            12 · Changes to these Terms
          </h2>
          <p>
            We may update these Terms from time to time. Material changes
            will be communicated by email and/or via a notice on the
            Service at least seven (7) days before they take effect. Your
            continued use of the Service after the effective date
            constitutes acceptance of the updated Terms.
          </p>

          <h2 className="text-[12px] uppercase tracking-[0.12em] text-white mt-3">
            13 · Governing law &amp; dispute resolution
          </h2>
          <p>
            These Terms are governed by the laws of the State of Delaware,
            without regard to its conflict-of-law provisions. Any dispute
            arising under these Terms shall be resolved by binding
            arbitration administered by JAMS in Wilmington, Delaware,
            except that either party may seek injunctive relief in a court
            of competent jurisdiction to protect its intellectual property.
          </p>

          <h2 className="text-[12px] uppercase tracking-[0.12em] text-white mt-3">
            14 · Contact
          </h2>
          <p>
            For questions about these Terms, email{' '}
            <a
              href="mailto:support@mrstocks.cash"
              className="text-[oklch(0.82_0.16_75)] underline"
            >
              support@mrstocks.cash
            </a>
            .
          </p>
        </div>
      </section>
      <Footer />
    </main>
  );
}
