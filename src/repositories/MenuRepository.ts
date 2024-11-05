export interface MenuRepositoryResponse {
  name: string
  path: string
  hiddenOnDesktop?: boolean
}

export interface MenuRepository {
  getAll(): Array<MenuRepositoryResponse>
}
