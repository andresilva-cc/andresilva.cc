import { StaticFooterRepository } from './Implementations/StaticFooterRepository';
import { StaticJobsRepository } from './Implementations/StaticJobsRepository';
import { StaticMenuRepository } from './Implementations/StaticMenuRepository';
import { StaticProjectsRepository } from './Implementations/StaticProjectsRepository';

export const useRepositories = () => ({
  footerRepository: new StaticFooterRepository(),
  jobsRepository: new StaticJobsRepository(),
  menuRepository: new StaticMenuRepository(),
  projectsRepository: new StaticProjectsRepository(),
});
