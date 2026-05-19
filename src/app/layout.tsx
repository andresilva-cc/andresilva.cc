import { ReactNode } from 'react';
import { GoogleAnalytics } from '@next/third-parties/google';
import clsx from 'clsx';

import '@/styles/globals.css';
import { jetbrainsMono, vt323 } from '@/app/fonts';

export const metadata = {
  metadataBase: new URL('https://andresilva.cc'),
  title: 'André Silva',
  description: 'Software engineer with 9+ years of experience building web platforms, internal tools, and developer tooling.',
  openGraph: {
    title: 'André Silva',
    description: 'Software engineer with 9+ years of experience building web platforms, internal tools, and developer tooling.',
    url: 'https://andresilva.cc',
    siteName: 'andresilva.cc',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'André Silva — Software Engineer — andresilva.cc' }],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'André Silva',
    description: 'Software engineer with 9+ years of experience building web platforms, internal tools, and developer tooling.',
    images: ['/og.png'],
  },
  icons: {
    icon: [
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/favicon.ico',
    apple: { url: '/apple-touch-icon.png', sizes: '180x180' },
  },
  manifest: '/site.webmanifest',
  appleWebApp: {
    title: 'andresilva.cc',
  },
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en" className={clsx(jetbrainsMono.variable, vt323.variable)}>
      {/* Warm the connection and prefetch the stipple embed engine so the
          hero and article-card animations paint with minimal delay. React
          hoists these <link>s into <head>. */}
      <link rel="preconnect" href="https://art.andresilva.cc" crossOrigin="anonymous" />
      <link
        rel="modulepreload"
        href="https://art.andresilva.cc/embed/stipple.js"
        crossOrigin="anonymous"
      />
      {/* suppressHydrationWarning: browser extensions (Grammarly etc.) inject attributes onto <body> after SSR, causing harmless hydration mismatch warnings. */}
      <body
        className="min-h-screen flex flex-col"
        suppressHydrationWarning
      >
        {children}
      </body>
      <GoogleAnalytics gaId="G-TLHZYGS1SJ" />
    </html>
  );
}
