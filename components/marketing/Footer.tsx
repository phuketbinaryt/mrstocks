import Link from 'next/link';
import Logo from '@/components/Logo';

interface FooterLink {
  label: string;
  href: string;
}

export default function Footer() {
  const cols: { h: string; items: FooterLink[] }[] = [
    {
      h: 'PRODUCT',
      items: [
        { label: 'Method', href: '/#method' },
        { label: 'Pricing', href: '/pricing' },
        { label: 'Changelog', href: '#' },
        { label: 'Status', href: '#' },
      ],
    },
    {
      h: 'COMPANY',
      items: [
        { label: 'About', href: '#' },
        { label: 'Contact', href: 'mailto:hello@mrstocks.cash' },
        { label: 'Press', href: '#' },
      ],
    },
    {
      h: 'EDUCATION',
      items: [
        { label: 'All articles', href: '/education' },
        { label: 'Setup states', href: '/education/states-explained' },
        { label: 'Prior45 zones', href: '/education/prior45-zones' },
        { label: 'Reading a card', href: '/education/reading-a-card' },
      ],
    },
    {
      h: 'LEGAL',
      items: [
        { label: 'Terms', href: '/legal/terms' },
        { label: 'Privacy', href: '/legal/privacy' },
        { label: 'Disclaimer', href: '/legal/terms#disclaimers' },
        { label: 'Refunds', href: '/legal/terms#refunds' },
      ],
    },
  ];

  return (
    <footer className="px-4 md:px-8 py-10 md:py-14 bg-black border-t border-white/12">
      <div className="max-w-[1180px] mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-[1.4fr_repeat(4,1fr)] gap-6 md:gap-8 mb-10">
          <div className="col-span-2 md:col-span-1 flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <Logo size={18} />
              <span className="text-[12px] tracking-[0.22em] uppercase text-[oklch(0.82_0.16_75)] font-medium">
                MR/STOCKS
              </span>
            </div>
            <p className="text-[11.5px] text-white/55 leading-relaxed max-w-[34ch]">
              Pre-market signals for traders who would rather wait for a clean setup than chase noise.
            </p>
          </div>
          {cols.map((c) => (
            <div key={c.h} className="flex flex-col gap-2.5">
              <span className="text-[9.5px] uppercase tracking-[0.18em] text-[oklch(0.82_0.16_75)]">
                {c.h}
              </span>
              <ul className="flex flex-col gap-1.5">
                {c.items.map((it) => (
                  <li key={it.label}>
                    <Link
                      href={it.href}
                      className="text-[11.5px] uppercase tracking-[0.06em] text-white/70 hover:text-white cursor-pointer"
                    >
                      {it.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between gap-3 pt-5 border-t border-white/10 text-[10px] uppercase tracking-[0.14em] text-white/45 flex-wrap">
          <span>© 2026 MR/STOCKS LLC · ALL RIGHTS RESERVED</span>
          <span>NOT FINANCIAL ADVICE · MEMBER USE ONLY</span>
        </div>
      </div>
    </footer>
  );
}
