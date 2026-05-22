import Link from 'next/link';
import Logo from '@/components/Logo';

const ITEMS = [
  { href: '/admin', label: 'OVERVIEW' },
  { href: '/admin/members', label: 'MEMBERS' },
  { href: '/admin/scans', label: 'SCANS' },
  { href: '/admin/alerts', label: 'ALERTS' },
  { href: '/admin/audit', label: 'AUDIT' },
];

export default function AdminSidebar() {
  return (
    <aside className="w-[200px] shrink-0 border-r border-white/10 px-4 py-6 hidden md:block">
      <Link href="/" className="flex items-center gap-2 mb-6">
        <Logo size={16} />
        <span className="text-[11px] uppercase tracking-[0.22em] text-[oklch(0.82_0.16_75)] font-medium">
          MR/STOCKS · ADMIN
        </span>
      </Link>
      <nav className="flex flex-col gap-0.5">
        {ITEMS.map((i) => (
          <Link
            key={i.href}
            href={i.href}
            className="block px-2.5 py-1.5 text-[11px] uppercase tracking-[0.12em] text-white/70 hover:text-white hover:bg-white/[0.04] rounded-sm"
          >
            {i.label}
          </Link>
        ))}
      </nav>
      <div className="mt-8 pt-4 border-t border-white/10 flex flex-col gap-1">
        <Link
          href="/dashboard"
          className="block px-2.5 py-1.5 text-[10.5px] uppercase tracking-[0.12em] text-white/50 hover:text-white"
        >
          ← BACK TO APP
        </Link>
      </div>
    </aside>
  );
}
