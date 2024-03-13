import { TranslateFunction } from '@/types/i18n';
import { ArticlesRepository } from '@/repositories/ArticlesRepository';
import { FooterRepository } from '@/repositories/FooterRepository';
import { JobsRepository } from '@/repositories/JobsRepository';
import { MenuRepository } from '@/repositories/MenuRepository';
import { ProjectsRepository } from '@/repositories/ProjectsRepository';

export function useRepositories(t: TranslateFunction) {
  return {
    articlesRepository: ArticlesRepository(),
    footerRepository: FooterRepository(),
    jobsRepository: JobsRepository(t),
    menuRepository: MenuRepository(t),
    projectsRepository: ProjectsRepository(t),
  };
}
