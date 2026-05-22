import 'server-only';
import { redirect } from 'next/navigation';
import { eq } from 'drizzle-orm';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db/client';
import { users } from '@/lib/db/schema';

/**
 * Server-side guard for /admin/* routes. Redirects unauthenticated users
 * to /signin and non-admin users to /dashboard.
 *
 * @returns the authenticated admin's session (.user.id, .user.email both
 *   guaranteed non-null at the type level via the redirect short-circuits).
 */
export async function requireAdmin(callbackPath = '/admin') {
  const session = await auth();
  if (!session?.user?.id) {
    redirect(`/signin?callbackUrl=${encodeURIComponent(callbackPath)}`);
  }
  const [row] = await db
    .select({ isAdmin: users.isAdmin })
    .from(users)
    .where(eq(users.id, session.user.id))
    .limit(1);
  if (!row?.isAdmin) {
    redirect('/dashboard');
  }
  return session;
}

/**
 * Non-redirecting helper for components that need to know if the current
 * user is an admin without forcing a redirect (e.g. to conditionally show
 * an "Admin" link in a nav).
 */
export async function isCurrentUserAdmin(): Promise<boolean> {
  const session = await auth();
  if (!session?.user?.id) return false;
  const [row] = await db
    .select({ isAdmin: users.isAdmin })
    .from(users)
    .where(eq(users.id, session.user.id))
    .limit(1);
  return row?.isAdmin === true;
}
