import { notFound, permanentRedirect } from 'next/navigation';
import type { Metadata } from 'next';

import { PageHead } from '@/components/page-head';
import { Text } from '@/components/text';
import { ArrowLink } from '@/components/arrow-link';
import { NoteBlock } from '@/components/note-block';
import { getRepositories } from '@/repositories';
import { NOTES_PAGE_SIZE } from '../../constants';

export async function generateStaticParams() {
  const { notesRepository } = getRepositories();
  const totalNotes = notesRepository.getAll().length;
  const totalPages = Math.ceil(totalNotes / NOTES_PAGE_SIZE);
  // Pages 2..N — page 1 is handled by /notes/page.tsx
  return Array.from({ length: Math.max(0, totalPages - 1) }, (_, i) => ({
    page: String(i + 2),
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ page: string }>;
}): Promise<Metadata> {
  const { page } = await params;
  return {
    title: `André Silva · Notes · Page ${page}`,
  };
}

export default async function NotesPaged({
  params,
}: {
  params: Promise<{ page: string }>;
}) {
  const { page: pageParam } = await params;
  const pageNum = Number(pageParam);

  const { notesRepository } = getRepositories();
  const allNotes = notesRepository.getAll();

  const totalPages = Math.ceil(allNotes.length / NOTES_PAGE_SIZE);

  if (!Number.isInteger(pageNum) || pageNum < 1) {
    notFound();
  }
  if (pageNum === 1) {
    permanentRedirect('/notes');
  }
  if (pageNum > totalPages) {
    notFound();
  }

  const start = (pageNum - 1) * NOTES_PAGE_SIZE;
  const notes = allNotes.slice(start, start + NOTES_PAGE_SIZE);

  const prevHref = pageNum === 2 ? '/notes' : `/notes/page/${pageNum - 1}`;
  const nextHref = pageNum < totalPages ? `/notes/page/${pageNum + 1}` : null;

  return (
    <>
      <PageHead name="NOTES" />

      <section aria-label="Notes" className="py-8">
        <ul className="flex flex-col list-none p-0 m-0 divide-y divide-rule">
          { notes.map((note) => (
            <li key={note.slug} className="py-6 first:pt-0">
              <NoteBlock note={note} />
            </li>
          )) }
        </ul>

        <div className="mt-8 flex items-baseline gap-2">
          <ArrowLink href={prevHref} direction="back">newer notes</ArrowLink>
          <span aria-hidden="true" className="text-fg-subtle"> · </span>
          <Text variant="meta" as="span" className="text-fg-subtle">
            {`page ${pageNum} of ${totalPages}`}
          </Text>
          { nextHref && (
            <>
              <span aria-hidden="true" className="text-fg-subtle"> · </span>
              <ArrowLink href={nextHref}>older notes</ArrowLink>
            </>
          ) }
        </div>
      </section>
    </>
  );
}
