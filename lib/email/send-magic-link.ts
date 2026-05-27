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
  // Bulletproof button pattern: <td bgcolor> + <font color> + padding on the cell
  // (NOT on the <a>) — this survives Gmail / Outlook / Apple Mail CSS stripping.
  const amber = '#E8A33D';
  const mono =
    "'IBM Plex Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";
  return `
<div style="background:#000;padding:40px 16px;font-family:${mono};color:#fff;">
  <table role="presentation" align="center" cellspacing="0" cellpadding="0" border="0" width="520" style="max-width:520px;width:100%;margin:0 auto;border-collapse:separate;">
    <tr>
      <td style="background:#0B0B0B;border:1px solid rgba(255,255,255,0.12);padding:32px;">

        <div style="font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:${amber};margin-bottom:22px;font-family:${mono};">
          MR/STOCKS
        </div>

        <h1 style="font-size:20px;font-weight:500;letter-spacing:0.02em;margin:0 0 14px 0;color:#fff;font-family:${mono};">
          Sign in to your account
        </h1>

        <p style="font-size:14px;line-height:1.6;color:rgba(255,255,255,0.72);margin:0 0 30px 0;font-family:${mono};">
          Click the button below to sign in. This link expires in 30 minutes and can only be used once.
        </p>

        <table role="presentation" cellspacing="0" cellpadding="0" border="0">
          <tr>
            <td bgcolor="${amber}" align="center" style="background-color:${amber};border-radius:4px;mso-padding-alt:0;">
              <a href="${url}" target="_blank" style="display:inline-block;padding:16px 36px;color:#0B0B0B;font-family:${mono};font-size:14px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;text-decoration:none;border-radius:4px;">
                <font color="#0B0B0B" style="color:#0B0B0B;">Sign in to MR/STOCKS</font>
              </a>
            </td>
          </tr>
        </table>

        <p style="font-size:11.5px;line-height:1.5;color:rgba(255,255,255,0.4);margin:32px 0 0 0;font-family:${mono};">
          Button not working? Copy this URL into your browser:
        </p>
        <p style="font-size:11px;line-height:1.55;color:rgba(255,255,255,0.55);margin:8px 0 0 0;font-family:${mono};word-break:break-all;">
          ${url}
        </p>

        <div style="border-top:1px solid rgba(255,255,255,0.10);margin:28px 0 20px 0;height:1px;line-height:0;font-size:0;">&nbsp;</div>

        <p style="font-size:11px;line-height:1.6;color:rgba(255,255,255,0.45);margin:0;font-family:${mono};">
          You're receiving this because someone &mdash; hopefully you &mdash; requested a sign-in link for MR/STOCKS. If it wasn't you, ignore this email.
        </p>

      </td>
    </tr>
  </table>
</div>
  `;
}

function renderText(url: string): string {
  return `Sign in to MR/STOCKS: ${url}\n\nThis link expires in 30 minutes and can only be used once. If you didn't request this, you can ignore this email.`;
}
