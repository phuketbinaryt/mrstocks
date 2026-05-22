import type { Job } from 'bullmq';
import { eq } from 'drizzle-orm';
import webpush from 'web-push';
import { env } from '@/lib/env';
import { db } from '@/lib/db/client';
import {
  pushSubscriptions,
  alertRules,
  notifications,
} from '@/lib/db/schema';
import type { SendJobData } from '@/lib/queue/queues';

webpush.setVapidDetails(
  env.VAPID_SUBJECT.startsWith('mailto:')
    ? env.VAPID_SUBJECT
    : `mailto:${env.VAPID_SUBJECT}`,
  env.VAPID_PUBLIC_KEY,
  env.VAPID_PRIVATE_KEY,
);

export async function runSendWebpush(job: Job<SendJobData>) {
  const { userId, ruleId, scanId, symbols } = job.data;

  const subs = await db
    .select()
    .from(pushSubscriptions)
    .where(eq(pushSubscriptions.userId, userId));
  const [rule] = await db
    .select()
    .from(alertRules)
    .where(eq(alertRules.id, ruleId))
    .limit(1);
  if (!rule) {
    console.warn(`[send-webpush] missing rule ${ruleId}`);
    return;
  }
  if (subs.length === 0) {
    // User has no enrolled browsers — record a no-op delivery and move on.
    await db.insert(notifications).values({
      userId,
      ruleId,
      scanId,
      symbols,
      channel: 'webpush',
      delivered: false,
      error: 'no push subscriptions',
    });
    return;
  }

  const payload = JSON.stringify({
    title: `${rule.name} · ${symbols.length} match${symbols.length === 1 ? '' : 'es'}`,
    body:
      symbols.slice(0, 5).join(', ') + (symbols.length > 5 ? '…' : ''),
    url: 'https://mrstocks.cash/dashboard',
  });

  let delivered = false;
  let errMsg: string | null = null;
  for (const s of subs) {
    try {
      await webpush.sendNotification(
        { endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.authKey } },
        payload,
      );
      delivered = true;
    } catch (e: unknown) {
      const statusCode =
        typeof e === 'object' && e && 'statusCode' in e
          ? (e as { statusCode?: number }).statusCode
          : undefined;
      if (statusCode === 410 || statusCode === 404) {
        // Subscription is dead — clean it up. Common when the user revokes
        // permission or uninstalls a PWA.
        await db
          .delete(pushSubscriptions)
          .where(eq(pushSubscriptions.endpoint, s.endpoint));
      } else {
        errMsg = e instanceof Error ? e.message : String(e);
        console.error(`[send-webpush] sub ${s.id} send failed:`, errMsg);
      }
    }
  }

  await db.insert(notifications).values({
    userId,
    ruleId,
    scanId,
    symbols,
    channel: 'webpush',
    delivered,
    error: errMsg,
  });
}
