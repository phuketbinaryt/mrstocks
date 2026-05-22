import { describe, it, expect } from 'vitest';
import { verifyHmac, computeHmac } from '@/lib/ingest/verify-hmac';

describe('verifyHmac', () => {
  const secret = 'a'.repeat(64);
  const body = '{"hello":"world"}';
  const goodSig = computeHmac(body, secret);

  it('accepts a matching signature with sha256= prefix', () => {
    expect(verifyHmac(body, `sha256=${goodSig}`, secret)).toBe(true);
  });

  it('accepts a matching signature without prefix', () => {
    expect(verifyHmac(body, goodSig, secret)).toBe(true);
  });

  it('rejects a tampered body', () => {
    expect(verifyHmac('{"hello":"WORLD"}', `sha256=${goodSig}`, secret)).toBe(false);
  });

  it('rejects a wrong secret', () => {
    const bad = computeHmac(body, 'b'.repeat(64));
    expect(verifyHmac(body, `sha256=${bad}`, secret)).toBe(false);
  });

  it('rejects malformed signature', () => {
    expect(verifyHmac(body, 'not-hex', secret)).toBe(false);
    expect(verifyHmac(body, '', secret)).toBe(false);
  });

  it('rejects wrong-length signature', () => {
    expect(verifyHmac(body, 'sha256=' + 'a'.repeat(63), secret)).toBe(false);
    expect(verifyHmac(body, 'sha256=' + 'a'.repeat(65), secret)).toBe(false);
  });
});
