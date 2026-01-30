import type { JobsRepository } from '../jobs-repository';

export class StaticJobsRepository implements JobsRepository {
  getAll() {
    return [
      {
        title: 'Senior Engineer',
        company: 'Healthy Labs',
        startDate: new Date(2025, 3),
        description: (
          <ul>
            <li>Developed a multi-agent AI assistant for internal CMS operations and workflows</li>
            <li>Built a preview orchestration server using WebSockets and Docker for instant CMS previews without deployment</li>
            <li>Built core modules of an in-browser devtools panel for debugging page state, form values, and block rendering</li>
            <li>Implemented lead compliance integrations (TrustedForm, Jornaya) across CMS and consumer-facing platforms</li>
          </ul>
        ),
        technologies: ['TypeScript', 'Vue.js', 'Nuxt', 'React', 'TanStack', 'Tailwind CSS', 'AI SDK'],
      },
      {
        title: 'Senior Front-end Engineer',
        company: 'Atlas Technologies',
        startDate: new Date(2024, 0),
        endDate: new Date(2025, 3),
        description: (
          <ul>
            <li>
              Worked on performance and developer experience (DX) improvements
              as part of the platform team
            </li>
            <li>Upgraded projects to Vue 3 and Nuxt 3</li>
            <li>Migrated pages to a Nuxt 3 project</li>
            <li>Achieved a 74% increase in the performance of a key page</li>
            <li>
              Improved logging in a Nuxt 3 project for better observability and DX
            </li>
          </ul>
        ),
        technologies: [
          'JavaScript', 'TypeScript', 'Vue.js', 'Pinia', 'Nuxt',
          'Laravel', 'Vitest', 'Tailwind CSS', 'Storybook', 'SEO',
        ],
      },
      {
        title: 'Front-end Engineering Consultant',
        company: 'Atlas Technologies',
        startDate: new Date(2022, 2),
        endDate: new Date(2024, 0),
        description: (
          <ul>
            <li>Mentored and provided technical guidance to front-end engineers</li>
            <li>Analyzed and developed project improvements</li>
            <li>
              Contributed to the development of a component library
              using Lerna, TypeScript, and Vue.js
            </li>
            <li>Contributed to the migration of key pages to a Nuxt project</li>
          </ul>
        ),
        technologies: [
          'JavaScript', 'TypeScript', 'Vue.js', 'Vuex', 'Nuxt',
          'Laravel', 'Jest', 'Tailwind CSS', 'Lerna', 'Storybook', 'SEO',
        ],
      },
      {
        title: 'Front-end Engineer',
        company: 'Atlas Technologies',
        startDate: new Date(2021, 10),
        endDate: new Date(2022, 2),
        description: (
          <ul>
            <li>
              Contributed to the development of a security feature
              for a platform with over 20 million monthly visits
            </li>
            <li>Deployed and monitored front-end tasks in production</li>
            <li>Contributed to code reviews across multiple teams</li>
            <li>Tracked and organized tasks in Jira using Scrum</li>
          </ul>
        ),
        technologies: ['JavaScript', 'Vue.js', 'Vuex', 'Laravel', 'Sass'],
      },
      {
        title: 'CEO & Co-Founder',
        company: 'Nuxstep',
        startDate: new Date(2018, 5),
        endDate: new Date(2021, 9),
        links: [
          {
            name: 'NativeScript Spotify',
            url: 'https://github.com/Nuxstep/nativescript-plugins/tree/master/packages/nativescript-spotify',
          },
        ],
        description: (
          <ul>
            <li>Planned, developed, and deployed web and mobile applications</li>
            <li>Contributed to the execution of IT infrastructure projects</li>
            <li>
              Developed a NativeScript plugin integrating Spotify&apos;s SDK using TypeScript
            </li>
          </ul>
        ),
        technologies: [
          'JavaScript', 'TypeScript', 'Vue.js', 'Vuex', 'Vuetify',
          'NativeScript', 'Jest', 'Node.js', 'Laravel',
        ],
      },
      {
        title: 'Software Development Intern',
        company: 'Grupo Gmaes',
        startDate: new Date(2017, 2),
        endDate: new Date(2018, 11),
        links: [
          {
            name: 'CONFEA',
            url: 'https://www.confea.org.br/novo-portal-institucional-do-confea-traz-recursos-de-acessibilidade',
          },
        ],
        description: (
          <ul>
            <li>
              Developed an inventory system for the City Hall of Francisco Beltrão
              using Vue.js and Laravel
            </li>
            <li>
              Planned and developed the new website for the Federal Council
              of Engineering and Agronomy (CONFEA) using Drupal
            </li>
            <li>
              Developed an integration between the Nuvemshop e-commerce platform
              and the SkyHub marketplace integrator using Nuxt and Node.js
            </li>
            <li>
              Deployed and managed applications on Linux and Windows servers
            </li>
          </ul>
        ),
        technologies: [
          'JavaScript', 'Vue.js', 'Vuex', 'Sass', 'Vuetify',
          'Node.js', 'Laravel', 'Drupal', 'Linux', 'Windows Server',
        ],
      },
    ];
  }
}
