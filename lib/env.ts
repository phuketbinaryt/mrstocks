import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().url().startsWith('postgres://'),
    AUTH_SECRET: z.string().min(32),
    AUTH_URL: z.string().url(),
    RESEND_API_KEY: z.string().min(1),
    EMAIL_FROM: z.string().email(),
    REDIS_URL: z.string().url().startsWith('redis://').optional(),
    INGEST_SHARED_SECRET: z.string().min(32),
  },
  client: {},
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    AUTH_SECRET: process.env.AUTH_SECRET,
    AUTH_URL: process.env.AUTH_URL,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    EMAIL_FROM: process.env.EMAIL_FROM,
    REDIS_URL: process.env.REDIS_URL,
    INGEST_SHARED_SECRET: process.env.INGEST_SHARED_SECRET,
  },
  emptyStringAsUndefined: true,
});
