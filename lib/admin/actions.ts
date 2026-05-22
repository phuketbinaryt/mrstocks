'use server';
import 'server-only';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db/client';
import { users } from '@/lib/db/schema';
import { requireAdmin } from '@/lib/admin/guard';
import { logAuditEvent } from '@/lib/audit/log';

export async function grantAdminAction(formData: FormData): Promise<void> {
  const session = await requireAdmin('/admin/members');
  // requireAdmin guarantees a session w/ user.id but TS can't prove it.
  const actorId = session.user!.id!;
  const actorEmail = session.user!.email ?? null;
  const userId = String(formData.get('userId') ?? '');
  if (!userId) throw new Error('userId required');

  await db.update(users).set({ isAdmin: true }).where(eq(users.id, userId));

  await logAuditEvent({
    actorUserId: actorId,
    action: 'admin.grant_admin',
    target: userId,
    meta: { byEmail: actorEmail },
  });

  revalidatePath('/admin/members');
  revalidatePath(`/admin/members/${userId}`);
  redirect(`/admin/members/${userId}`);
}

export async function revokeAdminAction(formData: FormData): Promise<void> {
  const session = await requireAdmin('/admin/members');
  const actorId = session.user!.id!;
  const actorEmail = session.user!.email ?? null;
  const userId = String(formData.get('userId') ?? '');
  if (!userId) throw new Error('userId required');

  // Refuse to demote yourself — keeps you from accidentally locking
  // yourself out. If you really want to step down, run a manual SQL.
  if (userId === actorId) {
    throw new Error('cannot revoke your own admin');
  }

  await db.update(users).set({ isAdmin: false }).where(eq(users.id, userId));

  await logAuditEvent({
    actorUserId: actorId,
    action: 'admin.revoke_admin',
    target: userId,
    meta: { byEmail: actorEmail },
  });

  revalidatePath('/admin/members');
  revalidatePath(`/admin/members/${userId}`);
  redirect(`/admin/members/${userId}`);
}
