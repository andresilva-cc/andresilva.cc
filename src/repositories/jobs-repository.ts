import { ReactNode } from 'react';

export interface JobsRepositoryResponse {
  title: string;
  company: string;
  startDate: Date;
  /** Undefined for the current role. */
  endDate?: Date;
  /** Prior name of the employer (e.g. "Healthy Labs" for MPA). */
  formerly?: string;
  description: ReactNode;
  technologies: Array<string>;
  /** External references for the role (e.g. notable project shipped during tenure). */
  links?: Array<{ name: string; url: string }>;
}

export interface JobsRepository {
  getAll(): Array<JobsRepositoryResponse>;
}
