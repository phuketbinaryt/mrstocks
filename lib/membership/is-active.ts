import type { InferSelectModel } from 'drizzle-orm';
import type { memberships } from '@/lib/db/schema';

type Membership = InferSelectModel<typeof memberships>;

/**
 * Returns true iff the user has a currently-redeemable membership.
 * - status must be 'active' or 'trialing'
 * - if `currentPeriodEnd` is set, it must not be in the past
 *   (null means lifetime / no expiry — treat as still active)
 */
export function isMembershipActive(
  m: Pick<Membership, 'status' | 'currentPeriodEnd'> | null,
): boolean {
  if (!m) return false;
  if (m.status !== 'active' && m.status !== 'trialing') return false;
  if (m.currentPeriodEnd && m.currentPeriodEnd.getTime() < Date.now()) {
    return false;
  }
  return true;
}
