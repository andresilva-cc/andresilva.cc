export interface MenuRepositoryResponse {
  name: string;
  path: string;
  activeRegex?: string;
  hideOnDesktop?: boolean;
}

export interface MenuRepository {
  getAll(): Array<MenuRepositoryResponse>;
}
