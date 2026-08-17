/*
 * Employment history — the single source of truth shared by `/career`
 * (StaticJobsRepository) and `/resume` (StaticResumeRepository). Both
 * routes describe the same work history and previously drifted (see
 * docs/resume-print-theme.md and the issue #18 follow-up): a factual
 * conflict on the Gmaes employer name, resume bullets silently
 * truncated from career's wording, and a "Contributed with code
 * reviews" grammar regression on the resume. Keeping one dataset makes
 * that class of drift structurally impossible.
 *
 * Each bullet carries its full wording (`text`, rendered verbatim on
 * `/career`) plus an optional condensed wording (`short`, rendered on
 * `/resume` as `short ?? text`) for the space-constrained print layout.
 * Employer name is "Grupo Gmaes" — the resume previously said "Gmaes
 * Telecom", which does not appear anywhere else in the codebase;
 * "Grupo Gmaes" is documented across docs/ui-spec.md, docs/copy-guide.md,
 * and docs/redesign-log.md, so it is the corrected value here.
 */

export interface EmploymentBullet {
  /** Full-length wording — rendered verbatim on /career. */
  text: string;
  /** Condensed wording for the print layout — /resume renders `short ?? text`. */
  short?: string;
}

export interface EmploymentLink {
  name: string;
  url: string;
}

export interface EmploymentRole {
  title: string;
  company: string;
  /** Prior name of the employer (e.g. "Healthy Labs" for MPA). */
  formerly?: string;
  startDate: Date;
  /** Undefined for the current role. */
  endDate?: Date;
  bullets: Array<EmploymentBullet>;
  technologies: Array<string>;
  /** External references for the role (e.g. a notable project shipped during tenure). */
  links?: Array<EmploymentLink>;
}

export const EMPLOYMENT_HISTORY: Array<EmploymentRole> = [
  {
    title: 'Senior Engineer',
    company: 'MPA',
    formerly: 'Healthy Labs',
    startDate: new Date(Date.UTC(2025, 3)),
    bullets: [
      { text: 'Developed a multi-agent AI assistant for internal CMS operations and workflows' },
      {
        text: 'Built a preview orchestration server using WebSockets and Docker for instant CMS previews without deployment',
        short: 'Built a preview orchestration server using WebSockets and Docker for instant CMS previews',
      },
      {
        text: 'Built core modules of an in-browser devtools panel for debugging page state, form values, and block rendering',
        short: 'Built core modules of an in-browser devtools panel',
      },
      {
        text: 'Implemented lead compliance integrations (TrustedForm, Jornaya) across CMS and consumer-facing platforms',
        short: 'Implemented lead compliance integrations (TrustedForm, Jornaya)',
      },
    ],
    technologies: ['TypeScript', 'Vue.js', 'Nuxt', 'React', 'TanStack', 'Tailwind CSS', 'Docker', 'WebSockets', 'AI SDK'],
  },
  {
    title: 'Senior Front-end Engineer',
    company: 'Atlas Technologies',
    startDate: new Date(Date.UTC(2024, 0)),
    endDate: new Date(Date.UTC(2025, 3)),
    bullets: [
      {
        text: 'Worked on performance and developer experience (DX) improvements as part of the platform team',
        short: 'Worked on performance and DX improvements as part of the platform team',
      },
      { text: 'Upgraded projects to Vue 3 and Nuxt 3' },
      { text: 'Migrated pages to a Nuxt 3 project' },
      { text: 'Achieved a 74% increase in the performance of a key page' },
      { text: 'Improved logging in a Nuxt 3 project for better observability and DX' },
    ],
    technologies: [
      'JavaScript', 'TypeScript', 'Vue.js', 'Pinia', 'Nuxt',
      'Laravel', 'Vitest', 'Tailwind CSS', 'Storybook', 'SEO',
    ],
  },
  {
    title: 'Front-end Engineering Consultant',
    company: 'Atlas Technologies',
    startDate: new Date(Date.UTC(2022, 2)),
    endDate: new Date(Date.UTC(2024, 0)),
    bullets: [
      { text: 'Mentored and provided technical guidance to front-end engineers' },
      { text: 'Analyzed and developed project improvements' },
      { text: 'Contributed to the development of a component library using Lerna, TypeScript, and Vue.js' },
      { text: 'Contributed to the migration of key pages to a Nuxt project' },
    ],
    technologies: [
      'JavaScript', 'TypeScript', 'Vue.js', 'Vuex', 'Nuxt',
      'Laravel', 'Jest', 'Tailwind CSS', 'Lerna', 'Storybook', 'SEO',
    ],
  },
  {
    title: 'Front-end Engineer',
    company: 'Atlas Technologies',
    startDate: new Date(Date.UTC(2021, 10)),
    endDate: new Date(Date.UTC(2022, 2)),
    bullets: [
      {
        text: 'Contributed to the development of a security feature for a platform with over 20 million monthly visits',
        short: 'Contributed to the development of a security feature for a platform with over 20M monthly visits',
      },
      { text: 'Deployed and monitored front-end tasks in production' },
      { text: 'Contributed to code reviews across multiple teams' },
      { text: 'Tracked and organized tasks in Jira using Scrum' },
    ],
    technologies: ['JavaScript', 'Vue.js', 'Vuex', 'Laravel', 'Sass'],
  },
  {
    title: 'CEO & Co-Founder',
    company: 'Nuxstep',
    startDate: new Date(Date.UTC(2018, 5)),
    endDate: new Date(Date.UTC(2021, 9)),
    links: [
      {
        name: 'NativeScript Spotify',
        url: 'https://github.com/Nuxstep/nativescript-plugins/tree/master/packages/nativescript-spotify',
      },
    ],
    bullets: [
      { text: 'Planned, developed, and deployed web and mobile applications' },
      { text: 'Contributed to the execution of IT infrastructure projects' },
      { text: 'Developed a NativeScript plugin integrating Spotify’s SDK using TypeScript' },
    ],
    technologies: [
      'JavaScript', 'TypeScript', 'Vue.js', 'Vuex', 'Vuetify',
      'NativeScript', 'Jest', 'Node.js', 'Laravel',
    ],
  },
  {
    title: 'Software Development Intern',
    company: 'Grupo Gmaes',
    startDate: new Date(Date.UTC(2017, 2)),
    endDate: new Date(Date.UTC(2018, 11)),
    links: [
      {
        name: 'CONFEA',
        url: 'https://www.confea.org.br/novo-portal-institucional-do-confea-traz-recursos-de-acessibilidade',
      },
    ],
    bullets: [
      { text: 'Developed an inventory system for the City Hall of Francisco Beltrão using Vue.js and Laravel' },
      {
        text: 'Planned and developed the new website for the Federal Council of Engineering and Agronomy (CONFEA) using Drupal',
        short: 'Developed the new website for the Federal Council of Engineering and Agronomy (CONFEA) using Drupal',
      },
      {
        text: 'Developed an integration between the Nuvemshop e-commerce platform and the SkyHub marketplace integrator using Nuxt and Node.js',
        short: 'Developed an integration between Nuvemshop and SkyHub using Nuxt and Node.js',
      },
      { text: 'Deployed and managed applications on Linux and Windows servers' },
    ],
    technologies: [
      'JavaScript', 'Vue.js', 'Vuex', 'Sass', 'Vuetify',
      'Node.js', 'Laravel', 'Drupal', 'Linux', 'Windows Server',
    ],
  },
];
