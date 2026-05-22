import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('resend', () => {
  const send = vi.fn().mockResolvedValue({ data: { id: 'mock-id' }, error: null });
  class Resend {
    emails = { send };
    constructor(_apiKey?: string) {}
  }
  return {
    Resend,
    __send: send,
  };
});

describe('sendMagicLinkEmail', () => {
  beforeEach(() => {
    process.env.DATABASE_URL = 'postgres://u:p@localhost:5432/db';
    process.env.AUTH_SECRET = 'x'.repeat(32);
    process.env.AUTH_URL = 'http://localhost:3200';
    process.env.RESEND_API_KEY = 're_test';
    process.env.EMAIL_FROM = 'noreply@example.com';
    process.env.INGEST_SHARED_SECRET = 'x'.repeat(64);
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

  it('calls Resend with the magic link URL and recipient', async () => {
    const { sendMagicLinkEmail } = await import('./send-magic-link');
    const resend = await import('resend');
    const sendSpy = (resend as unknown as { __send: ReturnType<typeof vi.fn> }).__send;
    sendSpy.mockClear();

    await sendMagicLinkEmail({ to: 'user@example.com', url: 'https://app/x?token=abc' });

    expect(sendSpy).toHaveBeenCalledOnce();
    const arg = sendSpy.mock.calls[0][0];
    expect(arg.to).toBe('user@example.com');
    expect(arg.from).toBe('noreply@example.com');
    expect(arg.subject).toMatch(/sign in/i);
    expect(arg.html).toContain('https://app/x?token=abc');
  });
});
