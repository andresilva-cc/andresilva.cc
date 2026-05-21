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
import { Figure } from '@/components/mdx/figure';
import { PreShiki } from '@/components/mdx/pre-shiki';
import { getRepositories } from '@/repositories';
import { formatDate } from '@/lib/format-date';
import { SITE_ORIGIN } from '@/lib/config';

const mdxComponents = {
  YouTube,
  Figure,
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
      url: `${SITE_ORIGIN}/articles/${article.slug}`,
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

  const formattedDate = formatDate(article.publishedAt);
  const formattedUpdated = article.updatedAt ? formatDate(article.updatedAt) : null;

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
    'author': { '@type': 'Person', 'name': 'André Silva', 'url': `${SITE_ORIGIN}/about` },
    'url': `${SITE_ORIGIN}/articles/${article.slug}`,
    'image': `${SITE_ORIGIN}${article.ogImage}`,
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
  const syndicationEyebrow = '// elsewhere';
  const updatedPrefix = formattedUpdated ? `// last updated ${formattedUpdated}` : null;

  return (
    <article>
      <header>
        <div className="pt-8">
          <ArrowLink href="/articles" direction="back">back to articles</ArrowLink>
        </div>

        <Eyebrow className="mt-8 block">{ eyebrowLabel }</Eyebrow>

        {/* Eyebrow → title → summary is the identity cluster (uninterrupted);
            meta sits below as publication info / soft transition into the body. */}
        <Text
          variant="h1"
          as="h1"
          className="mt-3 mb-0"
        >
          { article.title }
        </Text>

        <Text variant="body" className="mt-4 mb-0 text-fg-muted max-w-prose-wide">
          { article.summary }
        </Text>

        <Text variant="meta" as="p" className="mt-6 mb-0 text-fg-subtle">
          <time dateTime={article.publishedAt} className="text-fg-muted">
            { formattedDate }
          </time>
          <span aria-hidden="true"> · </span>
          {`${article.readingTime} min`}
        </Text>

        { updatedPrefix && (
          <Text variant="meta" as="p" className="mt-1 mb-0 text-fg-subtle italic">
            { updatedPrefix }
          </Text>
        ) }

        { article.coverArt && (
          <>
            <hr className="mt-8 border-0 border-t border-rule" aria-hidden="true" />
            <section aria-label="Cover art" className="mt-8">
              <div
                className="article-cover-art border border-rule bg-canvas overflow-hidden max-w-prose-wide w-full"
                style={{ aspectRatio: '16 / 7' }}
              >
                {/* Native-measured grid (no explicit cols/rows): cover renders at
                    stipple's signature fine grain (~180 × 46 cells at desktop).
                    The card thumbnail is a reduced preview, not a pixel-identical
                    miniature — see docs/articles-decision-log.md §16b. */}
                <StippleArt
                  config={article.coverArt.params}
                  mode="always"
                  fit="cover"
                  link="none"
                  className="w-full h-full block text-fg-muted"
                  style={{ fontSize: '6px', lineHeight: 1 }}
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
            <Eyebrow className="block mb-2">{ syndicationEyebrow }</Eyebrow>
            <ArrowLink href={article.devtoUrl}>also on dev.to</ArrowLink>
          </div>
        ) }

        <div className="mt-8 pb-12">
          <ArrowLink href="/articles" direction="back">back to articles</ArrowLink>
        </div>
      </footer>

      <script
        type="application/ld+json"

        // Escape </script> in case any frontmatter field ever contains the literal sequence —
        // would otherwise break out of the JSON-LD block. Cheap defense-in-depth.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ld).replace(/<\/script>/gi, '<\\/script>') }}
      />
    </article>
  );
}
