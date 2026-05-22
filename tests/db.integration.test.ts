import { describe, it, expect, afterAll } from 'vitest';
import { drizzle } from 'drizzle-orm/postgres-js';
import { eq } from 'drizzle-orm';
import postgres from 'postgres';
import { users } from '@/lib/db/schema';

const url = process.env.DATABASE_URL!;
const client = postgres(url, { max: 1 });
const db = drizzle(client, { schema: { users } });

describe('db users table', () => {
  const testEmail = `test-${Date.now()}@example.com`;

  afterAll(async () => {
    await db.delete(users).where(eq(users.email, testEmail));
    await client.end();
  });

  it('inserts and reads a user', async () => {
    await db.insert(users).values({ email: testEmail, name: 'Test User' });
    const rows = await db.select().from(users).where(eq(users.email, testEmail));
    expect(rows).toHaveLength(1);
    expect(rows[0].email).toBe(testEmail);
    expect(rows[0].id).toMatch(/^[0-9a-f-]{36}$/);
  });
});
