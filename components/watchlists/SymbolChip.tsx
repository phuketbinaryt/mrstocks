'use client';
import { X } from 'lucide-react';
import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { removeSymbol } from '@/app/watchlists/actions';

export interface SymbolChipProps {
  watchlistId: string;
  symbol: string;
}

export default function SymbolChip({
  watchlistId,
  symbol,
}: SymbolChipProps) {
  const [pending, start] = useTransition();
  const router = useRouter();
  return (
    <span
      className={`inline-flex items-center gap-1.5 pl-2 pr-1 py-1 rounded-sm border border-white/15 bg-[#0B0B0B] text-[12px] hover:border-white/25 ${pending ? 'opacity-50' : ''}`}
    >
      <span className="text-white font-medium tracking-tight tabular-nums">
        {symbol}
      </span>
      <button
        aria-label={`Remove ${symbol}`}
        type="button"
        disabled={pending}
        onClick={() =>
          start(async () => {
            await removeSymbol(watchlistId, symbol);
            router.refresh();
          })
        }
        className="ml-0.5 p-0.5 rounded-sm text-white/55 hover:text-[oklch(0.74_0.17_28)] hover:bg-white/8 disabled:opacity-50"
      >
        <X size={11} />
      </button>
    </span>
  );
}
