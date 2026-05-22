// Lightweight icon set — hand-written SVGs to avoid lucide-react dep in this preview.
// In the exported TSX you'd import from 'lucide-react': Star, ChevronDown, Search, Bell, etc.

const I = ({ d, fill = 'none', stroke = 'currentColor', sw = 1.6, size = 16, children, ...rest }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke}
    strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" {...rest}>
    {children || (d && <path d={d} />)}
  </svg>
);

const Icons = {
  Star: (p) => <I {...p}><path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.62L12 2 9.19 8.62 2 9.24l5.46 4.73L5.82 21z" /></I>,
  StarFilled: (p) => <I {...p} fill="currentColor"><path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.62L12 2 9.19 8.62 2 9.24l5.46 4.73L5.82 21z" /></I>,
  ChevronDown: (p) => <I {...p}><path d="m6 9 6 6 6-6" /></I>,
  ChevronRight: (p) => <I {...p}><path d="m9 18 6-6-6-6" /></I>,
  ChevronLeft: (p) => <I {...p}><path d="m15 18-6-6 6-6" /></I>,
  ArrowUpRight: (p) => <I {...p}><path d="M7 17 17 7M7 7h10v10" /></I>,
  Search: (p) => <I {...p}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></I>,
  Bell: (p) => <I {...p}><path d="M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></I>,
  Clock: (p) => <I {...p}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></I>,
  Sparkles: (p) => <I {...p}><path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8" /></I>,
  Filter: (p) => <I {...p}><path d="M3 4h18l-7 9v5l-4 2v-7z" /></I>,
  Menu: (p) => <I {...p}><path d="M3 6h18M3 12h18M3 18h18" /></I>,
  X: (p) => <I {...p}><path d="M18 6 6 18M6 6l12 12" /></I>,
  Refresh: (p) => <I {...p}><path d="M3 12a9 9 0 0 1 15.5-6.4L21 8" /><path d="M21 3v5h-5" /><path d="M21 12a9 9 0 0 1-15.5 6.4L3 16" /><path d="M3 21v-5h5" /></I>,
  Inbox: (p) => <I {...p}><path d="M22 12h-6l-2 3h-4l-2-3H2" /><path d="M5.4 5.5 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6L18.6 5.5A2 2 0 0 0 16.8 4H7.2a2 2 0 0 0-1.8 1.5z" /></I>,
  Logo: ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="1" y="1" width="22" height="22" rx="6" stroke="oklch(0.74 0.17 250)" strokeWidth="1.4" />
      <path d="M5 16 L9 11 L12 14 L19 6" stroke="oklch(0.74 0.17 250)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="19" cy="6" r="1.6" fill="oklch(0.74 0.17 250)" />
    </svg>
  ),
};

window.MS_Icons = Icons;
