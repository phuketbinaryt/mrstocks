import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-ibm-plex-mono)', 'ui-monospace', 'monospace'],
        mono: ['var(--font-ibm-plex-mono)', 'ui-monospace', 'monospace'],
      },
      colors: {
        // Setup-state palette — referenced from the README's design tokens.
        state: {
          narrow: 'oklch(0.74 0.17 250)',
          'wide-snapback': 'oklch(0.80 0.16 72)',
          trending: 'oklch(0.78 0.16 150)',
          'watch-loose': 'oklch(0.76 0.12 200)',
          'too-tight': 'oklch(0.62 0.01 250)',
          middle: 'oklch(0.70 0.01 250)',
        },
        accent: {
          amber: 'oklch(0.82 0.16 75)',
          'amber-2': 'oklch(0.86 0.14 75)',
          cyan: 'oklch(0.78 0.12 200)',
          green: 'oklch(0.78 0.16 150)',
          red: 'oklch(0.74 0.17 28)',
        },
        surface: {
          0: '#000000',
          1: '#0B0B0B',
          2: '#050505',
          3: '#121212',
        },
      },
    },
  },
  plugins: [],
};

export default config;
