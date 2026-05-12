export interface FooterRepositoryResponse {
  title: string;
  url: string;
}

export interface FooterRepository {
  getAll(): Array<FooterRepositoryResponse>;
}
