'use client';
// Bare add-symbol input. Validates 1-8 letters client-side before calling
// the server action (which validates again). Typeahead autocomplete is
// deferred to a future polish pass — the searchUniverseSymbols helper
// already exists in lib/watchlists/symbol-universe.ts when we're ready.
import { useState, useTransition } from 'react';
import { Plus, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { addSymbol } from '@/app/watchlists/actions';

export interface SymbolSearchProps {
  watchlistId: string;
  excluded: string[];
}

export default function SymbolSearch({
  watchlistId,
  excluded,
}: SymbolSearchProps) {
  const [value, setValue] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const router = useRouter();
  const excludedSet = new Set(excluded.map((s) => s.toUpperCase()));

  function submit() {
    const sym = value.trim().toUpperCase();
    setError(null);
    if (!sym) return;
    if (!/^[A-Z]{1,8}$/.test(sym)) {
      setError('Invalid ticker');
      return;
    }
    if (excludedSet.has(sym)) {
      setError('Already in list');
      return;
    }
    start(async () => {
      try {
        await addSymbol(watchlistId, sym);
        setValue('');
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Add failed');
      }
    });
  }

  return (
    <div className="inline-flex flex-col gap-1">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
        className="inline-flex items-center gap-1.5 pl-2 pr-1 py-1 border border-dashed border-white/22 hover:border-white/35 rounded-sm bg-[#0B0B0B]"
      >
        <Search size={11} className="text-[oklch(0.82_0.16_75)]" />
        <input
          value={value}
          onChange={(e) => setValue(e.target.value.toUpperCase())}
          placeholder="ADD TICKER"
          maxLength={8}
          disabled={pending}
          className="bg-transparent text-[12px] text-white outline-none w-[100px] placeholder:text-white/40 tabular-nums uppercase tracking-[0.04em]"
        />
        <button
          type="submit"
          aria-label="Add symbol"
          disabled={pending || !value.trim()}
          className="p-0.5 rounded-sm text-[oklch(0.82_0.16_75)] hover:text-[oklch(0.86_0.14_75)] disabled:opacity-40"
        >
          <Plus size={12} />
        </button>
      </form>
      {error && (
        <span className="text-[10px] uppercase tracking-[0.08em] text-[oklch(0.74_0.17_28)]">
          {error}
        </span>
      )}
    </div>
  );
}
