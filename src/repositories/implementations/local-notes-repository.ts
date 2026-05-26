import { note as notes } from '@/.velite';
import type { NotesRepository } from '../notes-repository';

export class LocalNotesRepository implements NotesRepository {
  getAll() {
    return [...notes].sort(
      (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    );
  }

  getBySlug(slug: string) {
    return notes.find((n) => n.slug === slug);
  }
}
