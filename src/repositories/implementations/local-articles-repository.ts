import { article as articles } from '@/.velite';
import type { ArticlesRepository } from '../articles-repository';

export class LocalArticlesRepository implements ArticlesRepository {
  getAll() {
    return [...articles].sort(
      (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    );
  }

  getBySlug(slug: string) {
    return articles.find((a) => a.slug === slug);
  }
}
