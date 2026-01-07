import { ForemClient } from '@/api/forem';
import { ArticlesRepository, ArticlesRepositoryResponse } from '../articles-repository';

export class ForemArticlesRepository implements ArticlesRepository {
  async getAll() {
    const response = await ForemClient.get<Array<ArticlesRepositoryResponse>>('/articles?username=andresilva-cc');
    return response.data;
  }

  async getById(id: number) {
    const response = await ForemClient.get<ArticlesRepositoryResponse>(`/articles/${id}`);
    return response.data ?? null;
  }
}
