import 'server-only';

// Stub: real implementation lands in Task 8 (Resend).
// Keeping this file present so lib/auth.ts can import it.
export async function sendMagicLinkEmail({ to, url }: { to: string; url: string }) {
  console.warn(`[stub] sendMagicLinkEmail → ${to}: ${url}`);
}
