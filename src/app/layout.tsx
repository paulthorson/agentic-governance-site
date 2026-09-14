import type {Metadata} from 'next';
import {EB_Garamond} from 'next/font/google';
import {GeistSans} from 'geist/font/sans';
import './globals.css';
import {Providers} from './providers';

/** Advercase stand-in until licensed webfont (Cos DS / AG #39 @ 3e8de677). */
const ebGaramond = EB_Garamond({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-ag-display',
});

export const metadata: Metadata = {
  title: 'Agentic Governance',
  description: 'See the loop. Govern the work. Ship only what clears.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-astryx-theme="neutral"
      className={`${ebGaramond.variable} ${GeistSans.variable}`}
    >
      <body
        className="ag-root"
        style={{
          fontFamily: 'var(--font-family-body)',
          background: 'var(--ag-void)',
          color: 'var(--ag-ink)',
          margin: 0,
        }}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
