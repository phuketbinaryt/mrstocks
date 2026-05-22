import 'server-only';
import { Resend } from 'resend';
import { env } from '@/lib/env';

const resend = new Resend(env.RESEND_API_KEY);

export async function sendMagicLinkEmail({ to, url }: { to: string; url: string }) {
  const result = await resend.emails.send({
    from: env.EMAIL_FROM,
    to,
    subject: 'Sign in to MR/STOCKS',
    html: renderHtml(url),
    text: renderText(url),
  });
  if (result.error) {
    throw new Error(`Resend error: ${result.error.message ?? 'unknown'}`);
  }
  return result.data;
}

function renderHtml(url: string): string {
  // Brand-matched email: black bg, amber accent, monospace.
  // Inlined styles only — most email clients strip <style> blocks.
  const amber = 'oklch(0.82 0.16 75)';
  const mono = '"IBM Plex Mono", ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';
  return `
    <div style="background:#000;padding:32px 16px;font-family:${mono};color:#fff;">
      <div style="max-width:520px;margin:0 auto;border:1px solid rgba(255,255,255,0.12);background:#0B0B0B;padding:28px;">
        <div style="font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:${amber};margin-bottom:18px;">
          MR/STOCKS
        </div>
        <h1 style="font-size:18px;font-weight:500;letter-spacing:0.04em;margin:0 0 12px 0;color:#fff;">
          Sign in to your account
        </h1>
        <p style="font-size:13px;line-height:1.6;color:rgba(255,255,255,0.7);margin:0 0 24px 0;">
          Click the button below to sign in. This link expires in 30 minutes
          and can only be used once.
        </p>
        <a href="${url}"
           style="display:inline-block;border:1px solid ${amber};background:rgba(232,178,77,0.14);color:${amber};font-family:${mono};font-size:12px;letter-spacing:0.12em;text-transform:uppercase;padding:12px 20px;text-decoration:none;">
          Sign in &rarr;
        </a>
        <p style="font-size:11px;line-height:1.6;color:rgba(255,255,255,0.45);margin:28px 0 0 0;">
          Or paste this URL into your browser:<br/>
          <span style="color:rgba(255,255,255,0.65);word-break:break-all;">${url}</span>
        </p>
        <hr style="border:none;border-top:1px solid rgba(255,255,255,0.10);margin:24px 0;"/>
        <p style="font-size:11px;line-height:1.6;color:rgba(255,255,255,0.45);margin:0;">
          You're receiving this because someone &mdash; hopefully you &mdash; requested
          a sign-in link for MR/STOCKS. If it wasn't you, ignore this email.
        </p>
      </div>
    </div>
  `;
}

function renderText(url: string): string {
  return `Sign in to MR/STOCKS: ${url}\n\nThis link expires in 30 minutes and can only be used once. If you didn't request this, you can ignore this email.`;
}
