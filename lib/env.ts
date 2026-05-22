import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().url().startsWith('postgres://'),
    AUTH_SECRET: z.string().min(32),
    AUTH_URL: z.string().url(),
    RESEND_API_KEY: z.string().min(1),
    EMAIL_FROM: z.string().email(),
    REDIS_URL: z.string().url().startsWith('redis://').optional(),
    INGEST_SHARED_SECRET: z.string().min(32),
    WHOP_CLIENT_ID: z.string().min(1),
    WHOP_CLIENT_SECRET: z.string().min(1),
    WHOP_API_KEY: z.string().min(1),
    WHOP_WEBHOOK_SECRET: z.string().min(16),
    WHOP_PASS_ID: z.string().min(1),
    WHOP_CHECKOUT_URL: z.string().url().startsWith('https://'),
    VAPID_PUBLIC_KEY: z.string().min(40),
    VAPID_PRIVATE_KEY: z.string().min(40),
    VAPID_SUBJECT: z.union([
      z.string().email(),
      z.string().startsWith('mailto:'),
    ]),
    // Optional. If set, the user with this email is auto-promoted to
    // is_admin=true on next sign-in. Useful for bootstrapping the first
    // admin without a manual UPDATE on the prod DB.
    ADMIN_BOOTSTRAP_EMAIL: z.string().email().optional(),
    // Optional. If set, Sentry SDK initializes server-side; otherwise it's
    // a noop and the app continues to work without error reporting.
    SENTRY_DSN: z.string().url().optional(),
  },
  client: {
    NEXT_PUBLIC_VAPID_PUBLIC_KEY: z.string().min(40),
    // Optional. Mirrors SENTRY_DSN for browser-side error capture.
    NEXT_PUBLIC_SENTRY_DSN: z.string().url().optional(),
  },
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    AUTH_SECRET: process.env.AUTH_SECRET,
    AUTH_URL: process.env.AUTH_URL,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    EMAIL_FROM: process.env.EMAIL_FROM,
    REDIS_URL: process.env.REDIS_URL,
    INGEST_SHARED_SECRET: process.env.INGEST_SHARED_SECRET,
    WHOP_CLIENT_ID: process.env.WHOP_CLIENT_ID,
    WHOP_CLIENT_SECRET: process.env.WHOP_CLIENT_SECRET,
    WHOP_API_KEY: process.env.WHOP_API_KEY,
    WHOP_WEBHOOK_SECRET: process.env.WHOP_WEBHOOK_SECRET,
    WHOP_PASS_ID: process.env.WHOP_PASS_ID,
    WHOP_CHECKOUT_URL: process.env.WHOP_CHECKOUT_URL,
    VAPID_PUBLIC_KEY: process.env.VAPID_PUBLIC_KEY,
    VAPID_PRIVATE_KEY: process.env.VAPID_PRIVATE_KEY,
    VAPID_SUBJECT: process.env.VAPID_SUBJECT,
    ADMIN_BOOTSTRAP_EMAIL: process.env.ADMIN_BOOTSTRAP_EMAIL,
    SENTRY_DSN: process.env.SENTRY_DSN,
    NEXT_PUBLIC_VAPID_PUBLIC_KEY: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
    NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
  },
  emptyStringAsUndefined: true,
});
