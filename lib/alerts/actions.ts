'use server';
import 'server-only';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db/client';
import { alertRules, watchlists } from '@/lib/db/schema';
import { and, eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { ALL_STATES, ALL_ZONES } from './types';

async function userIdOrThrow(): Promise<string> {
  const session = await auth();
  if (!session?.user?.id) throw new Error('not authenticated');
  return session.user.id;
}

const VALID_STATES = new Set<string>(ALL_STATES);
const VALID_ZONES = new Set<string>(ALL_ZONES);
const VALID_CHANNELS = new Set(['email', 'webpush']);

export interface CreateRuleInput {
  name: string;
  states: string[];
  zones: string[];
  watchlistId: string | null;
  minScore: number;
  channels: string[];
  active?: boolean;
}

function sanitizeInput(input: CreateRuleInput): {
  name: string;
  states: string[];
  zones: string[];
  watchlistId: string | null;
  minScore: number;
  channels: string[];
  active: boolean;
} {
  const name = (input.name ?? '').trim();
  if (!name || name.length > 80) {
    throw new Error('name must be 1-80 characters');
  }
  const states = Array.from(new Set(input.states ?? [])).filter((s) =>
    VALID_STATES.has(s),
  );
  if (states.length === 0) {
    throw new Error('at least one setup state required');
  }
  const zones = Array.from(new Set(input.zones ?? [])).filter((z) =>
    VALID_ZONES.has(z),
  );
  if (zones.length === 0) {
    throw new Error('at least one prior45 zone required');
  }
  const channels = Array.from(new Set(input.channels ?? [])).filter((c) =>
    VALID_CHANNELS.has(c),
  );
  if (channels.length === 0) {
    throw new Error('at least one notification channel required');
  }
  const minScore = Number(input.minScore);
  if (!Number.isFinite(minScore) || minScore < 0 || minScore > 100) {
    throw new Error('min score must be between 0 and 100');
  }
  return {
    name,
    states,
    zones,
    watchlistId: input.watchlistId ?? null,
    minScore,
    channels,
    active: input.active ?? true,
  };
}

async function assertWatchlistOwnership(
  userId: string,
  watchlistId: string,
): Promise<void> {
  const [row] = await db
    .select({ id: watchlists.id })
    .from(watchlists)
    .where(and(eq(watchlists.id, watchlistId), eq(watchlists.userId, userId)))
    .limit(1);
  if (!row) throw new Error('watchlist not found or not owned by user');
}

export async function createRule(input: CreateRuleInput): Promise<{ id: string }> {
  const userId = await userIdOrThrow();
  const data = sanitizeInput(input);
  if (data.watchlistId) await assertWatchlistOwnership(userId, data.watchlistId);

  const [row] = await db
    .insert(alertRules)
    .values({
      userId,
      name: data.name,
      active: data.active,
      states: data.states,
      zones: data.zones,
      watchlistId: data.watchlistId,
      minScore: data.minScore.toString(),
      channels: data.channels,
    })
    .returning({ id: alertRules.id });

  revalidatePath('/alerts');
  return { id: row.id };
}

export async function updateRule(
  id: string,
  input: CreateRuleInput,
): Promise<void> {
  const userId = await userIdOrThrow();
  const data = sanitizeInput(input);
  if (data.watchlistId) await assertWatchlistOwnership(userId, data.watchlistId);

  const result = await db
    .update(alertRules)
    .set({
      name: data.name,
      active: data.active,
      states: data.states,
      zones: data.zones,
      watchlistId: data.watchlistId,
      minScore: data.minScore.toString(),
      channels: data.channels,
    })
    .where(and(eq(alertRules.id, id), eq(alertRules.userId, userId)))
    .returning({ id: alertRules.id });
  if (result.length === 0) throw new Error('rule not found');

  revalidatePath('/alerts');
  revalidatePath(`/alerts/${id}/edit`);
}

export async function toggleRuleActive(id: string): Promise<void> {
  const userId = await userIdOrThrow();
  const [existing] = await db
    .select({ active: alertRules.active })
    .from(alertRules)
    .where(and(eq(alertRules.id, id), eq(alertRules.userId, userId)))
    .limit(1);
  if (!existing) throw new Error('rule not found');
  await db
    .update(alertRules)
    .set({ active: !existing.active })
    .where(and(eq(alertRules.id, id), eq(alertRules.userId, userId)));
  revalidatePath('/alerts');
}

export async function deleteRule(id: string): Promise<void> {
  const userId = await userIdOrThrow();
  await db
    .delete(alertRules)
    .where(and(eq(alertRules.id, id), eq(alertRules.userId, userId)));
  revalidatePath('/alerts');
}

/**
 * Server Action form handler for the new-rule page. Accepts FormData and
 * redirects back to /alerts on success.
 */
export async function createRuleFromForm(formData: FormData): Promise<void> {
  const input = parseFormData(formData);
  await createRule(input);
  redirect('/alerts');
}

export async function updateRuleFromForm(
  id: string,
  formData: FormData,
): Promise<void> {
  const input = parseFormData(formData);
  await updateRule(id, input);
  redirect('/alerts');
}

function parseFormData(formData: FormData): CreateRuleInput {
  const name = String(formData.get('name') ?? '');
  const states = formData.getAll('states').map((v) => String(v));
  const zones = formData.getAll('zones').map((v) => String(v));
  const channels = formData.getAll('channels').map((v) => String(v));
  const watchlistRaw = String(formData.get('watchlistId') ?? '');
  const watchlistId =
    watchlistRaw && watchlistRaw !== 'any' ? watchlistRaw : null;
  const minScore = Number(formData.get('minScore') ?? 0);
  const active = formData.get('active') !== 'off';
  return { name, states, zones, watchlistId, minScore, channels, active };
}
