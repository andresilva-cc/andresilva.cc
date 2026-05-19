// T3 will rewrite this page properly. This is a temporary minimal fix to keep
// the build green after switching from ForemArticlesRepository (async) to
// LocalArticlesRepository (sync). The Forem-specific articleArt map and
// getSlug() indirection are removed here; coverArt comes from frontmatter in T3.
import { PageHead } from '@/components/page-head';
import { Text } from '@/components/text';
import { getRepositories } from '@/repositories';

export const metadata = {
  title: 'André Silva · Articles',
};

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
              <li key={article.slug}>
                <Text variant="body">{article.title}</Text>
              </li>
            )) }
          </ul>
        ) }
      </section>
    </>
  );
}
