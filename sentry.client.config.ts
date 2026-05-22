/**
 * Sentry browser-side init. Loaded by Next.js when NEXT_PUBLIC_SENTRY_DSN
 * is set. If DSN is unset, init is skipped — the app keeps working with
 * no client-side error reporting.
 */
import * as Sentry from '@sentry/nextjs';

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;
if (dsn) {
  Sentry.init({
    dsn,
    tracesSampleRate: 0.1,
    enabled: process.env.NODE_ENV === 'production',
    environment: process.env.NODE_ENV ?? 'development',
    // Avoid logging PII by default.
    sendDefaultPii: false,
  });
}
