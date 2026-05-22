import {
  pgTable,
  text,
  timestamp,
  primaryKey,
  integer,
  uuid,
  numeric,
  jsonb,
} from 'drizzle-orm/pg-core';
import type { AdapterAccountType } from 'next-auth/adapters';

export const users = pgTable('users', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text('name'),
  email: text('email').unique().notNull(),
  emailVerified: timestamp('email_verified', { mode: 'date' }),
  image: text('image'),
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
