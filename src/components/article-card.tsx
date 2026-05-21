import { ReactNode } from 'react';
import clsx from 'clsx';

import { Text } from '@/components/text';
import { Tag } from '@/components/tag';
import { ArrowLink } from '@/components/arrow-link';
import { InlineLink } from '@/components/inline-link';

export interface ArticleCardProps {
  /** ISO-formatted publish date, lowercase mono (e.g. "2025.02.13"). */
  date: string;
  /** Reading time in minutes (e.g. 6). */
  readingTime: number;
  title: string;
  description: string;
  /** Internal URL — `/articles/<slug>`. */
  url: string;
  tags: Array<string>;
  /** Optional illustration rendered in the left column on desktop. */
  illustration?: ReactNode;
  className?: string;
}

/*
 * ArticleCard — a single article entry from LocalArticlesRepository.
 *
 * Two columns at desktop when an illustration is provided (240px left,
 * body right); single column otherwise. Collapses to one column at
 * narrow viewports with the illustration above the body. The title is
 * the primary click surface; a "read article" ArrowLink provides an
 * explicit navigation affordance at the bottom.
 *
 * Meta line: date · readingTime. Tags ship as chips below the
 * description — same pattern as the article page meta strip. The
 * `·` separator is reserved for within-a-value short conjunctions
 * (1–3 atoms, never wraps); sibling-link lists like tags use chips.
 * See docs/articles-decision-log.md §16b (Q1) for the rationale.
 *
 * Article tags are brand-cased (e.g. "LLMs", "Rust", "Next.js") in
 * frontmatter and rendered verbatim. See docs/articles-decision-log.md
 * §4 for the schema, and src/components/tag.tsx for the casing
 * convention across the site.
 */
export function ArticleCard({
  date, readingTime, title, description, url, tags, illustration, className,
}: ArticleCardProps) {
  const hasIllustration = Boolean(illustration);
  return (
    <li
      className={clsx(
        'grid grid-cols-1 gap-4 border-b border-rule py-6 last:border-b-0',
        hasIllustration && 'md:grid-cols-article-card md:gap-6 md:items-stretch',
        className,
      )}
    >
      { hasIllustration && (
        <div className="relative w-full aspect-video md:aspect-auto md:min-h-44 border border-rule bg-canvas overflow-hidden shrink-0">
          { illustration }
        </div>
      ) }
      <div className="flex flex-col">
        <Text variant="meta" as="span" className="inline-flex flex-wrap items-baseline gap-2 text-fg-subtle">
          <span className="text-fg-muted">{ date }</span>
          <span aria-hidden="true">·</span>
          <span>{`${readingTime} min`}</span>
        </Text>
        <Text variant="h3" as="p" className="mt-3 mb-0">
          <InlineLink href={url}>{ title }</InlineLink>
        </Text>
        <Text variant="body" className="text-fg-muted max-w-prose-wide mt-2 mb-0">{ description }</Text>
        <div className="flex flex-wrap gap-1.5 mt-4">
          { tags.map((tag) => (
            <Tag key={tag}>{ tag }</Tag>
          )) }
        </div>
        <ArrowLink href={url} className="mt-4">read article</ArrowLink>
      </div>
    </li>
  );
}
