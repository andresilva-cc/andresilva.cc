import { ReactNode } from 'react';
import { GoogleAnalytics } from '@next/third-parties/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import clsx from 'clsx';

import '@/app/globals.css';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { firaCode, firaSans } from '@/app/fonts';
import { routing } from '@/i18n/routing';

export async function generateMetadata() {
  const t = await getTranslations();

  return {
    title: 'André Silva',
    description: t('home.bio'),
  };
}

export default async function RootLayout({
  children,
  params: { locale },
}: {
  children: ReactNode
  params: { locale: string }
}) {
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang="en" className="h-full">
      <body
        className={clsx(
          firaSans.variable,
          firaCode.variable,
          'h-full flex flex-col px-4 md:px-8',
        )}
      >
        <NextIntlClientProvider messages={messages}>
          <Header className="pt-4 md:pt-8 pb-8 md:pb-16" />
          <main className="flex-grow flex flex-col justify-center px-0 sm:px-6 md:px-12 lg:px-24 2xl:px-48">
            { children }
          </main>
          <Footer className="py-8 md:py-16" />
        </NextIntlClientProvider>
      </body>
      <GoogleAnalytics gaId="G-TLHZYGS1SJ" />
    </html>
  );
}
