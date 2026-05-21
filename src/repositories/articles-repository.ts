import type { Article } from '@/.velite';

export interface ArticlesRepository {
  getAll(): Article[];
  getBySlug(slug: string): Article | undefined;
}
