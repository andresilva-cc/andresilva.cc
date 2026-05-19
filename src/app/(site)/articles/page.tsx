import { PageHead } from '@/components/page-head';
import { ArticleCard } from '@/components/article-card';
import { ArticleIllustration } from '@/components/article-illustration';
import { Text } from '@/components/text';
import { getSlug } from '@/lib/get-slug';
import { formatArticleDate } from '@/lib/format-date';
import { getRepositories } from '@/repositories';

export const metadata = {
  title: 'André Silva · Articles',
};

/* Stipple embed configs keyed by article slug (path segment of dev.to URL).
   Only articles with a config get the two-column layout with an animation.
   Each config echoes the article's subject:
   - "74% performance increase" → a flow field: streaming currents, a
     throughput/speed metaphor. `block` ramp gives it solid mass.
   - "rendering modes explained" → a 3D donut: the canonical ASCII
     donut.c renderer. `sloane` ramp is its native shading alphabet.
   Ramp follows the primitive's nature (field → block, lit 3D → sloane);
   palette is `mono` (quiet monochrome — `acid` is reserved for the hero).
   The embed derives its grid from the container (no cols/rows below), so
   the art renders into the full container. */
const articleArt: Record<string, string> = {
  'how-i-achieved-a-74-performance-increase-on-a-page-2gjm':
    'p=flow&pathCount=70&pathLength=140&trail=0.97&speed=2&noiseScale=0.8&ramp=block&palette=mono',
  'rendering-modes-explained-2711':
    'p=donut&mode=torus&K1=32&speedA=1&speedB=2&tubeRadius=0.6&centerRadius=2.4&ramp=sloane&palette=mono',
};

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
              const config = articleArt[slug];
              const illustration = config
                ? (
                    <ArticleIllustration
                      url={article.url}
                      config={config}
                      title={article.title}
                    />
                  )
                : undefined;
              return (
                <ArticleCard
                  key={article.id}
                  date={formatArticleDate(article.published_at)}
                  readingTime={article.reading_time_minutes}
                  reactions={article.public_reactions_count}
                  comments={article.comments_count}
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
