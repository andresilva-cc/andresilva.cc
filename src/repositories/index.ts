import { FooterRepository } from './FooterRepository';
import { JobsRepository } from './JobsRepository';
import { MenuRepository } from './MenuRepository';
import { ProjectsRepository } from './ProjectsRepository';

export const useRepositories = () => ({
  footerRepository: FooterRepository(),
  jobsRepository: JobsRepository(),
  menuRepository: MenuRepository(),
  projectsRepository: ProjectsRepository(),
});
