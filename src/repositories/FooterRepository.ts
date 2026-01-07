import type { Icon } from '@phosphor-icons/react';

export interface FooterRepositoryResponse {
  title: string;
  icon: Icon;
  url: string;
}

export interface FooterRepository {
  getAll(): Array<FooterRepositoryResponse>;
}
