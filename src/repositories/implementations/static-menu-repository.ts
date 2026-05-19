import type { MenuRepository } from '../menu-repository';

export class StaticMenuRepository implements MenuRepository {
  getAll() {
    return [
      { name: 'home', path: '/' },
      { name: 'about', path: '/about' },
      { name: 'career', path: '/career' },
      { name: 'projects', path: '/projects' },
      { name: 'articles', path: '/articles' },
    ];
  }
}
