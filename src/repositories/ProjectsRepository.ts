import { Project } from '@/types/Project';

export interface ProjectsRepositoryResponse extends Project {}

export interface ProjectsRepository {
  getAll(): Array<ProjectsRepositoryResponse>
}
