import type { TranslateFunction } from '@/types/i18n';

export const JobsRepository = (t: TranslateFunction) => ({
  getAll() {
    return [
      {
        title: t('career.seniorAtlas.title'),
        company: 'Atlas Technologies',
        startDate: new Date(2024, 0),
        technologies: ['JavaScript', 'TypeScript', 'Vue.js', 'Pinia', 'Nuxt', 'Laravel', 'Vitest', 'Tailwind CSS', 'Storybook', 'SEO'],
        children: t.rich('career.seniorAtlas.description'),
      },
      {
        title: t('career.consultantAtlas.title'),
        company: 'Atlas Technologies',
        startDate: new Date(2022, 2),
        endDate: new Date(2024, 0),
        technologies: ['JavaScript', 'TypeScript', 'Vue.js', 'Vuex', 'Nuxt', 'Laravel', 'Jest', 'Tailwind CSS', 'Lerna', 'Storybook', 'SEO'],
        children: t.rich('career.consultantAtlas.description'),
      },
      {
        title: t('career.frontAtlas.title'),
        company: 'Atlas Technologies',
        startDate: new Date(2021, 10),
        endDate: new Date(2022, 2),
        technologies: ['JavaScript', 'Vue.js', 'Vuex', 'Laravel', 'Sass'],
        children: t.rich('career.frontAtlas.description'),
      },
      {
        title: t('career.ceoNuxstep.title'),
        company: 'Nuxstep',
        startDate: new Date(2018, 5),
        endDate: new Date(2021, 9),
        links: [
          { name: 'NativeScript Spotify', url: 'https://github.com/Nuxstep/nativescript-plugins/tree/master/packages/nativescript-spotify' },
        ],
        technologies: ['JavaScript', 'TypeScript', 'Vue.js', 'Vuex', 'Vuetify', 'NativeScript', 'Jest', 'Node.js', 'Laravel'],
        children: t.rich('career.ceoNuxstep.description'),
      },
      {
        title: t('career.internGmaes.title'),
        company: 'Grupo Gmaes',
        startDate: new Date(2017, 2),
        endDate: new Date(2018, 11),
        links: [
          { name: 'CONFEA', url: 'https://www.confea.org.br/novo-portal-institucional-do-confea-traz-recursos-de-acessibilidade' },
        ],
        technologies: ['JavaScript', 'Vue.js', 'Vuex', 'Sass', 'Vuetify', 'Node.js', 'Laravel', 'Drupal', 'Linux', 'Windows Server'],
        children: t.rich('career.internGmaes.description'),
      },
    ];
  },
});
