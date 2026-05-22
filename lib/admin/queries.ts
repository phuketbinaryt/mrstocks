import 'server-only';
import { sql, desc, eq, gte } from 'drizzle-orm';
import { db } from '@/lib/db/client';
import {
  users,
  memberships,
  scans,
  notifications,
  alertRules,
  auditLog,
} from '@/lib/db/schema';

const ASSUMED_PLAN_PRICE_USD = 29.99;

export async function getMemberCount(): Promise<number> {
  const [r] = await db
    .select({ n: sql<number>`COUNT(*)::int` })
    .from(users);
  return r?.n ?? 0;
}

export async function getActiveSubscriberCount(): Promise<number> {
  const [r] = await db
    .select({ n: sql<number>`COUNT(*)::int` })
    .from(memberships)
    .where(eq(memberships.status, 'active'));
  return r?.n ?? 0;
}

export async function getMrrEstimate(): Promise<number> {
  // Lazy estimate: active subscribers × assumed plan price. Future:
  // pull per-plan price from a plans table.
  const active = await getActiveSubscriberCount();
  return active * ASSUMED_PLAN_PRICE_USD;
}

export async function getLastScanIngest() {
  const [r] = await db
    .select({
      id: scans.id,
      generatedAt: scans.generatedAt,
      candidateCount: scans.candidateCount,
      ingestedAt: scans.ingestedAt,
      scannerName: scans.scannerName,
    })
    .from(scans)
    .orderBy(desc(scans.ingestedAt))
    .limit(1);
  return r ?? null;
}

export async function getRecentScans(limit = 30) {
  return db
    .select({
      id: scans.id,
      generatedAt: scans.generatedAt,
      ingestedAt: scans.ingestedAt,
      candidateCount: scans.candidateCount,
      scannerName: scans.scannerName,
    })
    .from(scans)
    .orderBy(desc(scans.ingestedAt))
    .limit(limit);
}

export async function getRecentNotifications(limit = 100) {
  return db
    .select({
      id: notifications.id,
      userId: notifications.userId,
      ruleId: notifications.ruleId,
      symbols: notifications.symbols,
      channel: notifications.channel,
      delivered: notifications.delivered,
      error: notifications.error,
      sentAt: notifications.sentAt,
    })
    .from(notifications)
    .orderBy(desc(notifications.sentAt))
    .limit(limit);
}

export interface DeliveryStats {
  total: number;
  delivered: number;
  failed: number;
  last24h: number;
}

export async function getDeliveryStats(): Promise<DeliveryStats> {
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const [total] = await db
    .select({ n: sql<number>`COUNT(*)::int` })
    .from(notifications);
  const [delivered] = await db
    .select({ n: sql<number>`COUNT(*)::int` })
    .from(notifications)
    .where(eq(notifications.delivered, true));
  const [failed] = await db
    .select({ n: sql<number>`COUNT(*)::int` })
    .from(notifications)
    .where(eq(notifications.delivered, false));
  const [last24h] = await db
    .select({ n: sql<number>`COUNT(*)::int` })
    .from(notifications)
    .where(gte(notifications.sentAt, since));
  return {
    total: total?.n ?? 0,
    delivered: delivered?.n ?? 0,
    failed: failed?.n ?? 0,
    last24h: last24h?.n ?? 0,
  };
}

export async function listMembers(limit = 100, search?: string) {
  if (search && search.trim()) {
    const needle = `%${search.trim().toLowerCase()}%`;
    return db
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
        isAdmin: users.isAdmin,
        createdAt: users.createdAt,
        membershipStatus: memberships.status,
        plan: memberships.plan,
        currentPeriodEnd: memberships.currentPeriodEnd,
      })
      .from(users)
      .leftJoin(memberships, eq(memberships.userId, users.id))
      .where(sql`LOWER(${users.email}) LIKE ${needle}`)
      .orderBy(desc(users.createdAt))
      .limit(limit);
  }
  return db
    .select({
      id: users.id,
      email: users.email,
      name: users.name,
      isAdmin: users.isAdmin,
      createdAt: users.createdAt,
      membershipStatus: memberships.status,
      plan: memberships.plan,
      currentPeriodEnd: memberships.currentPeriodEnd,
    })
    .from(users)
    .leftJoin(memberships, eq(memberships.userId, users.id))
    .orderBy(desc(users.createdAt))
    .limit(limit);
}

export async function getMemberById(id: string) {
  const [u] = await db
    .select({
      id: users.id,
      email: users.email,
      name: users.name,
      isAdmin: users.isAdmin,
      createdAt: users.createdAt,
    })
    .from(users)
    .where(eq(users.id, id))
    .limit(1);
  if (!u) return null;
  const [m] = await db
    .select()
    .from(memberships)
    .where(eq(memberships.userId, id))
    .limit(1);
  const ruleCount = await db
    .select({ n: sql<number>`COUNT(*)::int` })
    .from(alertRules)
    .where(eq(alertRules.userId, id));
  return {
    ...u,
    membership: m ?? null,
    alertRuleCount: ruleCount[0]?.n ?? 0,
  };
}

export async function getAuditLog(limit = 100, action?: string) {
  const base = db
    .select({
      id: auditLog.id,
      actorUserId: auditLog.actorUserId,
      actorEmail: users.email,
      action: auditLog.action,
      target: auditLog.target,
      meta: auditLog.meta,
      createdAt: auditLog.createdAt,
    })
    .from(auditLog)
    .leftJoin(users, eq(users.id, auditLog.actorUserId))
    .orderBy(desc(auditLog.createdAt))
    .limit(limit);
  if (action) {
    return base.where(eq(auditLog.action, action));
  }
  return base;
}

export async function getStatusBreakdown(): Promise<Record<string, number>> {
  const rows = await db
    .select({
      status: memberships.status,
      n: sql<number>`COUNT(*)::int`,
    })
    .from(memberships)
    .groupBy(memberships.status);
  const out: Record<string, number> = {};
  for (const r of rows) {
    if (r.status) out[r.status] = r.n;
  }
  return out;
}

