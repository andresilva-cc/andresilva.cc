import { PageHead } from '@/components/page-head';
import { ArticleCard } from '@/components/article-card';
import { StippleArt } from '@/components/stipple-art';
import { Text } from '@/components/text';
import { getSlug } from '@/lib/get-slug';
import { safeHref } from '@/lib/safe-href';
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
                    <a
                      href={safeHref(article.url)}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={article.title}
                      className="absolute inset-0"
                    >
                      {/*
                        The illustration links to the article itself; the
                        embed's own link="badge" renders a small hover-
                        revealed permalink badge that opens the art in
                        stipple — so the art doubles as an article click
                        target without losing the link back to stipple.

                        No cols/rows: the embed derives the grid from the
                        host box, so the grid IS the container (verified:
                        grid pixel size matches the host within ~1px).
                        fit="none" renders it 1:1 — no scaling, no crop, no
                        letterbox. font-size sets grid density.
                      */}
                      <StippleArt
                        mode="hover"
                        config={config}
                        link="badge"
                        fit="none"
                        className="font-mono text-fg-muted m-0 p-0 select-none block overflow-hidden w-full h-full"
                        style={{ fontSize: '6px', lineHeight: 1 }}
                      />
                    </a>
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
