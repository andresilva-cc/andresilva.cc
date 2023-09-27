import { ReactNode } from 'react';
import type { Metadata } from 'next';
import clsx from 'clsx';
import './globals.css';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { firaCode, firaSans } from './fonts';

export const metadata: Metadata = {
  title: 'André Silva',
};

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
        <main className="flex-grow flex flex-col justify-center px-0 sm:px-12 md:px-24 lg:px-48 2xl:px-96">
          { children }
        </main>
        <Footer className="py-8 md:py-16" />
      </body>
    </html>
  );
}
