/**
 * Next.js instrumentation entry point. Loaded once per server process.
 * Conditionally bootstraps Sentry; if SENTRY_DSN is unset, no-op.
 */
export async function register() {
  if (!process.env.SENTRY_DSN) return;
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('./sentry.server.config');
  }
  if (process.env.NEXT_RUNTIME === 'edge') {
    await import('./sentry.edge.config');
  }
}
