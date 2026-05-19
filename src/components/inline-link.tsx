import { AnchorHTMLAttributes, ReactNode } from 'react';
import clsx from 'clsx';

import { safeHref } from '@/lib/safe-href';

export interface InlineLinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'children'> {
  href: string;
  children: ReactNode;
}

/*
 * InlineLink — the canonical link inside running prose.
 *
 * Default body color (`text-fg`), lifts to `text-accent` on hover with a
 * 1px underline at 3px offset. Accent-at-rest is reserved for identity
 * affordances (Wordmark, ArrowLink, page-title accents); links embedded
 * in prose are not identity moments and must not compete with them.
 * See standing rule in docs/design-system.md.
 *
 * External URLs auto-apply `target="_blank" rel="noopener noreferrer"`.
 */
export function InlineLink({
  href, children, className, target, rel, ...rest
}: InlineLinkProps) {
  const safe = safeHref(href);
  const isExternal = /^https?:/i.test(safe);
  return (
    <a
      href={safe}
      target={target ?? (isExternal ? '_blank' : undefined)}
      rel={rel ?? (isExternal ? 'noopener noreferrer' : undefined)}
      className={clsx(
        'text-fg no-underline transition-colors duration-fast ease-out',
        'hover:text-accent hover:underline hover:underline-offset-3 hover:decoration-1',
        '[&_strong]:text-inherit',
        className,
      )}
      {...rest}
    >
      { children }
    </a>
  );
}
