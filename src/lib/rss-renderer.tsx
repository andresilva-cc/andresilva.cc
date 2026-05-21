import type { ComponentType } from 'react';
import { run } from '@mdx-js/mdx';
import * as jsxRuntime from 'react/jsx-runtime';
import { renderToStaticMarkup } from 'react-dom/server.edge';

import type { Article, Note } from '@/.velite';
import { YouTubeRss } from '@/components/mdx/rss/youtube';
import { makeFigureRss } from '@/components/mdx/rss/figure';
import { makeImageMdxRss } from '@/components/mdx/rss/image-mdx';
import { makeInlineLinkRss } from '@/components/mdx/rss/inline-link';
import { PreShikiRss } from '@/components/mdx/rss/pre-shiki';

export { absolutize } from '@/lib/rss-url';

function makeRssComponents(basePath: string) {
  return {
    YouTube: YouTubeRss,
    Figure: makeFigureRss(basePath),
    img: makeImageMdxRss(basePath),
    a: makeInlineLinkRss(basePath),
    pre: PreShikiRss,
  };
}

async function renderEntryHtml(body: string, basePath: string): Promise<string> {
  const mod = await run(body, { ...jsxRuntime, baseUrl: import.meta.url });
  const Content = mod.default as ComponentType<{ components: ReturnType<typeof makeRssComponents> }>;
  const components = makeRssComponents(basePath);
  return renderToStaticMarkup(<Content components={components} />);
}

export async function renderArticleHtml(article: Article): Promise<string> {
  return renderEntryHtml(article.body, `articles/${article.slug}`);
}

export async function renderNoteHtml(note: Note): Promise<string> {
  return renderEntryHtml(note.body, `notes/${note.slug}`);
}
