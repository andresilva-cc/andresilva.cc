import { ForemArticlesRepository } from '@/repositories/implementations/forem-articles-repository';
import { StaticFooterRepository } from '@/repositories/implementations/static-footer-repository';
import { StaticJobsRepository } from '@/repositories/implementations/static-jobs-repository';
import { StaticMenuRepository } from '@/repositories/implementations/static-menu-repository';
import { StaticProjectsRepository } from '@/repositories/implementations/static-projects-repository';
import { StaticThemeRepository } from '@/repositories/implementations/static-theme-repository';

export function useRepositories() {
  return {
    articlesRepository: new ForemArticlesRepository(),
    footerRepository: new StaticFooterRepository(),
    jobsRepository: new StaticJobsRepository(),
    menuRepository: new StaticMenuRepository(),
    projectsRepository: new StaticProjectsRepository(),
    themeRepository: new StaticThemeRepository(),
  };
}
