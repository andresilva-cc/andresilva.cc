import { ReactNode } from 'react';
import clsx from 'clsx';

import { Text } from '@/components/text';
import { Tag } from '@/components/tag';
import { ArrowLink } from '@/components/arrow-link';
import { safeHref } from '@/lib/safe-href';

export interface ArticleCardProps {
  /** ISO-formatted publish date, lowercase mono (e.g. "2025.02.13"). */
  date: string;
  /** Reading time in minutes (e.g. 6). */
  readingTime: number;
  title: string;
  description: string;
  url: string;
  tags: Array<string>;
  /** Optional illustration rendered in the left column on desktop. */
  illustration?: ReactNode;
  className?: string;
}

/*
 * ArticleCard — a single article entry sourced from the dev.to feed.
 *
 * Two columns at desktop when an illustration is provided (240px left,
 * body right); single column otherwise. Collapses to one column at
 * narrow viewports with the illustration above the body. The title is
 * the primary click surface; a "read on dev.to" ArrowLink provides an
 * explicit navigation affordance at the bottom.
 *
 * Article tags ship lowercase by source convention (forem API). No
 * client-side case transformation; the Tag component renders them
 * verbatim.
 */
export function ArticleCard({
  date, readingTime, title, description, url, tags, illustration, className,
}: ArticleCardProps) {
  const hasIllustration = Boolean(illustration);
  const safe = safeHref(url);
  return (
    <li
      className={clsx(
        'grid grid-cols-1 gap-6 border-b border-rule py-6 first:pt-0 last:border-b-0',
        hasIllustration && 'md:grid-cols-article-card md:gap-6 md:items-stretch',
        className,
      )}
    >
      { hasIllustration && (
        <div
          className="w-full max-w-80 md:max-w-none min-h-36 flex items-center justify-center border border-rule bg-surface overflow-hidden shrink-0"
          aria-hidden="true"
        >
          { illustration }
        </div>
      ) }
      <div className="flex flex-col gap-3">
        <Text variant="meta" as="span" className="inline-flex flex-wrap items-baseline gap-2 text-fg-subtle">
          <span>{ date }</span>
          <span aria-hidden="true">·</span>
          <span>{`${readingTime} min read`}</span>
        </Text>
        <Text variant="h3" as="p" className="m-0">
          <a
            href={safe}
            target="_blank"
            rel="noopener noreferrer"
            className="text-fg no-underline transition-colors duration-fast ease-out motion-safe:hover:text-accent"
          >
            { title }
          </a>
        </Text>
        <Text variant="body" className="text-fg-muted max-w-prose-wide m-0">{ description }</Text>
        <div className="flex flex-wrap gap-1">
          { tags.map((tag) => (
            <Tag key={tag}>{ tag }</Tag>
          )) }
        </div>
        <ArrowLink href={safe}>read on dev.to</ArrowLink>
      </div>
    </li>
  );
}
