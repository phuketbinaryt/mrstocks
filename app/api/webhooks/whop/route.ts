import { NextResponse, type NextRequest } from 'next/server';
import { env } from '@/lib/env';
import { verifyWhopWebhook } from '@/lib/whop/verify-webhook';
import { db } from '@/lib/db/client';
import { accounts } from '@/lib/db/schema';
import { and, eq } from 'drizzle-orm';
import type { WhopMembership } from '@/lib/whop/types';
import { upsertMembershipFromWhop } from '@/lib/membership/upsert';
import { logAuditEvent } from '@/lib/audit/log';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface WhopWebhookEnvelope {
  event?: string;
  data?: WhopMembership;
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get('x-whop-signature') ?? '';

  if (!verifyWhopWebhook(body, sig, env.WHOP_WEBHOOK_SECRET)) {
    return NextResponse.json({ error: 'invalid signature' }, { status: 401 });
  }

  let payload: WhopWebhookEnvelope;
  try {
    payload = JSON.parse(body) as WhopWebhookEnvelope;
  } catch {
    return NextResponse.json({ error: 'invalid json' }, { status: 400 });
  }

  const evt = payload.event;
  const m = payload.data;
  if (!evt || !m || !m.user) {
    return NextResponse.json({ ok: true, skipped: 'missing event or data' });
  }

  // Resolve our user via the OAuth `accounts` row keyed on
  // (provider='whop', providerAccountId=whop user id).
  const acct = await db
    .select({ userId: accounts.userId })
    .from(accounts)
    .where(
      and(
        eq(accounts.provider, 'whop'),
        eq(accounts.providerAccountId, m.user),
      ),
    )
    .limit(1);

  if (acct.length === 0) {
    // Whop sent us a webhook about a user we don't know yet (paid before
    // signing in). Acknowledge — events.signIn JIT lookup will catch them up.
    console.log(
      `[whop-webhook] unknown user ${m.user}; will resolve on first sign-in`,
    );
    return NextResponse.json({ ok: true, deferred: true });
  }

  switch (evt) {
    case 'membership.went_valid':
    case 'membership.went_invalid':
    case 'payment.succeeded':
    case 'payment.failed':
      await upsertMembershipFromWhop({
        userId: acct[0].userId,
        whopMembership: m,
      });
      // Audit cancellations and payment failures — the things we want a
      // visible trail of. went_valid + payment.succeeded are "happy path"
      // and stay out of the audit log.
      if (evt === 'membership.went_invalid') {
        await logAuditEvent({
          actorUserId: null,
          action: 'member.subscription_canceled',
          target: acct[0].userId,
          meta: {
            event: evt,
            whopMembershipId: m.id ?? null,
            whopUserId: m.user ?? null,
          },
        });
      } else if (evt === 'payment.failed') {
        await logAuditEvent({
          actorUserId: null,
          action: 'member.payment_failed',
          target: acct[0].userId,
          meta: {
            event: evt,
            whopMembershipId: m.id ?? null,
            whopUserId: m.user ?? null,
          },
        });
      }
      break;
    default:
      // Acknowledge so Whop stops retrying.
      break;
  }

  return NextResponse.json({ ok: true });
}
