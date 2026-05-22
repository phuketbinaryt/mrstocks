import Nav from '@/components/marketing/Nav';
import Footer from '@/components/marketing/Footer';

export const metadata = { title: 'Privacy — MR/STOCKS' };

export default function PrivacyPage() {
  return (
    <main className="bg-black text-white min-h-screen flex flex-col">
      <Nav />
      <section className="flex-1 max-w-[760px] w-full mx-auto px-4 md:px-6 py-10 md:py-16">
        <header className="mb-6 border-b border-white/12 pb-4">
          <span className="text-[10px] uppercase tracking-[0.22em] text-[oklch(0.82_0.16_75)]">
            LEGAL
          </span>
          <h1 className="uppercase tracking-tight text-white mt-2 text-[28px] md:text-[36px]">
            Privacy Policy
          </h1>
          <p className="text-[11px] uppercase tracking-[0.12em] text-white/55 mt-2">
            LAST UPDATED · 23-MAY-2026
          </p>
        </header>

        <div className="flex flex-col gap-5 text-[13.5px] text-white/80 leading-relaxed">
          <p className="border border-white/15 bg-[#0B0B0B] px-3 py-2 rounded-sm text-[11.5px] text-white/70 leading-relaxed">
            This Privacy Policy describes our actual data-handling
            practices as of the last-updated date. It is intended to be
            accurate, plain-language, and conservative. It is not a
            substitute for counsel-reviewed terms — we recommend a
            qualified attorney review before relying on this for any
            material compliance question (GDPR, CCPA, etc.).
          </p>

          <p>
            This Privacy Policy describes how MR/STOCKS LLC
            (&quot;we,&quot; &quot;us,&quot; &quot;our&quot;) collects,
            uses, stores, and shares information about you in connection
            with the MR/STOCKS pre-market stock-scanner service (the
            &quot;Service&quot;).
          </p>

          <h2 className="text-[12px] uppercase tracking-[0.12em] text-white mt-3">
            01 · Information we collect
          </h2>
          <p>
            <strong className="text-white">Account information.</strong>{' '}
            When you create an account, we collect your email address and
            sign-in metadata (timestamps, IP at sign-in). If you connect
            via Whop, we also receive your Whop user ID and (optionally)
            your Whop username and profile picture.
          </p>
          <p>
            <strong className="text-white">Subscription and billing.</strong>{' '}
            All payments are processed by Whop, Inc. We do not collect or
            store your full payment card number; Whop returns a
            subscription / membership ID and status which we store to gate
            paid features.
          </p>
          <p>
            <strong className="text-white">Product usage.</strong>{' '}
            We store your watchlists, alert rules, push-notification
            endpoints (if you enable browser push), and basic usage data
            (e.g. which scans you viewed) so the Service can render your
            personalized dashboard. We do not store individual click-event
            telemetry beyond what is necessary to render the product.
          </p>
          <p>
            <strong className="text-white">Server logs.</strong>{' '}
            Our application servers retain request logs (timestamp, IP,
            URL path, status code) for up to 30 days for security and
            debugging.
          </p>
          <p>
            <strong className="text-white">Error reports.</strong>{' '}
            If we have enabled error reporting (Sentry), uncaught
            exceptions and their associated request context (URL, user ID,
            stack trace) are sent to Sentry, Inc. We do not enable
            Sentry&apos;s default PII collection.
          </p>

          <h2 className="text-[12px] uppercase tracking-[0.12em] text-white mt-3">
            02 · How we use your information
          </h2>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>To authenticate you and provide the Service.</li>
            <li>To gate paid features based on your subscription status.</li>
            <li>To send transactional email (magic-link sign-in, alert notifications).</li>
            <li>To deliver browser push notifications you have opted into.</li>
            <li>To diagnose bugs and improve the Service.</li>
            <li>To comply with legal obligations and enforce our Terms.</li>
          </ul>
          <p>
            We do <strong className="text-white">not</strong> sell your
            personal information. We do not use your data to train
            third-party advertising models.
          </p>

          <h2 className="text-[12px] uppercase tracking-[0.12em] text-white mt-3">
            03 · How your data is stored
          </h2>
          <p>
            Your account data lives in a PostgreSQL database hosted on
            Hetzner Cloud servers located in Germany (EU). The same servers
            host the Next.js application and the BullMQ background worker.
            Encryption-at-rest is provided by the underlying disk.
          </p>

          <h2 className="text-[12px] uppercase tracking-[0.12em] text-white mt-3">
            04 · Third-party subprocessors
          </h2>
          <p>The following third parties receive data necessary to operate the Service:</p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>
              <strong className="text-white">Whop, Inc.</strong> —
              payments, subscription management, and (optional) OAuth
              sign-in. They receive your email, Whop user ID, and payment
              method data per their own terms.
            </li>
            <li>
              <strong className="text-white">Resend, Inc.</strong> —
              outbound transactional email (magic-link, alerts). They
              receive your email address and the message body.
            </li>
            <li>
              <strong className="text-white">Hetzner Online GmbH</strong> —
              cloud server hosting (EU).
            </li>
            <li>
              <strong className="text-white">Sentry, Inc.</strong> (if
              enabled) — error monitoring. They receive uncaught-exception
              stack traces and the associated user ID + request path.
            </li>
            <li>
              <strong className="text-white">Browser push providers</strong>{' '}
              (e.g. Mozilla, Apple, Google) — receive opaque push payloads
              when you have opted into browser notifications.
            </li>
          </ul>
          <p>
            We require each subprocessor by contract to limit their use
            of your data to providing services to us.
          </p>

          <h2 className="text-[12px] uppercase tracking-[0.12em] text-white mt-3">
            05 · Your rights
          </h2>
          <p>
            Depending on where you live, you may have the right to access,
            correct, port, restrict processing of, or delete your personal
            data, and to object to certain uses. To exercise any of these
            rights, email{' '}
            <a
              href="mailto:privacy@mrstocks.cash"
              className="text-[oklch(0.82_0.16_75)] underline"
            >
              privacy@mrstocks.cash
            </a>
            . We will respond within thirty (30) days.
          </p>
          <p>
            <strong className="text-white">EU/UK residents (GDPR):</strong>{' '}
            our legal basis for processing is your consent (for marketing
            email + push) and the performance of our contract (for
            account, billing, and service-operation processing).
          </p>
          <p>
            <strong className="text-white">California residents (CCPA):</strong>{' '}
            we do not sell personal information. You may request
            disclosure of categories of information we have collected
            about you in the past 12 months by emailing us.
          </p>

          <h2 className="text-[12px] uppercase tracking-[0.12em] text-white mt-3">
            06 · Data retention
          </h2>
          <p>
            We retain account data for as long as your account is active
            plus 90 days. On account deletion, we delete personal data
            except where retention is required by law (e.g. tax records).
            Server logs are retained for up to 30 days. Nightly database
            backups are retained for 14 days.
          </p>

          <h2 className="text-[12px] uppercase tracking-[0.12em] text-white mt-3">
            07 · Cookies
          </h2>
          <p>
            We use one essential first-party cookie to maintain your
            sign-in session. We do not use third-party advertising or
            analytics cookies. We do not embed Facebook, Google Analytics,
            or similar tracking pixels.
          </p>

          <h2 className="text-[12px] uppercase tracking-[0.12em] text-white mt-3">
            08 · Children
          </h2>
          <p>
            The Service is not directed at, and we do not knowingly
            collect data from, anyone under 18. If we learn we have
            collected such data, we will delete it.
          </p>

          <h2 className="text-[12px] uppercase tracking-[0.12em] text-white mt-3">
            09 · Changes to this Policy
          </h2>
          <p>
            We will post any material changes to this Policy at this URL
            and update the &quot;last updated&quot; date above. For
            material changes affecting EU/UK residents, we will provide
            additional notice.
          </p>

          <h2 className="text-[12px] uppercase tracking-[0.12em] text-white mt-3">
            10 · Contact
          </h2>
          <p>
            For privacy-related questions, email{' '}
            <a
              href="mailto:privacy@mrstocks.cash"
              className="text-[oklch(0.82_0.16_75)] underline"
            >
              privacy@mrstocks.cash
            </a>
            . For general support, email{' '}
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
