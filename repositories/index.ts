import { TranslateFunction } from '@/types/i18n';
import { FooterRepository } from './FooterRepository';
import { JobsRepository } from './JobsRepository';
import { MenuRepository } from './MenuRepository';
import { ProjectsRepository } from './ProjectsRepository';

export const useRepositories = (t: TranslateFunction) => ({
  footerRepository: FooterRepository(),
  jobsRepository: JobsRepository(t),
  menuRepository: MenuRepository(t),
  projectsRepository: ProjectsRepository(t),
});
