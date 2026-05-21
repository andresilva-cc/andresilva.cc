import type { ComponentType } from 'react';
import { run } from '@mdx-js/mdx';
import * as jsxRuntime from 'react/jsx-runtime';
import { renderToStaticMarkup } from 'react-dom/server.edge';

import type { Article } from '@/.velite';
import { YouTubeRss } from '@/components/mdx/rss/youtube';
import { makeFigureRss } from '@/components/mdx/rss/figure';
import { makeImageMdxRss } from '@/components/mdx/rss/image-mdx';
import { makeInlineLinkRss } from '@/components/mdx/rss/inline-link';
import { PreShikiRss } from '@/components/mdx/rss/pre-shiki';

export { absolutize } from '@/lib/rss-url';

function makeRssComponents(slug: string) {
  return {
    YouTube: YouTubeRss,
    Figure: makeFigureRss(slug),
    img: makeImageMdxRss(slug),
    a: makeInlineLinkRss(slug),
    pre: PreShikiRss,
  };
}

export async function renderArticleHtml(article: Article): Promise<string> {
  const mod = await run(article.body, { ...jsxRuntime, baseUrl: import.meta.url });
  const Content = mod.default as ComponentType<{ components: ReturnType<typeof makeRssComponents> }>;
  const components = makeRssComponents(article.slug);
  return renderToStaticMarkup(<Content components={components} />);
}
