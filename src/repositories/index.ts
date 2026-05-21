import { LocalArticlesRepository } from '@/repositories/implementations/local-articles-repository';
import { LocalNotesRepository } from '@/repositories/implementations/local-notes-repository';
import { StaticFooterRepository } from '@/repositories/implementations/static-footer-repository';
import { StaticJobsRepository } from '@/repositories/implementations/static-jobs-repository';
import { StaticMenuRepository } from '@/repositories/implementations/static-menu-repository';
import { StaticProjectsRepository } from '@/repositories/implementations/static-projects-repository';

/*
 * Repository factory — returns fresh instances of every static + async
 * repository the app consumes. Plain function (not a React hook); the
 * old `useRepositories` name confused both readers and the
 * react-hooks/rules-of-hooks lint rule when called from server-component
 * async functions.
 */
export function getRepositories() {
  return {
    articlesRepository: new LocalArticlesRepository(),
    notesRepository: new LocalNotesRepository(),
    footerRepository: new StaticFooterRepository(),
    jobsRepository: new StaticJobsRepository(),
    menuRepository: new StaticMenuRepository(),
    projectsRepository: new StaticProjectsRepository(),
  };
}
