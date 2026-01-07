import { Project } from '@/types/project';

export interface ProjectsRepositoryResponse extends Project {}

export interface ProjectsRepository {
  getAll(): Array<ProjectsRepositoryResponse>;
}
