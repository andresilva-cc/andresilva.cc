import Link from 'next/link';
import clsx from 'clsx';

import { Text } from '@/components/text';
import { Badge } from '@/components/badge';

export interface LatestRowProps {
  /** Category label shown in the badge (e.g. "Career", "Project", "Article"). Source title case; CSS uppercases. */
  category: string;
  /** Internal href the whole row links to. */
  href: string;
  /** Primary line of the row body. Truncates with ellipsis on narrow viewports. */
  title: string;
  /** Optional secondary noun for the "title @ company" career form. */
  company?: string;
  /** Override the row's accessible label. Defaults to "title at company" or "title". */
  ariaLabel?: string;
  className?: string;
}

/*
 * LatestRow — clickable row used in the Home "Latest" digest.
 *
 * The entire row is the link surface. A Badge anchors the left as the
 * categorical primary noun (carrying the accent), the body holds the
 * title and an optional "@ company" secondary, and the right rail
 * carries an arrow CTA. Hover shifts a `::before` surface overlay via
 * a separate layer so the press-scale on .row__body doesn't disturb
 * the hover surface (design rule: animate transform on body only).
 */
export function LatestRow({
  category, href, title, company, ariaLabel, className,
}: LatestRowProps) {
  const label = ariaLabel ?? (company ? `${title} at ${company}` : title);

  return (
    <li>
      <Link
        href={href}
        aria-label={label}
        className={clsx(
          'group/row relative isolate flex items-center justify-between gap-4 px-3 py-4 -mx-3 no-underline text-fg border-t border-rule',
          'before:absolute before:inset-0 before:-z-10 before:bg-surface before:opacity-0 before:transition-opacity before:duration-fast before:ease-out',
          'motion-safe:hover:before:opacity-100 focus-visible:outline-2 focus-visible:outline focus-visible:outline-accent -outline-offset-2',
          className,
        )}
      >
        <div className="motion-safe:group-active/row:scale-press motion-safe:transition-transform motion-safe:duration-fast motion-safe:ease-out flex flex-wrap items-baseline gap-2 min-w-0 overflow-hidden">
          <Badge className="min-w-20 justify-center flex-shrink-0">{ category }</Badge>
          <Text variant="body" as="strong" className="font-semibold truncate min-w-0">{ title }</Text>
          { company && (
            <>
              <Text variant="body" as="span" className="text-fg-subtle font-normal mx-1">@</Text>
              <Text variant="body" as="span" className="font-semibold">{ company }</Text>
            </>
          ) }
        </div>
        <span
          aria-hidden="true"
          className="inline-flex items-center text-accent transition-colors duration-fast ease-out motion-safe:group-hover/row:text-accent-strong"
        >
          <svg
            viewBox="0 0 10 10"
            fill="none"
            className="size-2.5 transition-transform duration-fast ease-out motion-safe:group-hover/row:translate-x-0.5"
          >
            <path d="M2 5h6M5 2l3 3-3 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="square" strokeLinejoin="miter" />
          </svg>
        </span>
      </Link>
    </li>
  );
}
