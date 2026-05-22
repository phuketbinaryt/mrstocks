import 'server-only';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db/client';
import { memberships } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { isMembershipActive } from './is-active';

/**
 * Server-component guard: ensures the request has an authenticated user with
 * an active membership. Redirects to `/signin` (then `/pricing`) otherwise.
 *
 * We don't gate in middleware.ts because Auth.js v5 + DrizzleAdapter on
 * postgres-js requires the Node runtime, and Next 15 middleware defaults to
 * Edge. Doing the check in each protected page's server component keeps the
 * full Node toolchain available.
 *
 * Returns the resolved session so the page can use `session.user`.
 */
export async function requireActiveMembership(callbackPath: string) {
  const session = await auth();
  if (!session?.user?.id) {
    const params = new URLSearchParams({ callbackUrl: callbackPath });
    redirect(`/signin?${params.toString()}`);
  }

  const [m] = await db
    .select({
      status: memberships.status,
      currentPeriodEnd: memberships.currentPeriodEnd,
    })
    .from(memberships)
    .where(eq(memberships.userId, session.user.id))
    .limit(1);

  if (!isMembershipActive(m ?? null)) {
    const params = new URLSearchParams({ reason: 'no-active-membership' });
    redirect(`/pricing?${params.toString()}`);
  }

  return session;
}
