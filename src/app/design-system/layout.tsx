import { ReactNode } from 'react';

export default function DesignSystemLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="max-w-shell mx-auto w-full px-4 md:px-8 flex flex-col flex-1">
      <main id="main" className="flex-1 pb-12">{children}</main>
    </div>
  );
}
