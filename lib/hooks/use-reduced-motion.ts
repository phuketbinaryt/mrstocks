'use client';

import { useEffect, useState } from 'react';

/**
 * Tracks the user's `prefers-reduced-motion` setting.
 *
 * Returns `false` on the server and the first client render (so SSR markup is
 * stable), then syncs to the real media-query value in an effect. Components
 * that consume this MUST render their FINAL animation state when it returns
 * `true` — no marquee, streaming, count-up, morph, or pulse.
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return reduced;
}
