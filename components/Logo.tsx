interface LogoProps {
  size?: number;
  className?: string;
}

/**
 * MR/STOCKS brand mark — custom amber SVG.
 * Per the design handoff README, the Logo is NOT replaced with a lucide icon —
 * it's the brand mark.
 */
export default function Logo({ size = 18, className }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-label="MR/STOCKS"
    >
      <rect
        x="1"
        y="1"
        width="22"
        height="22"
        rx="6"
        stroke="oklch(0.82 0.16 75)"
        strokeWidth="1.4"
      />
      <path
        d="M5 16 L9 11 L12 14 L19 6"
        stroke="oklch(0.82 0.16 75)"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="19" cy="6" r="1.6" fill="oklch(0.82 0.16 75)" />
    </svg>
  );
}
