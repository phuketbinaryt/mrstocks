import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { createHmac } from 'node:crypto';
import { drizzle } from 'drizzle-orm/postgres-js';
import { and, eq } from 'drizzle-orm';
import postgres from 'postgres';
import { users, accounts, memberships } from '@/lib/db/schema';

const url = process.env.DATABASE_URL!;
const secret = process.env.WHOP_WEBHOOK_SECRET!;
const base = process.env.INGEST_TEST_BASE_URL ?? 'http://127.0.0.1:3200';
const client = postgres(url, { max: 1 });
const db = drizzle(client, { schema: { users, accounts, memberships } });

const TEST_USER_EMAIL = `whop-webhook-${Date.now()}@example.com`;
const WHOP_USER_ID = `whop_test_${Date.now()}`;
let createdUserId = '';

describe('POST /api/webhooks/whop', () => {
  beforeAll(async () => {
    const [u] = await db
      .insert(users)
      .values({ email: TEST_USER_EMAIL })
      .returning({ id: users.id });
    createdUserId = u.id;
    await db.insert(accounts).values({
      userId: u.id,
      type: 'oauth',
      provider: 'whop',
      providerAccountId: WHOP_USER_ID,
    });
  });

  afterAll(async () => {
    await db.delete(memberships).where(eq(memberships.userId, createdUserId));
    await db
      .delete(accounts)
      .where(
        and(
          eq(accounts.provider, 'whop'),
          eq(accounts.providerAccountId, WHOP_USER_ID),
        ),
      );
    await db.delete(users).where(eq(users.id, createdUserId));
    await client.end();
  });

  it('marks membership active on membership.went_valid', async () => {
    const event = {
      event: 'membership.went_valid',
      data: {
        id: 'mem_abc123',
        product: 'pass_test',
        user: WHOP_USER_ID,
        plan: 'monthly',
        status: 'active',
        valid: true,
        renewal_period_end: Math.floor(Date.now() / 1000) + 30 * 86400,
      },
    };
    const body = JSON.stringify(event);
    const sig = createHmac('sha256', secret).update(body).digest('hex');

    const res = await fetch(`${base}/api/webhooks/whop`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-whop-signature': sig },
      body,
    });
    expect(res.status).toBe(200);

    const [row] = await db
      .select()
      .from(memberships)
      .where(eq(memberships.userId, createdUserId));
    expect(row.status).toBe('active');
    expect(row.whopMembershipId).toBe('mem_abc123');
  });

  it('rejects bad signature with 401', async () => {
    const res = await fetch(`${base}/api/webhooks/whop`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-whop-signature': 'sha256=deadbeef',
      },
      body: '{}',
    });
    expect(res.status).toBe(401);
  });
});
