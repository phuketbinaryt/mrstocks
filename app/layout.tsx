import type { Metadata } from 'next';
import { IBM_Plex_Mono } from 'next/font/google';
import './globals.css';

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-ibm-plex-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'MR/STOCKS — Pre-Market Scanner',
  description:
    'Pre-market signals for traders who would rather wait for a clean setup than chase noise. ~500 US large-caps scanned every market morning at 09:15 NY.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={ibmPlexMono.variable}>
      <body className="font-mono bg-black text-white">{children}</body>
    </html>
  );
}
