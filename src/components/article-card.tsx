import { ReactNode } from 'react';
import clsx from 'clsx';

import { Text } from '@/components/text';
import { Tag } from '@/components/tag';
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
 * Two columns at desktop: illustration (when provided) on the left,
 * body on the right. Collapses to a single column at narrow viewports
 * (< md) with the illustration above. The title is itself the click
 * surface; the rest of the card body is non-interactive metadata.
 *
 * Article tags ship lowercase by source convention (forem API). No
 * client-side case transformation; the Tag component renders them
 * verbatim.
 */
export function ArticleCard({
  date, readingTime, title, description, url, tags, illustration, className,
}: ArticleCardProps) {
  const hasIllustration = Boolean(illustration);
  return (
    <li
      className={clsx(
        'grid grid-cols-1 gap-4 border-b border-rule pb-8 pt-8 first:pt-0 last:border-b-0',
        hasIllustration && 'md:grid-cols-article md:gap-8',
        className,
      )}
    >
      { hasIllustration && (
        <div className="w-full max-w-50 md:max-w-none flex items-start" aria-hidden="true">
          { illustration }
        </div>
      ) }
      <div className="flex flex-col gap-3">
        <Text variant="meta" as="span" className="inline-flex items-baseline gap-2 text-fg-subtle">
          <span>{ date }</span>
          <span aria-hidden="true">·</span>
          <span>{`${readingTime} min read`}</span>
        </Text>
        <Text variant="h3" as="p" className="m-0">
          <a
            href={safeHref(url)}
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
      </div>
    </li>
  );
}
