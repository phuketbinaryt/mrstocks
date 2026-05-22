import {
  pgTable,
  text,
  timestamp,
  primaryKey,
  integer,
  uuid,
  numeric,
  jsonb,
  boolean,
  index,
  uniqueIndex,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import type { AdapterAccountType } from 'next-auth/adapters';

export const users = pgTable('users', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text('name'),
  email: text('email').unique().notNull(),
  emailVerified: timestamp('email_verified', { mode: 'date' }),
  image: text('image'),
  isAdmin: boolean('is_admin').notNull().default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const accounts = pgTable(
  'accounts',
  {
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    type: text('type').$type<AdapterAccountType>().notNull(),
    provider: text('provider').notNull(),
    providerAccountId: text('provider_account_id').notNull(),
    refresh_token: text('refresh_token'),
    access_token: text('access_token'),
    expires_at: integer('expires_at'),
    token_type: text('token_type'),
    scope: text('scope'),
    id_token: text('id_token'),
    session_state: text('session_state'),
  },
  (account) => ({
    compoundKey: primaryKey({ columns: [account.provider, account.providerAccountId] }),
  }),
);

export const sessions = pgTable('sessions', {
  sessionToken: text('session_token').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  expires: timestamp('expires', { mode: 'date' }).notNull(),
});

export const verificationTokens = pgTable(
  'verification_tokens',
  {
    identifier: text('identifier').notNull(),
    token: text('token').notNull(),
    expires: timestamp('expires', { mode: 'date' }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  }),
);

export const scans = pgTable('scans', {
  id: uuid('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  generatedAt: timestamp('generated_at', { mode: 'date', withTimezone: true }).notNull().unique(),
  scannerName: text('scanner_name').notNull(),
  feed: text('feed'),
  barSeconds: integer('bar_seconds'),
  universeSize: integer('universe_size'),
  candidateCount: integer('candidate_count').notNull(),
  settings: jsonb('settings'),
  raw: jsonb('raw').notNull(),
  ingestedAt: timestamp('ingested_at', { mode: 'date', withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const scanCandidates = pgTable(
  'scan_candidates',
  {
    scanId: uuid('scan_id')
      .notNull()
      .references(() => scans.id, { onDelete: 'cascade' }),
    symbol: text('symbol').notNull(),
    state: text('state').notNull(),
    watch: text('watch'),
    location: text('location'),
    score: numeric('score'),
    lastPrice: numeric('last_price'),
    maDistanceAtr: numeric('ma_distance_atr'),
    maDistancePct: numeric('ma_distance_pct'),
    gapAtr: numeric('gap_atr'),
    avgDollarVolume: numeric('avg_dollar_volume'),
    prior45Position: text('prior45_position'),
    prior45Action: text('prior45_action'),
    data: jsonb('data').notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.scanId, table.symbol] }),
  }),
);

export const memberships = pgTable('memberships', {
  userId: text('user_id')
    .primaryKey()
    .references(() => users.id, { onDelete: 'cascade' }),
  whopMembershipId: text('whop_membership_id'),
  whopUserId: text('whop_user_id'),
  status: text('status').notNull(), // 'active' | 'past_due' | 'canceled' | 'trialing' | 'expired'
  plan: text('plan'),
  currentPeriodEnd: timestamp('current_period_end', { mode: 'date', withTimezone: true }),
  updatedAt: timestamp('updated_at', { mode: 'date', withTimezone: true }).defaultNow().notNull(),
});

export const watchlists = pgTable(
  'watchlists',
  {
    id: uuid('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    isDefault: boolean('is_default').notNull().default(false),
    createdAt: timestamp('created_at', { mode: 'date', withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    userIdIdx: index('watchlists_user_id_idx').on(table.userId),
    // Enforce at most one default per user via a partial unique index.
    // Drizzle expresses partial indexes via .where().
    oneDefaultPerUser: uniqueIndex('one_default_per_user')
      .on(table.userId)
      .where(sql`is_default = TRUE`),
  }),
);

export const watchlistSymbols = pgTable(
  'watchlist_symbols',
  {
    watchlistId: uuid('watchlist_id')
      .notNull()
      .references(() => watchlists.id, { onDelete: 'cascade' }),
    symbol: text('symbol').notNull(),
    addedAt: timestamp('added_at', { mode: 'date', withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.watchlistId, table.symbol] }),
    symbolIdx: index('watchlist_symbols_symbol_idx').on(table.symbol),
  }),
);

export const alertRules = pgTable(
  'alert_rules',
  {
    id: uuid('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    active: boolean('active').notNull().default(true),
    states: text('states').array().notNull(),
    zones: text('zones').array().notNull(),
    watchlistId: uuid('watchlist_id').references(() => watchlists.id, {
      onDelete: 'set null',
    }),
    minScore: numeric('min_score').notNull().default('0'),
    channels: text('channels').array().notNull(),
    createdAt: timestamp('created_at', { mode: 'date', withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    userIdIdx: index('alert_rules_user_id_idx').on(table.userId),
  }),
);

export const notifications = pgTable(
  'notifications',
  {
    id: uuid('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    ruleId: uuid('rule_id').references(() => alertRules.id, {
      onDelete: 'set null',
    }),
    scanId: uuid('scan_id').references(() => scans.id, { onDelete: 'cascade' }),
    symbols: text('symbols').array().notNull(),
    channel: text('channel').notNull(), // 'email' | 'webpush'
    delivered: boolean('delivered').notNull().default(false),
    error: text('error'),
    sentAt: timestamp('sent_at', { mode: 'date', withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    userIdIdx: index('notifications_user_id_idx').on(table.userId),
    sentAtIdx: index('notifications_sent_at_idx').on(table.sentAt),
  }),
);

export const auditLog = pgTable(
  'audit_log',
  {
    id: uuid('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    actorUserId: text('actor_user_id').references(() => users.id, {
      onDelete: 'set null',
    }),
    action: text('action').notNull(),
    target: text('target'),
    meta: jsonb('meta'),
    createdAt: timestamp('created_at', { mode: 'date', withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    actionIdx: index('audit_log_action_idx').on(table.action),
    createdAtIdx: index('audit_log_created_at_idx').on(table.createdAt),
  }),
);

export const pushSubscriptions = pgTable(
  'push_subscriptions',
  {
    id: uuid('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    endpoint: text('endpoint').notNull().unique(),
    p256dh: text('p256dh').notNull(),
    authKey: text('auth_key').notNull(),
    userAgent: text('user_agent'),
    createdAt: timestamp('created_at', { mode: 'date', withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    userIdIdx: index('push_subscriptions_user_id_idx').on(table.userId),
  }),
);
