import { describe, it, expect, afterAll } from 'vitest';
import { drizzle } from 'drizzle-orm/postgres-js';
import { eq } from 'drizzle-orm';
import postgres from 'postgres';
import { computeHmac } from '@/lib/ingest/verify-hmac';
import { scans, scanCandidates } from '@/lib/db/schema';
import sample from './fixtures/sample-scan.json';

const url = process.env.DATABASE_URL!;
const secret = process.env.INGEST_SHARED_SECRET!;
const baseUrl = process.env.INGEST_TEST_BASE_URL ?? 'http://127.0.0.1:3200';

const client = postgres(url, { max: 1 });
const db = drizzle(client, { schema: { scans, scanCandidates } });

describe('POST /api/ingest/scan', () => {
  // Use a unique generated_at per test run so we don't collide with previous runs.
  const generatedAt = new Date().toISOString();
  const payload = { ...sample, generated_at: generatedAt };
  const body = JSON.stringify(payload);
  const sig = `sha256=${computeHmac(body, secret)}`;

  afterAll(async () => {
    await db.delete(scans).where(eq(scans.generatedAt, new Date(generatedAt)));
    await client.end();
  });

  it('accepts a signed payload and persists rows', async () => {
    const res = await fetch(`${baseUrl}/api/ingest/scan`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-signature': sig },
      body,
    });
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.status).toBe('created');
    expect(data.candidateCount).toBe(sample.candidate_count);

    const rows = await db
      .select()
      .from(scans)
      .where(eq(scans.generatedAt, new Date(generatedAt)));
    expect(rows).toHaveLength(1);
    expect(rows[0].scannerName).toBe(sample.scanner);

    const cands = await db
      .select({ symbol: scanCandidates.symbol })
      .from(scanCandidates)
      .where(eq(scanCandidates.scanId, rows[0].id));
    expect(cands.map((c) => c.symbol).sort()).toEqual(['AAPL', 'NVDA', 'TSLA']);
  });

  it('replaying the same generated_at is a noop', async () => {
    const res = await fetch(`${baseUrl}/api/ingest/scan`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-signature': sig },
      body,
    });
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.status).toBe('noop');
  });

  it('rejects a bad signature with 401', async () => {
    const res = await fetch(`${baseUrl}/api/ingest/scan`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-signature': 'sha256=deadbeef',
      },
      body,
    });
    expect(res.status).toBe(401);
  });

  it('rejects a malformed payload with 422', async () => {
    const bad = JSON.stringify({ generated_at: generatedAt });
    const badSig = `sha256=${computeHmac(bad, secret)}`;
    const res = await fetch(`${baseUrl}/api/ingest/scan`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-signature': badSig },
      body: bad,
    });
    expect(res.status).toBe(422);
  });
});
