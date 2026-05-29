// Component registry passed to next-mdx-remote's compileMDX. Maps both the
// custom education components (Callout, StateBadgeRow, ZoneBandDemo,
// AnnotatedCard, ScoreBreakdown) and styled overrides for the standard prose
// tags so MDX matches the MR/STOCKS brand (mono, amber headings, cyan inline
// code) without relying solely on the global .prose-mrstocks CSS.
import type { ComponentProps, ReactNode } from 'react';
import Callout from './Callout';
import StateBadgeRow from './StateBadgeRow';
import ZoneBandDemo from './ZoneBandDemo';
import AnnotatedCard from './AnnotatedCard';
import ScoreBreakdown from './ScoreBreakdown';

const h1 = (props: ComponentProps<'h1'>) => (
  <h1
    className="text-[24px] md:text-[28px] uppercase tracking-tight text-white mt-6 mb-4 leading-[1.15]"
    {...props}
  />
);

const h2 = (props: ComponentProps<'h2'>) => (
  <h2
    className="text-[14px] uppercase tracking-[0.12em] text-[oklch(0.82_0.16_75)] mt-7 mb-2"
    {...props}
  />
);

const h3 = (props: ComponentProps<'h3'>) => (
  <h3
    className="text-[12.5px] uppercase tracking-[0.1em] text-white mt-5 mb-2"
    {...props}
  />
);

const p = (props: ComponentProps<'p'>) => (
  <p className="text-[14px] leading-[1.7] text-white/85 my-3" {...props} />
);

const ul = (props: ComponentProps<'ul'>) => (
  <ul className="list-disc pl-5 my-3 space-y-1" {...props} />
);

const ol = (props: ComponentProps<'ol'>) => (
  <ol className="list-decimal pl-5 my-3 space-y-1" {...props} />
);

const li = (props: ComponentProps<'li'>) => (
  <li className="text-[14px] leading-[1.7] text-white/85" {...props} />
);

const code = (props: ComponentProps<'code'>) => (
  <code
    className="font-mono text-[12.5px] text-[oklch(0.80_0.13_200)] bg-white/[0.06] border border-white/8 rounded-[2px] px-1.5 py-[1px]"
    {...props}
  />
);

const a = (props: ComponentProps<'a'>) => (
  <a
    className="text-[oklch(0.82_0.16_75)] underline underline-offset-[3px] hover:decoration-2"
    {...props}
  />
);

const strong = (props: ComponentProps<'strong'>) => (
  <strong className="text-white font-semibold" {...props} />
);

const table = (props: ComponentProps<'table'>) => (
  <div className="my-4 overflow-x-auto rounded-sm border border-white/12">
    <table className="w-full text-[12.5px] border-collapse" {...props} />
  </div>
);

const thead = (props: ComponentProps<'thead'>) => (
  <thead className="bg-[#15171B]" {...props} />
);

const th = (props: ComponentProps<'th'>) => (
  <th
    className="text-left font-mono uppercase tracking-[0.08em] text-[10px] text-[oklch(0.78_0.12_200)] px-3 py-2 border-b border-white/12"
    {...props}
  />
);

const td = (props: ComponentProps<'td'>) => (
  <td className="px-3 py-2 align-top text-white/80 border-b border-white/8" {...props} />
);

const hr = (props: ComponentProps<'hr'>) => (
  <hr className="my-7 border-0 border-t border-white/10" {...props} />
);

export const mdxComponents: Record<string, (props: { children?: ReactNode } & Record<string, unknown>) => ReactNode> = {
  // Standard prose overrides.
  h1,
  h2,
  h3,
  p,
  ul,
  ol,
  li,
  code,
  a,
  strong,
  table,
  thead,
  th,
  td,
  hr,
  // Custom education components.
  Callout,
  StateBadgeRow,
  ZoneBandDemo,
  AnnotatedCard,
  ScoreBreakdown,
} as never;
