import type { Job } from 'bullmq';
import { eq } from 'drizzle-orm';
import { Resend } from 'resend';
import { env } from '@/lib/env';
import { db } from '@/lib/db/client';
import { users, alertRules, notifications } from '@/lib/db/schema';
import type { SendJobData } from '@/lib/queue/queues';

const resend = new Resend(env.RESEND_API_KEY);

export async function runSendEmail(job: Job<SendJobData>) {
  const { userId, ruleId, scanId, symbols } = job.data;

  const [user] = await db
    .select({ email: users.email })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);
  const [rule] = await db
    .select()
    .from(alertRules)
    .where(eq(alertRules.id, ruleId))
    .limit(1);
  if (!user?.email || !rule) {
    console.warn(
      `[send-email] missing user or rule (userId=${userId}, ruleId=${ruleId})`,
    );
    return;
  }

  const subject = `MR/STOCKS · ${rule.name} matched ${symbols.length} setup${symbols.length === 1 ? '' : 's'}`;

  let delivered = false;
  let errMsg: string | null = null;
  try {
    const result = await resend.emails.send({
      from: env.EMAIL_FROM,
      to: user.email,
      subject,
      html: renderAlertHtml({ ruleName: rule.name, symbols }),
      text: renderAlertText({ ruleName: rule.name, symbols }),
    });
    if (result.error) {
      errMsg = result.error.message ?? 'unknown resend error';
    } else {
      delivered = true;
    }
  } catch (e: unknown) {
    errMsg = e instanceof Error ? e.message : String(e);
  }

  await db.insert(notifications).values({
    userId,
    ruleId,
    scanId,
    symbols,
    channel: 'email',
    delivered,
    error: errMsg,
  });

  if (!delivered) {
    // Surface to the BullMQ retry mechanism so the job moves to failed/retry.
    throw new Error(`resend send failed: ${errMsg}`);
  }
}

function renderAlertHtml({
  ruleName,
  symbols,
}: {
  ruleName: string;
  symbols: string[];
}) {
  const amber = '#E8A33D';
  const items = symbols
    .map(
      (s) =>
        `<a href="https://mrstocks.cash/dashboard/${s}" style="color:${amber};text-decoration:none;font-weight:600">${s}</a>`,
    )
    .join(' &middot; ');
  return `<div style="background:#000;color:#fff;font-family:'IBM Plex Mono',monospace;padding:32px 16px">
    <div style="max-width:520px;margin:0 auto;border:1px solid rgba(255,255,255,0.12);background:#0B0B0B;padding:28px">
      <div style="font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:${amber};margin-bottom:16px">MR/STOCKS · ALERT</div>
      <h1 style="font-size:18px;font-weight:500;margin:0 0 8px">${escapeHtml(ruleName)}</h1>
      <p style="font-size:13px;color:rgba(255,255,255,0.7);margin:0 0 20px">
        ${symbols.length} candidate${symbols.length === 1 ? '' : 's'} matched in today's 09:15 NY scan.
      </p>
      <div style="font-size:14px;line-height:1.7">${items}</div>
      <p style="margin-top:24px"><a href="https://mrstocks.cash/dashboard" style="display:inline-block;background:${amber};color:#0B0B0B;padding:12px 24px;text-decoration:none;font-size:12px;letter-spacing:0.14em;text-transform:uppercase">Open dashboard &rarr;</a></p>
      <p style="margin-top:24px;font-size:10px;color:rgba(255,255,255,0.4)">
        You're receiving this because you set up an alert rule. Manage alerts at
        <a href="https://mrstocks.cash/alerts" style="color:${amber}">mrstocks.cash/alerts</a>.
      </p>
    </div>
  </div>`;
}

function renderAlertText({
  ruleName,
  symbols,
}: {
  ruleName: string;
  symbols: string[];
}) {
  return `MR/STOCKS · Alert: ${ruleName}

${symbols.length} matches today:
${symbols.join(', ')}

Open: https://mrstocks.cash/dashboard
Manage: https://mrstocks.cash/alerts`;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
