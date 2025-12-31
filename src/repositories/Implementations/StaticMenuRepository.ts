import type { MenuRepository } from '../MenuRepository';

export class StaticMenuRepository implements MenuRepository {
  getAll() {
    return [
      { name: 'Home', path: '/', hideOnDesktop: true },
      { name: 'About', path: '/about' },
      { name: 'Articles', path: '/articles', activeRegex: '^/article' },
      { name: 'Career', path: '/career' },
      { name: 'Projects', path: '/projects' },
    ];
  }
}
