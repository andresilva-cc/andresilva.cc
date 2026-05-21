import { PageHead } from '@/components/page-head';
import { Text } from '@/components/text';
import { ArticleCard } from '@/components/article-card';
import { ArticleIllustration } from '@/components/article-illustration';
import { getRepositories } from '@/repositories';
import { formatDate } from '@/lib/format-date';
import type { Article } from '@/.velite';

export const metadata = {
  title: 'André Silva · Articles',
};

function illustrationFor(article: Article) {
  if (!article.coverArt) return undefined;
  return (
    <ArticleIllustration
      url={`/articles/${article.slug}`}
      config={article.coverArt.params}
      title={article.title}
    />
  );
}

export default function Articles() {
  const { articlesRepository } = getRepositories();
  const articles = articlesRepository.getAll();

  return (
    <>
      <PageHead name="ARTICLES" />

      <section aria-label="Articles" className="py-8">
        { articles.length === 0 && (
          <Text variant="body" className="text-fg-muted m-0">
            No articles yet.
          </Text>
        ) }
        { articles.length > 0 && (
          <ul className="flex flex-col list-none p-0 m-0">
            { articles.map((article) => (
              <ArticleCard
                key={article.slug}
                date={formatDate(article.publishedAt)}
                readingTime={article.readingTime}
                title={article.title}
                description={article.summary}
                url={`/articles/${article.slug}`}
                tags={article.tags}
                illustration={illustrationFor(article)}
              />
            )) }
          </ul>
        ) }
      </section>
    </>
  );
}
