'use client';
import { X } from 'lucide-react';
import type { ReactNode } from 'react';

export interface ChipToggleProps {
  active: boolean;
  onClick: () => void;
  dotColor?: string;
  children: ReactNode;
}

export default function ChipToggle({
  active,
  onClick,
  dotColor,
  children,
}: ChipToggleProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-[11px] border transition-colors uppercase tracking-[0.04em] whitespace-nowrap ${
        active
          ? 'border-[oklch(0.82_0.16_75/0.55)] bg-[oklch(0.82_0.16_75/0.10)] text-white'
          : 'border-white/18 text-white/70 hover:text-white hover:border-white/30'
      }`}
    >
      {dotColor && (
        <span
          className="h-1.5 w-1.5 rounded-full"
          style={{ background: dotColor }}
        />
      )}
      {children}
      {active && <X size={10} className="opacity-60" />}
    </button>
  );
}
