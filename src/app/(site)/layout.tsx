import { ReactNode } from 'react';

import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { SkipLink } from '@/components/skip-link';

export default function SiteLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      <SkipLink />
      <div className="max-w-shell mx-auto w-full px-4 md:px-8 flex flex-col flex-1">
        <Header className="py-4 border-b border-rule" />
        <main id="main" className="flex-1">{children}</main>
        <Footer className="mt-12" />
      </div>
    </>
  );
}
