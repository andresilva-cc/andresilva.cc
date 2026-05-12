import { ReactNode } from 'react';
import { GoogleAnalytics } from '@next/third-parties/google';
import clsx from 'clsx';

import '@/styles/globals.css';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { SkipLink } from '@/components/skip-link';
import { jetbrainsMono, vt323 } from '@/app/fonts';

export const metadata = {
  title: 'André Silva',
  description: 'Software engineer with 9+ years of experience building web platforms, internal tools, and developer tooling.',
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={clsx(
          jetbrainsMono.variable,
          vt323.variable,
          'min-h-screen flex flex-col',
        )}
      >
        <SkipLink />
        <div className="max-w-shell mx-auto w-full px-4 md:px-8 flex flex-col flex-1">
          <Header className="py-4 border-b border-rule" />
          <main id="main" className="flex-1">
            { children }
          </main>
          <Footer className="mt-12 pt-5 pb-8" />
        </div>
      </body>
      <GoogleAnalytics gaId="G-TLHZYGS1SJ" />
    </html>
  );
}
