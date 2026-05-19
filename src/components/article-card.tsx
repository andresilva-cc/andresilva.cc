import { ReactNode } from 'react';
import clsx from 'clsx';

import { Text } from '@/components/text';
import { Tag } from '@/components/tag';
import { ArrowLink } from '@/components/arrow-link';
import { IconHeart } from '@/components/icon-heart';
import { InlineLink } from '@/components/inline-link';
import { safeHref } from '@/lib/safe-href';

export interface ArticleCardProps {
  /** ISO-formatted publish date, lowercase mono (e.g. "2025.02.13"). */
  date: string;
  /** Reading time in minutes (e.g. 6). */
  readingTime: number;
  /** Number of public reactions (hearts). */
  reactions: number;
  /** Number of comments. */
  comments: number;
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
  date, readingTime, reactions, comments, title, description, url, tags, illustration, className,
}: ArticleCardProps) {
  const hasIllustration = Boolean(illustration);
  const safe = safeHref(url);
  return (
    <li
      className={clsx(
        'grid grid-cols-1 gap-4 border-b border-rule py-6 last:border-b-0',
        hasIllustration && 'md:grid-cols-article-card md:gap-6 md:items-stretch',
        className,
      )}
    >
      { hasIllustration && (
        <div className="relative w-full max-w-80 md:max-w-none min-h-36 border border-rule bg-canvas overflow-hidden shrink-0">
          { illustration }
        </div>
      ) }
      <div className="flex flex-col">
        <Text variant="meta" as="span" className="inline-flex flex-wrap items-baseline gap-2 text-fg-subtle">
          <span className="text-fg-muted">{ date }</span>
          <span aria-hidden="true">·</span>
          <span>{`${readingTime} min`}</span>
          <span aria-hidden="true">·</span>
          <span className="inline-flex items-center gap-1">
            {reactions}
            {' '}
            <IconHeart className="size-3" />
          </span>
          <span aria-hidden="true">·</span>
          <span>{`${comments} comment${comments === 1 ? '' : 's'}`}</span>
        </Text>
        <Text variant="h3" as="p" className="mt-3 mb-0">
          <InlineLink href={safe}>{ title }</InlineLink>
        </Text>
        <Text variant="body" className="text-fg-muted max-w-prose-wide mt-2 mb-0">{ description }</Text>
        <div className="flex flex-wrap gap-1.5 mt-4">
          { tags.map((tag) => (
            <Tag key={tag}>{ tag }</Tag>
          )) }
        </div>
        <ArrowLink href={safe} className="mt-4">read on dev.to</ArrowLink>
      </div>
    </li>
  );
}
