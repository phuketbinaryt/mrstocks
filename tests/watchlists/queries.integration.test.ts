import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { drizzle } from 'drizzle-orm/postgres-js';
import { eq } from 'drizzle-orm';
import postgres from 'postgres';
import {
  users,
  watchlists,
  watchlistSymbols,
} from '@/lib/db/schema';
import {
  listWatchlistsForUser,
  getWatchlistByIdForUser,
  getDefaultWatchlistForUser,
} from '@/lib/watchlists/queries';

const url = process.env.DATABASE_URL!;
const client = postgres(url, { max: 1 });
const db = drizzle(client, {
  schema: { users, watchlists, watchlistSymbols },
});

const EMAIL = `wl-q-${Date.now()}@example.com`;
let userId = '';
let listAId = '';
let listBId = '';

describe('watchlist queries', () => {
  beforeAll(async () => {
    const [u] = await db
      .insert(users)
      .values({ email: EMAIL })
      .returning({ id: users.id });
    userId = u.id;
    const [a] = await db
      .insert(watchlists)
      .values({ userId, name: 'A', isDefault: true })
      .returning({ id: watchlists.id });
    listAId = a.id;
    const [b] = await db
      .insert(watchlists)
      .values({ userId, name: 'B', isDefault: false })
      .returning({ id: watchlists.id });
    listBId = b.id;
    await db.insert(watchlistSymbols).values([
      { watchlistId: listAId, symbol: 'AAPL' },
      { watchlistId: listAId, symbol: 'NVDA' },
      { watchlistId: listBId, symbol: 'MSFT' },
    ]);
  });

  afterAll(async () => {
    await db.delete(users).where(eq(users.id, userId));
    await client.end();
  });

  it('lists both watchlists with correct symbol counts', async () => {
    const rows = await listWatchlistsForUser(userId);
    expect(rows).toHaveLength(2);
    const a = rows.find((r) => r.name === 'A')!;
    expect(a.symbolCount).toBe(2);
    expect(a.isDefault).toBe(true);
    const b = rows.find((r) => r.name === 'B')!;
    expect(b.symbolCount).toBe(1);
    expect(b.isDefault).toBe(false);
  });

  it('getWatchlistByIdForUser returns symbols', async () => {
    const w = await getWatchlistByIdForUser(userId, listAId);
    expect(w?.symbols.sort()).toEqual(['AAPL', 'NVDA']);
    expect(w?.name).toBe('A');
  });

  it("returns null for someone else's watchlist", async () => {
    const w = await getWatchlistByIdForUser('not-me', listAId);
    expect(w).toBeNull();
  });

  it('returns null for missing list', async () => {
    const w = await getWatchlistByIdForUser(
      userId,
      '00000000-0000-0000-0000-000000000000',
    );
    expect(w).toBeNull();
  });

  it('getDefaultWatchlistForUser returns the default', async () => {
    const d = await getDefaultWatchlistForUser(userId);
    expect(d?.id).toBe(listAId);
  });

  it('listWatchlistsForUser returns [] for a user with no lists', async () => {
    const [u] = await db
      .insert(users)
      .values({ email: `wl-q-empty-${Date.now()}@example.com` })
      .returning({ id: users.id });
    try {
      const rows = await listWatchlistsForUser(u.id);
      expect(rows).toEqual([]);
    } finally {
      await db.delete(users).where(eq(users.id, u.id));
    }
  });
});
