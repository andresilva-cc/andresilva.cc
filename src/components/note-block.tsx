import { type ComponentType } from 'react';
import { run } from '@mdx-js/mdx';
import * as jsxRuntime from 'react/jsx-runtime';

import { Text } from '@/components/text';
import { ArrowLink } from '@/components/arrow-link';
import { InlineLink } from '@/components/inline-link';
import { YouTube } from '@/components/mdx/youtube';
import { ImageMdx } from '@/components/mdx/image-mdx';
import { Figure } from '@/components/mdx/figure';
import { PreShiki } from '@/components/mdx/pre-shiki';
import { formatDate } from '@/lib/format-date';
import type { Note } from '@/.velite';

const mdxComponents = {
  YouTube,
  Figure,
  img: ImageMdx,
  a: InlineLink,
  pre: PreShiki,
};

export interface NoteBlockProps {
  note: Note;
  showPermalink?: boolean;
  titleAs?: 'p' | 'h2';
}

export async function NoteBlock({ note, showPermalink = true, titleAs = 'p' }: NoteBlockProps) {
  const mdxModule = await run(note.body, { ...jsxRuntime, baseUrl: import.meta.url });
  const Content = mdxModule.default as ComponentType<{ components: typeof mdxComponents }>;

  const formattedDate = formatDate(note.publishedAt);

  return (
    <article id={note.slug}>
      <Text variant="meta" as="p" className="inline-flex flex-wrap items-baseline gap-2 text-fg-subtle mb-0">
        <time dateTime={note.publishedAt} className="text-fg-muted">
          { formattedDate }
        </time>
        <span aria-hidden="true">·</span>
        <span>{ note.kind }</span>
      </Text>

      <Text
        variant="h3"
        as={titleAs}
        className="mt-3 mb-0 text-fg"
      >
        { note.title }
      </Text>

      <div className="mt-4 max-w-prose-wide article-prose">
        <Content components={mdxComponents} />
      </div>

      { showPermalink && (
        <ArrowLink
          href={`/notes/${note.slug}`}
          aria-label={`permalink to ${note.title}`}
          className="mt-4"
        >
          permalink
        </ArrowLink>
      ) }
    </article>
  );
}
