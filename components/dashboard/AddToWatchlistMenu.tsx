'use client';
// Card-anchored dropdown for adding the card's symbol to an existing
// watchlist or creating a new one inline. Triggered from the StockCard
// header. Closes on outside click, Esc, or successful add.
import { useEffect, useRef, useState, useTransition } from 'react';
import { Check, Plus, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
  addSymbol,
  createWatchlistAndAddSymbol,
} from '@/app/watchlists/actions';

export interface AddToWatchlistMenuProps {
  symbol: string;
  lists: { id: string; name: string }[];
  symbolsByList: Record<string, string[]>;
  onClose: () => void;
}

export default function AddToWatchlistMenu({
  symbol,
  lists,
  symbolsByList,
  onClose,
}: AddToWatchlistMenuProps) {
  // newName === null  → "+ NEW LIST" trigger visible
  // newName === ''+   → inline create form open
  const [newName, setNewName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!ref.current?.contains(e.target as Node)) onClose();
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  function inList(listId: string): boolean {
    return (symbolsByList[listId] ?? []).includes(symbol);
  }

  function addToExisting(listId: string) {
    if (inList(listId) || pending) return;
    setError(null);
    start(async () => {
      try {
        await addSymbol(listId, symbol);
        router.refresh();
        onClose();
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Add failed');
      }
    });
  }

  function submitCreate() {
    const name = (newName ?? '').trim();
    if (!name || pending) return;
    setError(null);
    start(async () => {
      try {
        await createWatchlistAndAddSymbol(name, symbol);
        router.refresh();
        onClose();
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Create failed');
      }
    });
  }

  return (
    <div
      ref={ref}
      role="menu"
      className="absolute top-full right-0 mt-1 z-40 min-w-[220px] border border-white/15 bg-[#0B0B0B] rounded-sm shadow-[0_8px_28px_rgba(0,0,0,0.7)]"
      onClick={(e) => e.stopPropagation()}
      onKeyDown={(e) => e.stopPropagation()}
    >
      <div className="px-3 py-2 border-b border-white/8">
        <span className="text-[9.5px] uppercase tracking-[0.18em] text-[oklch(0.82_0.16_75)]">
          ADD
        </span>{' '}
        <span className="text-[9.5px] uppercase tracking-[0.06em] text-white/85 font-mono">
          {symbol}
        </span>{' '}
        <span className="text-[9.5px] uppercase tracking-[0.18em] text-white/45">
          TO LIST
        </span>
      </div>

      <ul className="max-h-[200px] overflow-y-auto">
        {lists.length === 0 ? (
          <li className="px-3 py-2.5 text-[11px] text-white/55">
            No watchlists yet — create one below.
          </li>
        ) : (
          lists.map((l) => {
            const isIn = inList(l.id);
            return (
              <li key={l.id}>
                <button
                  type="button"
                  role="menuitem"
                  disabled={pending || isIn}
                  onClick={() => addToExisting(l.id)}
                  className={`w-full flex items-center justify-between gap-2 px-3 py-1.5 text-[12px] text-left tracking-[0.02em] ${
                    isIn
                      ? 'text-white/45 cursor-default'
                      : 'text-white/85 hover:bg-white/5'
                  }`}
                >
                  <span className="truncate">{l.name}</span>
                  {isIn && (
                    <Check
                      size={12}
                      className="text-[oklch(0.78_0.16_150)] shrink-0"
                      aria-label="Already in list"
                    />
                  )}
                </button>
              </li>
            );
          })
        )}
      </ul>

      <div className="border-t border-white/8 px-3 py-2">
        {newName === null ? (
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setNewName('');
              setError(null);
            }}
            className="flex items-center gap-1.5 text-[10.5px] uppercase tracking-[0.14em] text-[oklch(0.82_0.16_75)] hover:text-[oklch(0.86_0.14_75)]"
          >
            <Plus size={12} /> NEW LIST
          </button>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              submitCreate();
            }}
            className="flex items-center gap-1.5"
          >
            <input
              autoFocus
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="LIST NAME"
              maxLength={40}
              disabled={pending}
              className="flex-1 min-w-0 bg-[#080808] border border-white/22 rounded-sm px-2 py-1 text-[11.5px] uppercase tracking-[0.04em] text-white outline-none focus:border-[oklch(0.82_0.16_75/0.6)] placeholder:text-white/35"
            />
            <button
              type="submit"
              disabled={pending || !(newName ?? '').trim()}
              aria-label="Create and add"
              className="p-1 rounded-sm text-[oklch(0.82_0.16_75)] hover:text-[oklch(0.86_0.14_75)] disabled:opacity-40"
            >
              <Plus size={12} />
            </button>
            <button
              type="button"
              onClick={() => {
                setNewName(null);
                setError(null);
              }}
              aria-label="Cancel"
              className="p-1 rounded-sm text-white/55 hover:text-white"
            >
              <X size={12} />
            </button>
          </form>
        )}
        {error && (
          <p className="mt-1 text-[10px] uppercase tracking-[0.06em] text-[oklch(0.74_0.17_28)]">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
