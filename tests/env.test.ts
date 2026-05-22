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
  ];

  beforeEach(() => {
    for (const k of keys) originals[k] = process.env[k];
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
  });
});
