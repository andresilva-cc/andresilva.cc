import { ReactNode } from 'react';
import { cookies } from 'next/headers';
import { GoogleAnalytics } from '@next/third-parties/google';
import clsx from 'clsx';

import '@/styles/globals.css';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { firaCode, firaSans } from '@/app/fonts';

export const metadata = {
  title: 'André Silva',
  description: 'Software engineer with 8+ years of experience building web platforms, internal tools, and developer tooling',
};

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const cookieStore = await cookies();
  const theme = cookieStore.get('theme')?.value;

  return (
    <html lang="en" className="h-full" data-theme={theme}>
      <body
        className={clsx(
          firaSans.variable,
          firaCode.variable,
          'h-full flex flex-col px-4 md:px-8',
        )}
      >
        <Header className="pt-4 md:pt-8 pb-8 md:pb-16" />
        <main className="grow flex flex-col justify-center px-0 sm:px-6 md:px-12 lg:px-24 2xl:px-48">
          { children }
        </main>
        <Footer className="py-8 md:py-16" />
      </body>
      <GoogleAnalytics gaId="G-TLHZYGS1SJ" />
    </html>
  );
}
