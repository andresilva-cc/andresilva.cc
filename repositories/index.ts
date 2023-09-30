import { TranslateFunction } from '@/types/i18n';
import { JobsRepository } from './JobsRepository';
import { MenuRepository } from './MenuRepository';
import { ProjectsRepository } from './ProjectsRepository';

export const useRepositories = (t: TranslateFunction) => ({
  jobsRepository: JobsRepository(t),
  menuRepository: MenuRepository(t),
  projectsRepository: ProjectsRepository(t),
});
