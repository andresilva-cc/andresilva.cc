import type { MenuRepository } from '../MenuRepository';

export class StaticMenuRepository implements MenuRepository {
  getAll() {
    return [
      { name: 'menu.home', path: '/', hideOnDesktop: true },
      { name: 'menu.about', path: '/about' },
      { name: 'menu.articles', path: '/articles', activeRegex: '^/article' },
      { name: 'menu.career', path: '/career' },
      { name: 'menu.projects', path: '/projects' },
    ];
  }
}
