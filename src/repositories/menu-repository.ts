export interface MenuRepositoryResponse {
  name: string;
  path: string;
}

export interface MenuRepository {
  getAll(): Array<MenuRepositoryResponse>;
}
