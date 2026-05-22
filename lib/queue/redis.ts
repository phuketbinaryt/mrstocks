import 'server-only';
import { Redis } from 'ioredis';
import { env } from '@/lib/env';

let _redis: Redis | null = null;

/**
 * Lazy-singleton ioredis connection used by BullMQ queues + workers.
 *
 * BullMQ requires `maxRetriesPerRequest: null` on the underlying ioredis
 * client; without it queue.add() can block in a 'wait' state if the broker
 * stalls. We default to `redis://localhost:6379` when REDIS_URL is unset so
 * tests + dev work without extra env setup.
 */
export function getRedis(): Redis {
  if (_redis) return _redis;
  const url = env.REDIS_URL ?? 'redis://localhost:6379';
  _redis = new Redis(url, {
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
  });
  // Avoid noisy unhandled-error logs in tests when Redis isn't running.
  _redis.on('error', (err) => {
    if (process.env.NODE_ENV !== 'test') {
      console.error('[redis]', err.message);
    }
  });
  return _redis;
}
