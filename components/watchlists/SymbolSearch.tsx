'use client';
// Autocomplete add-symbol input. Fetches matches from the latest scan's
// universe via /api/watchlists/symbol-search, shows a dropdown of up to 8
// suggestions, supports keyboard nav (↑/↓/Enter/Esc), and filters out
// symbols already in the current watchlist.
import { useEffect, useRef, useState, useTransition } from 'react';
import { Plus, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { addSymbol } from '@/app/watchlists/actions';

export interface SymbolSearchProps {
  watchlistId: string;
  excluded: string[];
}

const MAX_SUGGESTIONS = 8;

export default function SymbolSearch({
  watchlistId,
  excluded,
}: SymbolSearchProps) {
  const [value, setValue] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(0);
  const router = useRouter();
  const excludedSet = new Set(excluded.map((s) => s.toUpperCase()));
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fetchSeq = useRef(0);

  // Debounced fetch of autocomplete matches. All state updates happen
  // inside the timeout so we don't trip react-hooks/set-state-in-effect.
  useEffect(() => {
    const q = value.trim().toUpperCase();
    const seq = ++fetchSeq.current;
    const t = setTimeout(async () => {
      if (!q) {
        setSuggestions([]);
        setOpen(false);
        return;
      }
      try {
        const res = await fetch(
          `/api/watchlists/symbol-search?prefix=${encodeURIComponent(q)}`,
          { credentials: 'include' },
        );
        if (!res.ok) return;
        const data = (await res.json()) as { symbols: string[] };
        if (seq !== fetchSeq.current) return; // stale response
        const filtered = data.symbols
          .filter((s) => !excludedSet.has(s))
          .slice(0, MAX_SUGGESTIONS);
        setSuggestions(filtered);
        setOpen(filtered.length > 0);
        setHighlight(0);
      } catch {
        /* ignore — silent fail keeps the manual-typing path open */
      }
    }, 150);
    return () => clearTimeout(t);
  }, [value, excluded]); // eslint-disable-line react-hooks/exhaustive-deps

  // Click-outside closes the dropdown.
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  function addOne(sym: string) {
    const symbol = sym.trim().toUpperCase();
    setError(null);
    if (!symbol) return;
    if (!/^[A-Z]{1,8}$/.test(symbol)) {
      setError('Invalid ticker');
      return;
    }
    if (excludedSet.has(symbol)) {
      setError('Already in list');
      return;
    }
    start(async () => {
      try {
        await addSymbol(watchlistId, symbol);
        setValue('');
        setSuggestions([]);
        setOpen(false);
        router.refresh();
        inputRef.current?.focus();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Add failed');
      }
    });
  }

  function submit() {
    // If a dropdown row is highlighted, prefer it; otherwise use the typed value.
    const sym = open && suggestions[highlight] ? suggestions[highlight] : value;
    addOne(sym);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!open) {
      if (e.key === 'Enter') {
        e.preventDefault();
        submit();
      }
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlight((h) => Math.min(h + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlight((h) => Math.max(h - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      submit();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setOpen(false);
    } else if (e.key === 'Tab') {
      setOpen(false);
    }
  }

  return (
    <div ref={containerRef} className="relative inline-flex flex-col gap-1">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
        className="inline-flex items-center gap-1.5 pl-2 pr-1 py-1 border border-dashed border-white/22 hover:border-white/35 rounded-sm bg-[#0B0B0B]"
      >
        <Search size={11} className="text-[oklch(0.82_0.16_75)]" />
        <input
          ref={inputRef}
          value={value}
          onChange={(e) => {
            setValue(e.target.value.toUpperCase());
            setError(null);
          }}
          onFocus={() => {
            if (suggestions.length > 0) setOpen(true);
          }}
          onKeyDown={onKeyDown}
          placeholder="ADD TICKER"
          maxLength={8}
          disabled={pending}
          autoComplete="off"
          spellCheck={false}
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={open}
          aria-controls="symbol-search-listbox"
          className="bg-transparent text-[12px] text-white outline-none w-[110px] placeholder:text-white/40 tabular-nums uppercase tracking-[0.04em]"
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

      {open && suggestions.length > 0 && (
        <ul
          id="symbol-search-listbox"
          role="listbox"
          className="absolute top-full left-0 mt-1 z-30 min-w-[180px] max-h-[260px] overflow-y-auto border border-white/15 bg-[#0B0B0B] rounded-sm shadow-[0_4px_24px_rgba(0,0,0,0.6)]"
        >
          {suggestions.map((s, i) => (
            <li
              key={s}
              role="option"
              aria-selected={i === highlight}
              onMouseDown={(e) => {
                e.preventDefault(); // prevent input blur before click handler
                addOne(s);
              }}
              onMouseEnter={() => setHighlight(i)}
              className={`px-3 py-1.5 text-[12px] tabular-nums tracking-[0.04em] cursor-pointer ${
                i === highlight
                  ? 'bg-[oklch(0.82_0.16_75/0.15)] text-[oklch(0.86_0.14_75)]'
                  : 'text-white/85 hover:bg-white/5'
              }`}
            >
              {s}
            </li>
          ))}
        </ul>
      )}

      {error && (
        <span className="text-[10px] uppercase tracking-[0.08em] text-[oklch(0.74_0.17_28)]">
          {error}
        </span>
      )}
    </div>
  );
}
