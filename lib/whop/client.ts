import 'server-only';
import { env } from '@/lib/env';
import type {
  WhopMembership,
  WhopMembershipListResponse,
  WhopUser,
} from './types';

// Whop API v5 base. If a path 404s, check current docs at https://docs.whop.com.
const BASE = 'https://api.whop.com/api/v5';

async function whopFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${env.WHOP_API_KEY}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(init.headers ?? {}),
    },
    // Don't cache — membership status changes intra-day on cancel/expire.
    cache: 'no-store',
  });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`Whop API ${res.status} ${path}: ${body.slice(0, 200)}`);
  }
  return (await res.json()) as T;
}

export async function getWhopUserById(
  whopUserId: string,
): Promise<WhopUser | null> {
  try {
    return await whopFetch<WhopUser>(
      `/users/${encodeURIComponent(whopUserId)}`,
    );
  } catch (err) {
    if (err instanceof Error && err.message.includes('404')) return null;
    throw err;
  }
}

/**
 * Returns the most recent membership for this Whop user on OUR product.
 * Used at sign-in time as the source of truth.
 */
export async function getActiveMembershipForUser(
  whopUserId: string,
): Promise<WhopMembership | null> {
  const data = await whopFetch<WhopMembershipListResponse>(
    `/memberships?user=${encodeURIComponent(whopUserId)}&product=${encodeURIComponent(env.WHOP_PASS_ID)}`,
  );
  if (!data.data || data.data.length === 0) return null;
  // Prefer a valid one; fall back to most recent.
  const valid = data.data.find((m) => m.valid && m.status === 'active');
  if (valid) return valid;
  return data.data[0];
}
