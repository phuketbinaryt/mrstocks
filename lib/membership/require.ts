import 'server-only';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db/client';
import { memberships, users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { isMembershipActive } from './is-active';

/**
 * Server-component guard: ensures the request has an authenticated user with
 * either an active membership OR the is_admin flag set. Redirects to `/signin`
 * (then `/pricing`) otherwise.
 *
 * Admins bypass the membership check entirely — they get full member-side
 * access for support / QA / their own dogfooding without needing a paid sub.
 *
 * We don't gate in middleware.ts because Auth.js v5 + DrizzleAdapter on
 * postgres-js requires the Node runtime, and Next 15 middleware defaults to
 * Edge. Doing the check in each protected page's server component keeps the
 * full Node toolchain available.
 */
export async function requireActiveMembership(callbackPath: string) {
  const session = await auth();
  if (!session?.user?.id) {
    const params = new URLSearchParams({ callbackUrl: callbackPath });
    redirect(`/signin?${params.toString()}`);
  }

  // Single query: pull is_admin + membership row in one shot via LEFT JOIN.
  const [row] = await db
    .select({
      isAdmin: users.isAdmin,
      status: memberships.status,
      currentPeriodEnd: memberships.currentPeriodEnd,
    })
    .from(users)
    .leftJoin(memberships, eq(memberships.userId, users.id))
    .where(eq(users.id, session.user.id))
    .limit(1);

  // Admin bypass — flagged users get member-side access without a Whop sub.
  if (row?.isAdmin) {
    return session;
  }

  const m =
    row && row.status
      ? { status: row.status, currentPeriodEnd: row.currentPeriodEnd }
      : null;

  if (!isMembershipActive(m)) {
    const params = new URLSearchParams({ reason: 'no-active-membership' });
    redirect(`/pricing?${params.toString()}`);
  }

  return session;
}
