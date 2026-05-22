import 'server-only';
import { db } from '@/lib/db/client';
import { auditLog } from '@/lib/db/schema';

export interface AuditEvent {
  /** ID of the user performing the action. Null for system events. */
  actorUserId: string | null;
  /** Stable, dot-namespaced event name. e.g. 'admin.grant_admin'. */
  action: string;
  /** Stable identifier of the affected entity (usually another user_id
   *  or rule_id). Optional for actor-only events. */
  target?: string | null;
  /** Free-form structured payload for this event. */
  meta?: Record<string, unknown> | null;
}

/**
 * Append an event to the audit_log. Best-effort: a DB failure here MUST
 * NOT break the calling Server Action / webhook handler. We log and
 * swallow.
 *
 * High-volume events (e.g. scan ingest) should NOT be logged here —
 * journald already retains them.
 */
export async function logAuditEvent(evt: AuditEvent): Promise<void> {
  try {
    await db.insert(auditLog).values({
      actorUserId: evt.actorUserId,
      action: evt.action,
      target: evt.target ?? null,
      meta: (evt.meta ?? null) as unknown as Record<string, unknown> | null,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[audit] insert failed:', message, {
      action: evt.action,
      target: evt.target,
    });
  }
}
