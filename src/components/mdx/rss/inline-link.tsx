import { ReactNode } from 'react';
import { absolutize } from '@/lib/rss-url';

export interface InlineLinkRssProps {
  href: string;
  children: ReactNode;
}

export function makeInlineLinkRss(basePath: string) {
  return function InlineLinkRss({ href, children }: InlineLinkRssProps) {
    const absoluteHref = absolutize(href, basePath);
    const isExternal = /^https?:\/\//i.test(absoluteHref);
    return (
      <a
        href={absoluteHref}
        target={isExternal ? '_blank' : undefined}
        rel={isExternal ? 'noopener noreferrer' : undefined}
      >
        {children}
      </a>
    );
  };
}
