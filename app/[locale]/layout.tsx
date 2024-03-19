import { ReactNode } from 'react';
import { GoogleAnalytics } from '@next/third-parties/google';
import { getTranslator } from 'next-intl/server';
import clsx from 'clsx';

import { firaCode, firaSans } from '@/app/fonts';
import '@/app/globals.css';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { RouteParams } from '@/types/RouteParams';

export async function generateMetadata({ params }: RouteParams) {
  const t = await getTranslator({ locale: params.locale });

  return {
    title: 'André Silva',
    description: t('home.bio'),
  };
}

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <body
        className={clsx(
          firaSans.variable,
          firaCode.variable,
          'h-full flex flex-col px-4 md:px-8',
        )}
      >
        <Header className="pt-4 md:pt-8 pb-8 md:pb-16" />
        <main className="flex-grow flex flex-col justify-center px-0 sm:px-6 md:px-12 lg:px-24 2xl:px-48">
          { children }
        </main>
        <Footer className="py-8 md:py-16" />
      </body>
      <GoogleAnalytics gaId="G-TLHZYGS1SJ" />
    </html>
  );
}
