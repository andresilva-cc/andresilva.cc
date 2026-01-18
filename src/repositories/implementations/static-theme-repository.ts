import type { ThemeRepository } from '../theme-repository';

export class StaticThemeRepository implements ThemeRepository {
  getAll() {
    return [
      { id: 'default', name: 'Default' },
      { id: 'dracula', name: 'Dracula' },
      { id: 'terminal', name: 'Terminal' },
    ];
  }

  getDefault() {
    return this.getAll()[0];
  }
}
