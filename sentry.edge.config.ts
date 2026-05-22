/**
 * Sentry edge runtime init. Loaded by Next.js for Edge route handlers
 * + middleware. Same DSN gating as the server config.
 */
import * as Sentry from '@sentry/nextjs';

const dsn = process.env.SENTRY_DSN;
if (dsn) {
  Sentry.init({
    dsn,
    tracesSampleRate: 0.1,
    enabled: process.env.NODE_ENV === 'production',
    environment: process.env.NODE_ENV ?? 'development',
  });
}
