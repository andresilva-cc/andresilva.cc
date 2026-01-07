import { ReactNode } from 'react';

export interface JobsRepositoryResponse {
  title: string;
  company: string;
  startDate: Date;
  description: ReactNode;
  technologies: Array<string>;
}

export interface JobsRepository {
  getAll(): Array<JobsRepositoryResponse>;
}
