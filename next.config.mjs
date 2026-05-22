import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  // Pin tracing root to this repo so an unrelated package-lock.json
  // elsewhere on the dev box doesn't get picked up as the workspace root.
  outputFileTracingRoot: __dirname,
};

// Conditionally wrap with Sentry. If SENTRY_DSN is unset (dev, CI), skip
// the wrapper entirely so we don't depend on Sentry being configured.
let exported = nextConfig;
if (process.env.SENTRY_DSN) {
  const { withSentryConfig } = await import('@sentry/nextjs');
  exported = withSentryConfig(nextConfig, {
    silent: true,
    // We're not uploading source maps to Sentry yet — leave that for when
    // the user grants an auth token. Builds still work without it.
    disableLogger: true,
  });
}

export default exported;
