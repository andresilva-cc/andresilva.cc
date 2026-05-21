import { type ComponentType } from 'react';
import { run } from '@mdx-js/mdx';
import * as jsxRuntime from 'react/jsx-runtime';

import { Text } from '@/components/text';
import { Eyebrow } from '@/components/eyebrow';
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
}

/*
 * NoteBlock — server component; renders one note as an inline stream block.
 *
 * Anatomy (per design-system.md rule 25 + ui-spec.md):
 *   - <article id="{slug}"> so /notes#{slug} deep-links to it
 *   - Meta line: {YYYY.MM.DD} · {kind} in comment-tag eyebrow register,
 *     with a trailing permalink ArrowLink pushed to the right edge
 *   - <h3> title in text-h3 (no link — permalink arrow carries that role)
 *   - MDX body styled by .article-prose
 *
 * Used verbatim on both /notes (index) and /notes/[slug] (detail).
 */
export async function NoteBlock({ note }: NoteBlockProps) {
  const mdxModule = await run(note.body, { ...jsxRuntime, baseUrl: import.meta.url });
  const Content = mdxModule.default as ComponentType<{ components: typeof mdxComponents }>;

  const formattedDate = formatDate(note.publishedAt);

  return (
    <article id={note.slug}>
      <div className="flex items-baseline justify-between gap-4">
        <Eyebrow className="text-fg-subtle">
          <time dateTime={note.publishedAt}>
            { formattedDate }
          </time>
          <span aria-hidden="true"> · </span>
          { note.kind }
        </Eyebrow>
        <ArrowLink
          href={`/notes/${note.slug}`}
          aria-label={`permalink to ${note.title}`}
          className="text-fg-subtle hover:text-accent shrink-0"
        >
          permalink
        </ArrowLink>
      </div>

      <Text
        variant="h3"
        as="h3"
        className="mt-3 mb-0 text-fg"
      >
        { note.title }
      </Text>

      <div className="mt-4 max-w-prose-wide article-prose">
        <Content components={mdxComponents} />
      </div>
    </article>
  );
}
