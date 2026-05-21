import type { Note } from '@/.velite';

export interface NotesRepository {
  getAll(): Note[];
  getBySlug(slug: string): Note | undefined;
}
