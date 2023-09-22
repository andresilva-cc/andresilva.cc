import type { Metadata } from 'next';
import { firaCode, firaSans } from './fonts';
import './globals.css';

export const metadata: Metadata = {
  title: 'André Silva',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${firaSans.variable} ${firaCode.variable}`}>{children}</body>
    </html>
  );
}
