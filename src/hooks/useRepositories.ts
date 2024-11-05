import { StaticFooterRepository } from '@/repositories/Implementations/StaticFooterRepository';
import { StaticJobsRepository } from '@/repositories/Implementations/StaticJobsRepository';
import { StaticMenuRepository } from '@/repositories/Implementations/StaticMenuRepository';
import { StaticProjectsRepository } from '@/repositories/Implementations/StaticProjectsRepository';

export function useRepositories() {
  return {
    footerRepository: new StaticFooterRepository(),
    jobsRepository: new StaticJobsRepository(),
    menuRepository: new StaticMenuRepository(),
    projectsRepository: new StaticProjectsRepository(),
  };
}
