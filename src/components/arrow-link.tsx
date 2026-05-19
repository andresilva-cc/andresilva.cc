import { ReactNode, AnchorHTMLAttributes } from 'react';
import Link from 'next/link';
import clsx from 'clsx';

import { Text } from '@/components/text';
import { IconArrow } from '@/components/icon-arrow';
import { safeHref, isExternalHref } from '@/lib/safe-href';

type AnchorBaseProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'children' | 'className'>;

export interface ArrowLinkProps extends AnchorBaseProps {
  href: string;
  className?: string;
  children: ReactNode;
}

/*
 * ArrowLink — the canonical "go to" affordance.
 *
 * Accent-colored inline label followed by a small square arrow that nudges
 * 2px right on hover. The arrow stays as inline SVG (zero external glyph
 * dependency); the link composes Text for typography.
 *
 * Use next/link for internal routes (relative paths). External hrefs route
 * through a plain <a> with `target="_blank"` + `rel="noopener noreferrer"`.
 */
export function ArrowLink({
  href,
  className,
  children,
  ...rest
}: ArrowLinkProps) {
  const safe = safeHref(href);
  const isExternal = isExternalHref(safe);

  const content = (
    <>
      <span>{ children }</span>
      <IconArrow className="size-2.5 transition-transform duration-fast ease-out motion-safe:group-hover/arrow-link:translate-x-0.5" />
    </>
  );

  const linkClassName = clsx(
    'group/arrow-link inline-flex items-center gap-1.5 text-accent transition-colors duration-fast ease-out',
    'hover:text-accent-strong hover:underline hover:underline-offset-3 hover:decoration-1',
    className,
  );

  if (isExternal) {
    return (
      <Text asChild variant="meta">
        <a
          href={safe}
          target="_blank"
          rel="noopener noreferrer"
          className={linkClassName}
          {...rest}
        >
          { content }
        </a>
      </Text>
    );
  }

  return (
    <Text asChild variant="meta">
      <Link href={safe} className={linkClassName} {...rest}>
        { content }
      </Link>
    </Text>
  );
}
