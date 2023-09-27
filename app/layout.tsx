import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import clsx from 'clsx';
import { firaCode, firaSans } from './fonts';

export const metadata: Metadata = {
  title: 'André Silva',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
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
        <main className="flex-grow">
          { children }
        </main>
        <Footer className="py-8 md:py-16" />
      </body>
    </html>
  );
}
