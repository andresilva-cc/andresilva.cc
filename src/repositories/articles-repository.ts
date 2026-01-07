import { Article } from '@/types/article';

export interface ArticlesRepositoryResponse extends Article {}

export interface ArticlesRepository {
  getAll(): Promise<Array<ArticlesRepositoryResponse>>;
  getById(id: number): Promise<ArticlesRepositoryResponse | null>;
}
