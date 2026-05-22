import 'server-only';
import { db } from '@/lib/db/client';
import { memberships } from '@/lib/db/schema';
import type { WhopMembership } from '@/lib/whop/types';

function statusFromWhop(m: WhopMembership): string {
  // Whop's enum has 'completed' which we map to 'expired'; otherwise pass through.
  if (m.status === 'completed') return 'expired';
  return m.status;
}

export async function upsertMembershipFromWhop(opts: {
  userId: string;
  whopMembership: WhopMembership;
}): Promise<void> {
  const { userId, whopMembership: m } = opts;
  const currentPeriodEnd = m.renewal_period_end ?? m.expires_at ?? null;
  await db
    .insert(memberships)
    .values({
      userId,
      whopMembershipId: m.id,
      whopUserId: m.user,
      status: statusFromWhop(m),
      plan: m.plan ?? null,
      currentPeriodEnd: currentPeriodEnd
        ? new Date(currentPeriodEnd * 1000)
        : null,
      updatedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: memberships.userId,
      set: {
        whopMembershipId: m.id,
        whopUserId: m.user,
        status: statusFromWhop(m),
        plan: m.plan ?? null,
        currentPeriodEnd: currentPeriodEnd
          ? new Date(currentPeriodEnd * 1000)
          : null,
        updatedAt: new Date(),
      },
    });
}
