import type { JobsRepository } from '../JobsRepository';

export class StaticJobsRepository implements JobsRepository {
  getAll() {
    return [
      {
        title: 'career.seniorHealthyLabs.title',
        company: 'Healthy Labs',
        startDate: new Date(2025, 3),
        description: 'career.seniorHealthyLabs.description',
        technologies: [],
      },
      {
        title: 'career.seniorAtlas.title',
        company: 'Atlas Technologies',
        startDate: new Date(2024, 0),
        endDate: new Date(2025, 3),
        description: 'career.seniorAtlas.description',
        technologies: ['JavaScript', 'TypeScript', 'Vue.js', 'Pinia', 'Nuxt', 'Laravel', 'Vitest', 'Tailwind CSS', 'Storybook', 'SEO'],
      },
      {
        title: 'career.consultantAtlas.title',
        company: 'Atlas Technologies',
        startDate: new Date(2022, 2),
        endDate: new Date(2024, 0),
        description: 'career.consultantAtlas.description',
        technologies: ['JavaScript', 'TypeScript', 'Vue.js', 'Vuex', 'Nuxt', 'Laravel', 'Jest', 'Tailwind CSS', 'Lerna', 'Storybook', 'SEO'],
      },
      {
        title: 'career.frontAtlas.title',
        company: 'Atlas Technologies',
        startDate: new Date(2021, 10),
        endDate: new Date(2022, 2),
        description: 'career.frontAtlas.description',
        technologies: ['JavaScript', 'Vue.js', 'Vuex', 'Laravel', 'Sass'],
      },
      {
        title: 'career.ceoNuxstep.title',
        company: 'Nuxstep',
        startDate: new Date(2018, 5),
        endDate: new Date(2021, 9),
        links: [
          { name: 'NativeScript Spotify', url: 'https://github.com/Nuxstep/nativescript-plugins/tree/master/packages/nativescript-spotify' },
        ],
        description: 'career.ceoNuxstep.description',
        technologies: ['JavaScript', 'TypeScript', 'Vue.js', 'Vuex', 'Vuetify', 'NativeScript', 'Jest', 'Node.js', 'Laravel'],
      },
      {
        title: 'career.internGmaes.title',
        company: 'Grupo Gmaes',
        startDate: new Date(2017, 2),
        endDate: new Date(2018, 11),
        links: [
          { name: 'CONFEA', url: 'https://www.confea.org.br/novo-portal-institucional-do-confea-traz-recursos-de-acessibilidade' },
        ],
        description: 'career.internGmaes.description',
        technologies: ['JavaScript', 'Vue.js', 'Vuex', 'Sass', 'Vuetify', 'Node.js', 'Laravel', 'Drupal', 'Linux', 'Windows Server'],
      },
    ];
  }
}
