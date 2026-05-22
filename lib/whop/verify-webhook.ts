import { createHmac, timingSafeEqual } from 'node:crypto';

/**
 * Verifies the HMAC-SHA256 signature Whop sends in the `X-Whop-Signature`
 * header. Accepts either a bare hex digest or the `sha256=<hex>` prefix form
 * (Whop has flipped between the two historically).
 */
export function verifyWhopWebhook(
  body: string,
  sigHeader: string,
  secret: string,
): boolean {
  if (!sigHeader) return false;
  const provided = sigHeader.startsWith('sha256=')
    ? sigHeader.slice('sha256='.length)
    : sigHeader;
  if (!/^[0-9a-f]+$/i.test(provided)) return false;
  const expected = createHmac('sha256', secret).update(body).digest('hex');
  if (provided.length !== expected.length) return false;
  try {
    return timingSafeEqual(
      Buffer.from(expected, 'hex'),
      Buffer.from(provided, 'hex'),
    );
  } catch {
    return false;
  }
}
