import type {Metadata} from 'next';
import {Figtree} from 'next/font/google';
import './globals.css';
import {Providers} from './providers';

const figtree = Figtree({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-figtree',
});

export const metadata: Metadata = {
  title: 'Agentic Governance',
  description:
    'Public living board for Agentic Governance. Measured KPIs only — never invented numbers. UI powered by Meta Astryx.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-astryx-theme="neutral" className={figtree.variable}>
      <body style={{fontFamily: 'var(--font-family-body)'}}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
