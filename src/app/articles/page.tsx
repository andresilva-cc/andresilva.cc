import { PageHead } from '@/components/page-head';
import { SectionHead } from '@/components/section-head';
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

      <section aria-labelledby="articles-h" className="py-12 md:py-16">
        <SectionHead eyebrow="// 01 / writing on engineering" title="Posts" id="articles-h" flush />
        { articles.length === 0 && (
          <Text variant="body" className="text-fg-muted m-0">
            No posts yet, or the dev.to feed is unavailable.
          </Text>
        ) }
        { articles.length > 0 && (
          <ul className="flex flex-col list-none p-0 m-0">
            { articles.map((article) => (
              <ArticleCard
                key={article.id}
                date={formatArticleDate(article.published_at)}
                readingTime={article.reading_time_minutes}
                title={article.title}
                description={article.description}
                url={article.url}
                tags={article.tag_list}
              />
            )) }
          </ul>
        ) }
      </section>
    </>
  );
}
