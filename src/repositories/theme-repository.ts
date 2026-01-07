export interface ThemeRepositoryResponse {
  id: string;
  name: string;
}

export interface ThemeRepository {
  getAll(): Array<ThemeRepositoryResponse>;
  getDefault(): ThemeRepositoryResponse;
}
