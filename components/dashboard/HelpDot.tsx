'use client';
// A small "?" affordance that opens a popover with a one-line explanation
// and a "Learn more →" deep-link to an education article anchor. Used next
// to dashboard filter-row labels. Closes on outside-click or Escape.
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { HelpCircle, ArrowRight } from 'lucide-react';

export interface HelpDotProps {
  label: string; // short popover heading
  body: string; // one-line explanation
  href: string; // link to an education article
}

export default function HelpDot({ label, body, href }: HelpDotProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative inline-flex">
      <button
        type="button"
        aria-label={`What is ${label}?`}
        aria-expanded={open}
        aria-haspopup="dialog"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center justify-center text-white/35 hover:text-[oklch(0.82_0.16_75)] transition-colors"
      >
        <HelpCircle size={12} />
      </button>
      {open && (
        <div
          role="dialog"
          aria-label={label}
          className="absolute left-0 top-5 z-30 w-[240px] rounded-sm border border-white/15 bg-[#101216] shadow-lg px-3 py-2.5"
        >
          <span className="block text-[9.5px] font-mono uppercase tracking-[0.16em] text-[oklch(0.82_0.16_75)] mb-1">
            {label}
          </span>
          <p className="text-[12px] leading-snug text-white/80 mb-2">{body}</p>
          <Link
            href={href}
            className="inline-flex items-center gap-1 text-[11px] text-[oklch(0.82_0.16_75)] hover:text-white underline underline-offset-2"
          >
            Learn more <ArrowRight size={11} />
          </Link>
        </div>
      )}
    </div>
  );
}
