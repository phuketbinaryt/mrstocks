/**
 * Sentry server-side init. Loaded by Next.js when SENTRY_DSN is set.
 * If DSN is unset, init is skipped entirely — the app keeps working with
 * no error reporting.
 */
import * as Sentry from '@sentry/nextjs';

const dsn = process.env.SENTRY_DSN;
if (dsn) {
  Sentry.init({
    dsn,
    tracesSampleRate: 0.1,
    enabled: process.env.NODE_ENV === 'production',
    environment: process.env.NODE_ENV ?? 'development',
    // Filter out noisy known-benign errors here if needed.
  });
}
