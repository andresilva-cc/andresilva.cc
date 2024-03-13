import type { TranslateFunction } from '@/types/i18n';

export const MenuRepository = (t: TranslateFunction) => ({
  getAll() {
    return [
      { name: t('menu.about'), path: '/about' },
      { name: t('menu.articles'), path: '/articles' },
      { name: t('menu.career'), path: '/career' },
      { name: t('menu.projects'), path: '/projects' },
    ];
  },
});
