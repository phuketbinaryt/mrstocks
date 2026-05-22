'use client';
// Three-dot menu for one watchlist row: Set as default / Rename / Delete.
// Stops the parent <Link> from navigating when the menu (or its trigger) is
// clicked. Server Actions are invoked via useTransition for pending state.
import { useState, useRef, useEffect, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { MoreHorizontal, Star, Edit3, Trash2 } from 'lucide-react';
import {
  renameWatchlist,
  deleteWatchlist,
  setDefaultWatchlist,
} from '@/app/watchlists/actions';

export interface KebabMenuProps {
  listId: string;
  listName: string;
  isDefault: boolean;
}

export default function KebabMenu({
  listId,
  listName,
  isDefault,
}: KebabMenuProps) {
  const [open, setOpen] = useState(false);
  const [renaming, setRenaming] = useState(false);
  const [pending, start] = useTransition();
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [open]);

  function stop(e: React.MouseEvent | React.KeyboardEvent) {
    e.preventDefault();
    e.stopPropagation();
  }

  function doSetDefault(e: React.MouseEvent) {
    stop(e);
    start(async () => {
      await setDefaultWatchlist(listId);
      setOpen(false);
      router.refresh();
    });
  }

  function doDelete(e: React.MouseEvent) {
    stop(e);
    if (!confirm(`Delete watchlist "${listName}"?`)) return;
    start(async () => {
      await deleteWatchlist(listId);
      setOpen(false);
      router.refresh();
    });
  }

  function startRename(e: React.MouseEvent) {
    stop(e);
    setRenaming(true);
  }

  function submitRename(newName: string) {
    const trimmed = newName.trim();
    if (!trimmed || trimmed === listName) {
      setRenaming(false);
      return;
    }
    start(async () => {
      await renameWatchlist(listId, trimmed);
      setRenaming(false);
      setOpen(false);
      router.refresh();
    });
  }

  return (
    <div ref={ref} className="relative shrink-0">
      <button
        type="button"
        aria-label="List menu"
        disabled={pending}
        onClick={(e) => {
          stop(e);
          setOpen((v) => !v);
        }}
        className={`shrink-0 p-1.5 rounded-sm text-white/60 hover:text-white border border-transparent hover:border-white/15 ${pending ? 'opacity-50' : ''}`}
      >
        <MoreHorizontal size={14} />
      </button>
      {open && (
        <div
          onClick={stop}
          className="absolute right-0 top-full mt-1 z-30 min-w-[180px] rounded-sm border border-white/22 bg-[#121212] shadow-2xl p-0.5"
        >
          {renaming ? (
            <RenameField
              initial={listName}
              onCancel={() => setRenaming(false)}
              onSubmit={submitRename}
              disabled={pending}
            />
          ) : (
            <>
              {!isDefault && (
                <button
                  type="button"
                  onClick={doSetDefault}
                  disabled={pending}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-sm text-[12px] text-white hover:bg-[oklch(0.82_0.16_75/0.12)] disabled:opacity-50"
                >
                  <Star size={12} className="text-[oklch(0.82_0.16_75)]" />
                  Set as default
                </button>
              )}
              <button
                type="button"
                onClick={startRename}
                disabled={pending}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-sm text-[12px] text-white hover:bg-[oklch(0.82_0.16_75/0.12)] disabled:opacity-50"
              >
                <Edit3 size={12} className="text-white/60" />
                Rename
              </button>
              <button
                type="button"
                onClick={doDelete}
                disabled={pending}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-sm text-[12px] text-[oklch(0.74_0.17_28)] hover:bg-[oklch(0.72_0.18_28/0.12)] disabled:opacity-50"
              >
                <Trash2 size={12} />
                Delete
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

interface RenameFieldProps {
  initial: string;
  onCancel: () => void;
  onSubmit: (name: string) => void;
  disabled?: boolean;
}

function RenameField({
  initial,
  onCancel,
  onSubmit,
  disabled,
}: RenameFieldProps) {
  const [value, setValue] = useState(initial);
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(value);
      }}
      className="p-1.5 flex items-center gap-1.5"
    >
      <input
        autoFocus
        value={value}
        maxLength={40}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Escape') {
            e.preventDefault();
            onCancel();
          }
        }}
        disabled={disabled}
        className="flex-1 bg-[#0B0B0B] border border-white/20 px-2 py-1 text-[12px] text-white rounded-sm focus:outline-none focus:border-[oklch(0.82_0.16_75/0.7)]"
      />
      <button
        type="submit"
        disabled={disabled}
        className="px-2 py-1 rounded-sm border border-[oklch(0.82_0.16_75/0.55)] bg-[oklch(0.82_0.16_75/0.14)] text-[oklch(0.82_0.16_75)] text-[10px] uppercase tracking-[0.1em] hover:bg-[oklch(0.82_0.16_75/0.22)] disabled:opacity-50"
      >
        Save
      </button>
    </form>
  );
}
