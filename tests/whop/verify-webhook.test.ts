import { describe, it, expect } from 'vitest';
import { createHmac } from 'node:crypto';
import { verifyWhopWebhook } from '@/lib/whop/verify-webhook';

const secret = 'x'.repeat(32);
const body = '{"event":"membership.went_valid","data":{"id":"mem_test"}}';
const goodSig = createHmac('sha256', secret).update(body).digest('hex');

describe('verifyWhopWebhook', () => {
  it('accepts a valid signature', () => {
    expect(verifyWhopWebhook(body, goodSig, secret)).toBe(true);
  });
  it('accepts sha256=PREFIX form', () => {
    expect(verifyWhopWebhook(body, `sha256=${goodSig}`, secret)).toBe(true);
  });
  it('rejects a tampered body', () => {
    expect(verifyWhopWebhook(body + 'x', goodSig, secret)).toBe(false);
  });
  it('rejects a wrong secret', () => {
    expect(verifyWhopWebhook(body, goodSig, 'y'.repeat(32))).toBe(false);
  });
  it('rejects malformed signature', () => {
    expect(verifyWhopWebhook(body, 'not-hex', secret)).toBe(false);
    expect(verifyWhopWebhook(body, '', secret)).toBe(false);
  });
});
