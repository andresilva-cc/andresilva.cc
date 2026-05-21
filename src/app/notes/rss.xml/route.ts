import { getRepositories } from '@/repositories';
import { SITE_ORIGIN } from '@/lib/config';
import { renderNoteHtml } from '@/lib/rss-renderer';
import { escapeXml, toRfc822, escapeCdata } from '@/lib/rss-helpers';

export const dynamic = 'force-static';

const FEED_URL = `${SITE_ORIGIN}/notes/rss.xml`;

export async function GET(): Promise<Response> {
  const { notesRepository } = getRepositories();
  const notes = notesRepository.getAll();

  const itemsHtml = await Promise.all(
    notes.map(async (n) => {
      const link = `${SITE_ORIGIN}/notes/${n.slug}`;
      const contentHtml = await renderNoteHtml(n);
      return `    <item>
      <title>${escapeXml(n.title)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${toRfc822(n.publishedAt)}</pubDate>
      <dc:creator>André Silva</dc:creator>
      <description>${escapeXml(n.excerpt)}</description>
      <content:encoded><![CDATA[${escapeCdata(contentHtml)}]]></content:encoded>
      <category>${escapeXml(n.kind)}</category>
    </item>`;
    }),
  );

  const items = itemsHtml.join('\n');

  // Omit <lastBuildDate> when there are no notes — a feed with no items
  // has no meaningful build date, and including new Date() would produce
  // non-deterministic output that invalidates CDN caches needlessly.
  const lastBuildDateTag = notes.length > 0
    ? `\n    <lastBuildDate>${toRfc822(notes[0].publishedAt)}</lastBuildDate>`
    : '';

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
     xmlns:atom="http://www.w3.org/2005/Atom"
     xmlns:content="http://purl.org/rss/1.0/modules/content/"
     xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>André Silva — Notes</title>
    <link>${SITE_ORIGIN}/notes</link>
    <description>Short notes, TILs, takes, and code snippets from André Silva.</description>
    <language>en</language>
    <dc:creator>André Silva</dc:creator>
    <atom:link rel="self" type="application/rss+xml" href="${FEED_URL}" />${lastBuildDateTag}
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
}
