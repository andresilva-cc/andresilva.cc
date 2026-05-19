import { type ComponentType } from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { run } from '@mdx-js/mdx';
import * as jsxRuntime from 'react/jsx-runtime';

import { Text } from '@/components/text';
import { Tag } from '@/components/tag';
import { Eyebrow } from '@/components/eyebrow';
import { ArrowLink } from '@/components/arrow-link';
import { InlineLink } from '@/components/inline-link';
import { StippleArt } from '@/components/stipple-art';
import { YouTube } from '@/components/mdx/youtube';
import { ImageMdx } from '@/components/mdx/image-mdx';
import { PreShiki } from '@/components/mdx/pre-shiki';
import { getRepositories } from '@/repositories';
import { formatArticleDate } from '@/lib/format-date';

const SITE_URL = 'https://andresilva.cc';

const mdxComponents = {
  YouTube,
  img: ImageMdx,
  a: InlineLink,
  pre: PreShiki,
};

export async function generateStaticParams() {
  // Returns only the slugs of currently-published articles. An empty return
  // (pre-T9 content migration) falls through to Next.js on-demand dynamic
  // rendering — not a 404 — which is the desired behavior during dev.
  const { articlesRepository } = getRepositories();
  return articlesRepository.getAll().map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { articlesRepository } = getRepositories();
  const article = articlesRepository.getBySlug(slug);
  if (!article) return {};
  return {
    title: `${article.title} | André Silva`,
    description: article.summary,
    openGraph: {
      title: article.title,
      description: article.summary,
      type: 'article',
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt ?? article.publishedAt,
      url: `${SITE_URL}/articles/${article.slug}`,
      images: [{ url: article.ogImage, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.summary,
      images: [article.ogImage],
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { articlesRepository } = getRepositories();
  const article = articlesRepository.getBySlug(slug);
  if (!article) notFound();

  // article.body is a build-time-compiled MDX function-body string emitted by
  // Velite — not runtime user input — so run() here is not dynamic code
  // execution in the security sense. Analogous to the JSON-LD serialization below.
  const mdxModule = await run(article.body, { ...jsxRuntime, baseUrl: import.meta.url });

  const Content = mdxModule.default as ComponentType<{ components: typeof mdxComponents }>;

  const titleIsShort = article.title.length <= 40;
  const formattedDate = formatArticleDate(article.publishedAt);
  const formattedUpdated = article.updatedAt ? formatArticleDate(article.updatedAt) : null;

  // JSON-LD BlogPosting — per architecture §7.
  // consistent-as-needed quote-props: @-prefixed keys require quotes, so all
  // keys in each object literal must be quoted for consistency.
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    'headline': article.title,
    'description': article.summary,
    'datePublished': article.publishedAt,
    'dateModified': article.updatedAt ?? article.publishedAt,
    'author': { '@type': 'Person', 'name': 'André Silva', 'url': `${SITE_URL}/about` },
    'url': `${SITE_URL}/articles/${article.slug}`,
    'image': `${SITE_URL}${article.ogImage}`,
    'keywords': article.tags.join(', '),
    'wordCount': article.wordCount,
    'timeRequired': `PT${article.readingTime}M`,
    'inLanguage': 'en',
    'isPartOf': { '@type': 'Blog', 'name': 'andresilva.cc/articles' },
  };

  // The eyebrow label "// article" uses two forward-slashes — authored as a
  // string variable to avoid the react/jsx-no-comment-textnodes lint rule which
  // flags direct // text nodes in JSX as likely accidental comments.
  const eyebrowLabel = '// article';
  const updatedPrefix = formattedUpdated ? `// last updated ${formattedUpdated}` : null;

  return (
    <article>
      <header>
        <div className="pt-8">
          <ArrowLink href="/articles" direction="back">back to articles</ArrowLink>
        </div>

        <div className="mt-8 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
          <Eyebrow>{ eyebrowLabel }</Eyebrow>
          <Text variant="meta" as="span" className="inline-flex flex-wrap items-baseline gap-2 text-fg-subtle">
            <time dateTime={article.publishedAt} className="text-fg-muted">
              { formattedDate }
            </time>
            <span aria-hidden="true">·</span>
            <span>{`${article.readingTime} min`}</span>
            { article.tags.length > 0 && (
              <>
                <span aria-hidden="true">·</span>
                <span>{ article.tags.join(' · ') }</span>
              </>
            ) }
          </Text>
        </div>

        { updatedPrefix && (
          <Text variant="meta" as="p" className="mt-1 text-fg-subtle italic m-0">
            { updatedPrefix }
          </Text>
        ) }

        <Text
          variant={titleIsShort ? 'display' : 'h1'}
          as="h1"
          className="mt-3 mb-0 text-accent"
        >
          { article.title }
        </Text>

        <Text variant="body" className="mt-4 mb-0 text-fg-muted max-w-prose-wide">
          { article.summary }
        </Text>

        { article.coverArt && (
          <>
            <hr className="mt-8 border-0 border-t border-rule" aria-hidden="true" />
            <section aria-label="Cover art" className="mt-8">
              <div
                className="article-cover-art border border-rule bg-canvas overflow-hidden max-w-prose-wide w-full"
                style={{ aspectRatio: '16 / 7' }}
              >
                <StippleArt
                  config={article.coverArt.params}
                  mode="always"
                  fit="cover"
                  link="none"
                  className="w-full h-full block"
                />
              </div>
            </section>
          </>
        ) }
      </header>

      <hr className="mt-8 border-0 border-t border-rule" aria-hidden="true" />

      <div className="mt-8 max-w-prose-wide article-prose">
        <Content components={mdxComponents} />
      </div>

      <footer>
        { article.tags.length > 0 && (
          <ul className="mt-12 flex flex-wrap gap-1.5 list-none p-0 m-0">
            { article.tags.map((tag) => (
              <li key={tag}>
                <Tag>{ tag }</Tag>
              </li>
            )) }
          </ul>
        ) }

        { article.devtoUrl && (
          <div className="mt-6">
            <ArrowLink href={article.devtoUrl}>also on dev.to</ArrowLink>
          </div>
        ) }

        <div className="mt-8 pb-12">
          <ArrowLink href="/articles" direction="back">back to articles</ArrowLink>
        </div>
      </footer>

      <script
        type="application/ld+json"

        dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
      />
    </article>
  );
}
