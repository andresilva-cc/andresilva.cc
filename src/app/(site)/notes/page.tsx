import { PageHead } from '@/components/page-head';
import { Text } from '@/components/text';
import { ArrowLink } from '@/components/arrow-link';
import { NoteBlock } from '@/components/note-block';
import { getRepositories } from '@/repositories';
import { NOTES_PAGE_SIZE } from './constants';

export const metadata = {
  title: 'Notes · André Silva',
};

export default async function Notes() {
  const { notesRepository } = getRepositories();
  const allNotes = notesRepository.getAll();

  const totalPages = Math.max(1, Math.ceil(allNotes.length / NOTES_PAGE_SIZE));
  const notes = allNotes.slice(0, NOTES_PAGE_SIZE);

  return (
    <>
      <PageHead name="NOTES" />

      <section aria-label="Notes" className="py-8">
        { notes.length === 0 && (
          <Text variant="body" className="text-fg-muted m-0">
            No notes yet.
          </Text>
        ) }
        { notes.length > 0 && (
          <>
            <ul className="flex flex-col list-none p-0 m-0 divide-y divide-rule">
              { notes.map((note) => (
                <li key={note.slug} className="py-6 first:pt-0">
                  <NoteBlock note={note} />
                </li>
              )) }
            </ul>

            { totalPages > 1 && (
              <div className="mt-8 flex items-baseline gap-2">
                <Text variant="meta" as="span" className="text-fg-subtle">
                  {`page 1 of ${totalPages}`}
                </Text>
                <span aria-hidden="true" className="text-fg-subtle"> · </span>
                <ArrowLink href="/notes/page/2">older notes</ArrowLink>
              </div>
            ) }
          </>
        ) }
      </section>
    </>
  );
}
