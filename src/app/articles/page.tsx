import type { ReactNode } from 'react';

import { PageHead } from '@/components/page-head';
import { ArticleCard } from '@/components/article-card';
import { Text } from '@/components/text';
import { getRepositories } from '@/repositories';

export const metadata = {
  title: 'André Silva · Articles',
};

/* Format a forem ISO timestamp into the canonical `YYYY.MM.DD` lowercase
   date used across the redesign for article metadata. Returns an empty
   string for invalid or missing timestamps. */
function formatArticleDate(isoString: string | null | undefined): string {
  if (!isoString) return '';
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return '';
  // UTC accessors so the rendered date doesn't shift with the server's
  // local timezone — forem returns UTC ISO strings, and we want a
  // single canonical date string regardless of where the build runs.
  const yyyy = date.getUTCFullYear();
  const mm = String(date.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(date.getUTCDate()).padStart(2, '0');
  return `${yyyy}.${mm}.${dd}`;
}

/* Static illustration lookup keyed by article slug (path segment of dev.to URL).
   Only articles with known illustrations get the two-column layout. */
const illustrations: Record<string, ReactNode> = {
  'how-i-achieved-a-74-performance-increase-on-a-page-2gjm': (
    <svg viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="block w-full h-full">
      <path d="M30 95 A 70 70 0 0 1 170 95" stroke="var(--color-accent-muted)" strokeWidth="1.2" fill="none" />
      <path d="M30 95 A 70 70 0 0 1 100 25" stroke="var(--color-accent)" strokeWidth="2" fill="none" />
      <line x1="30" y1="95" x2="36" y2="92" stroke="var(--color-accent-muted)" strokeWidth="1" />
      <line x1="50" y1="60" x2="56" y2="63" stroke="var(--color-accent-muted)" strokeWidth="1" />
      <line x1="100" y1="25" x2="100" y2="32" stroke="var(--color-accent)" strokeWidth="1.2" />
      <line x1="150" y1="60" x2="144" y2="63" stroke="var(--color-accent-muted)" strokeWidth="1" />
      <line x1="170" y1="95" x2="164" y2="92" stroke="var(--color-accent-muted)" strokeWidth="1" />
      <line x1="100" y1="95" x2="148" y2="48" stroke="var(--color-accent)" strokeWidth="2" strokeLinecap="round" />
      <circle cx="100" cy="95" r="4" fill="var(--color-accent)" />
      <text x="100" y="108" fontFamily="JetBrains Mono, monospace" fontSize="13" fontWeight="600" fill="var(--color-accent)" textAnchor="middle" letterSpacing="0.06em">74%</text>
      <line x1="20" y1="105" x2="180" y2="105" stroke="var(--color-rule-strong)" strokeWidth="0.6" opacity="0.5" />
    </svg>
  ),
  'rendering-modes-explained-2711': (
    <svg viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="block w-full h-full">
      <path d="M30 30 L30 24 L170 24 L170 30" stroke="var(--color-accent-muted)" strokeWidth="1" fill="none" />
      <line x1="100" y1="24" x2="100" y2="18" stroke="var(--color-accent-muted)" strokeWidth="1" />
      <rect x="20" y="40" width="40" height="30" stroke="var(--color-accent)" strokeWidth="1.2" fill="none" />
      <text x="40" y="60" fontFamily="JetBrains Mono, monospace" fontSize="11" fontWeight="600" fill="var(--color-accent)" textAnchor="middle" letterSpacing="0.04em">SSR</text>
      <rect x="80" y="40" width="40" height="30" stroke="var(--color-accent)" strokeWidth="1.2" fill="none" />
      <text x="100" y="60" fontFamily="JetBrains Mono, monospace" fontSize="11" fontWeight="600" fill="var(--color-accent)" textAnchor="middle" letterSpacing="0.04em">SSG</text>
      <rect x="140" y="40" width="40" height="30" stroke="var(--color-accent)" strokeWidth="1.2" fill="none" />
      <text x="160" y="60" fontFamily="JetBrains Mono, monospace" fontSize="11" fontWeight="600" fill="var(--color-accent)" textAnchor="middle" letterSpacing="0.04em">CSR</text>
      <text x="100" y="105" fontFamily="JetBrains Mono, monospace" fontSize="9" fill="var(--color-fg-subtle)" textAnchor="middle" letterSpacing="0.1em">&#x2F;&#x2F; RENDERING</text>
    </svg>
  ),
};

function getSlug(url: string): string {
  try {
    return new URL(url).pathname.split('/').filter(Boolean).pop() ?? '';
  }
  catch {
    return '';
  }
}

export default async function Articles() {
  const { articlesRepository } = getRepositories();
  let articles: Awaited<ReturnType<typeof articlesRepository.getAll>> = [];
  try {
    articles = await articlesRepository.getAll();
  }
  catch {
    // Forem feed unavailable at build time — render an empty list rather
    // than failing the build. The Posts section will simply show no items.
  }

  return (
    <>
      <PageHead name="ARTICLES" />

      <section aria-label="Articles" className="py-8">
        { articles.length === 0 && (
          <Text variant="body" className="text-fg-muted m-0">
            No posts yet, or the dev.to feed is unavailable.
          </Text>
        ) }
        { articles.length > 0 && (
          <ul className="flex flex-col list-none p-0 m-0">
            { articles.map((article) => {
              const slug = getSlug(article.url);
              const illustration = illustrations[slug];
              return (
                <ArticleCard
                  key={article.id}
                  date={formatArticleDate(article.published_at)}
                  readingTime={article.reading_time_minutes}
                  title={article.title}
                  description={article.description}
                  url={article.url}
                  tags={article.tag_list}
                  illustration={illustration}
                />
              );
            }) }
          </ul>
        ) }
      </section>
    </>
  );
}
