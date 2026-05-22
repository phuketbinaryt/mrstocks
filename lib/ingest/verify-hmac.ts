import { createHmac, timingSafeEqual } from 'node:crypto';

export function computeHmac(body: string, secret: string): string {
  return createHmac('sha256', secret).update(body).digest('hex');
}

export function verifyHmac(body: string, signatureHeader: string, secret: string): boolean {
  if (!signatureHeader) return false;
  const provided = signatureHeader.startsWith('sha256=')
    ? signatureHeader.slice('sha256='.length)
    : signatureHeader;
  if (!/^[0-9a-f]+$/i.test(provided)) return false;
  const expected = computeHmac(body, secret);
  if (provided.length !== expected.length) return false;
  try {
    return timingSafeEqual(Buffer.from(expected, 'hex'), Buffer.from(provided, 'hex'));
  } catch {
    return false;
  }
}
