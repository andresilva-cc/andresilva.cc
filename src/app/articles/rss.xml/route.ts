import { getRepositories } from '@/repositories';
import { SITE_ORIGIN } from '@/lib/config';

export const dynamic = 'force-static';

const FEED_URL = `${SITE_ORIGIN}/articles/rss.xml`;

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// toUTCString() isn't spec-guaranteed to be RFC 822, but Node/V8 always emits
// it that way. Revisit if the runtime changes to Bun or Deno.
function toRfc822(isoDate: string): string {
  return new Date(isoDate).toUTCString();
}

export function GET(): Response {
  const { articlesRepository } = getRepositories();
  const articles = articlesRepository.getAll();

  const items = articles
    .map((a) => {
      const link = `${SITE_ORIGIN}/articles/${a.slug}`;
      // summary is required by the Velite schema (velite.config.ts).
      // If that ever changes, guard with a fallback string before escaping.
      return `    <item>
      <title>${escapeXml(a.title)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${toRfc822(a.publishedAt)}</pubDate>
      <description>${escapeXml(a.summary)}</description>
    </item>`;
    })
    .join('\n');

  // Omit <lastBuildDate> when there are no articles — a feed with no items
  // has no meaningful build date, and including new Date() would produce
  // non-deterministic output that invalidates CDN caches needlessly.
  const lastBuildDateTag = articles.length > 0
    ? `\n    <lastBuildDate>${toRfc822(articles[0].publishedAt)}</lastBuildDate>`
    : '';

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>André Silva — Articles</title>
    <link>${SITE_ORIGIN}/articles</link>
    <description>Articles by André Silva — software engineering, web performance, and developer tooling.</description>
    <language>en</language>
    <atom:link rel="self" type="application/rss+xml" href="${FEED_URL}" />${lastBuildDateTag}
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
}
