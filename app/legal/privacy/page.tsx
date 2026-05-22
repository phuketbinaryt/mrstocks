import Nav from '@/components/marketing/Nav';
import Footer from '@/components/marketing/Footer';

export const metadata = { title: 'Privacy — MR/STOCKS' };

export default function PrivacyPage() {
  return (
    <main className="bg-black text-white min-h-screen flex flex-col">
      <Nav />
      <section className="flex-1 max-w-[720px] w-full mx-auto px-4 md:px-6 py-10 md:py-16">
        <header className="mb-6 border-b border-white/12 pb-4">
          <span className="text-[10px] uppercase tracking-[0.22em] text-[oklch(0.82_0.16_75)]">
            LEGAL
          </span>
          <h1 className="uppercase tracking-tight text-white mt-2 text-[28px] md:text-[36px]">
            Privacy Policy
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
            This Privacy Policy describes how MR/STOCKS LLC (&quot;we&quot;)
            collects, uses, and shares information about you when you use the
            Service.
          </p>

          <h2 className="text-[12px] uppercase tracking-[0.12em] text-white mt-3">
            01 · Information We Collect
          </h2>
          <p>
            Account info (email, sign-in metadata) when you create an
            account. Subscription &amp; billing info processed by Whop. Usage
            data (page views, feature interactions) to improve the product.
          </p>

          <h2 className="text-[12px] uppercase tracking-[0.12em] text-white mt-3">
            02 · How We Use It
          </h2>
          <p>
            To authenticate you, gate paid features, send transactional
            email, and improve the Service. We do not sell your personal
            information.
          </p>

          <h2 className="text-[12px] uppercase tracking-[0.12em] text-white mt-3">
            03 · Sharing
          </h2>
          <p>
            With subprocessors we use to operate the Service (Whop, Resend,
            our hosting provider). We require contracts that limit their use
            of your data to providing services to us.
          </p>

          <h2 className="text-[12px] uppercase tracking-[0.12em] text-white mt-3">
            04 · Your Rights
          </h2>
          <p>
            You may request access, correction, or deletion of your data by
            emailing privacy@mrstocks.cash.
          </p>

          <h2 className="text-[12px] uppercase tracking-[0.12em] text-white mt-3">
            05 · Contact
          </h2>
          <p>For privacy questions, email privacy@mrstocks.cash.</p>
        </div>
      </section>
      <Footer />
    </main>
  );
}
