import { describe, it, expect, beforeEach, afterEach } from 'vitest';

describe('env', () => {
  const originals: Record<string, string | undefined> = {};
  const keys = [
    'DATABASE_URL',
    'AUTH_SECRET',
    'AUTH_URL',
    'RESEND_API_KEY',
    'EMAIL_FROM',
    'INGEST_SHARED_SECRET',
    'WHOP_CLIENT_ID',
    'WHOP_CLIENT_SECRET',
    'WHOP_API_KEY',
    'WHOP_WEBHOOK_SECRET',
    'WHOP_PASS_ID',
    'WHOP_CHECKOUT_URL',
    'VAPID_PUBLIC_KEY',
    'VAPID_PRIVATE_KEY',
    'VAPID_SUBJECT',
    'NEXT_PUBLIC_VAPID_PUBLIC_KEY',
  ];

  beforeEach(() => {
    for (const k of keys) originals[k] = process.env[k];
    process.env.WHOP_CLIENT_ID = 'wp_test';
    process.env.WHOP_CLIENT_SECRET = 'wpsec_test';
    process.env.WHOP_API_KEY = 'wpkey_test';
    process.env.WHOP_WEBHOOK_SECRET = 'x'.repeat(32);
    process.env.WHOP_PASS_ID = 'pass_test';
    process.env.WHOP_CHECKOUT_URL = 'https://whop.com/checkout/test';
    process.env.VAPID_PUBLIC_KEY = 'B' + 'x'.repeat(86);
    process.env.VAPID_PRIVATE_KEY = 'x'.repeat(43);
    process.env.VAPID_SUBJECT = 'mailto:ops@example.com';
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY = 'B' + 'x'.repeat(86);
  });
  afterEach(() => {
    for (const k of keys) {
      if (originals[k] === undefined) delete process.env[k];
      else process.env[k] = originals[k]!;
    }
  });

  it('exposes a validated env object when all required vars are set', async () => {
    process.env.DATABASE_URL = 'postgres://u:p@localhost:5432/db';
    process.env.AUTH_SECRET = 'x'.repeat(32);
    process.env.AUTH_URL = 'http://localhost:3200';
    process.env.RESEND_API_KEY = 're_test';
    process.env.EMAIL_FROM = 'noreply@example.com';
    process.env.INGEST_SHARED_SECRET = 'x'.repeat(64);

    const { env } = await import('@/lib/env');
    expect(env.DATABASE_URL).toMatch(/^postgres:\/\//);
    expect(env.AUTH_SECRET.length).toBeGreaterThanOrEqual(32);
    expect(env.EMAIL_FROM).toBe('noreply@example.com');
    expect(env.WHOP_CLIENT_ID).toBe('wp_test');
    expect(env.WHOP_CHECKOUT_URL).toBe('https://whop.com/checkout/test');
  });
});
