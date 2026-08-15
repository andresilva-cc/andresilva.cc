import type { ResumeRepository, ResumeRepositoryResponse } from '../resume-repository';

/*
 * Content transcribed verbatim from public/resume.pdf — the content
 * source of truth. Two deliberate changes only:
 *  - "Healthy Labs" → "MPA (formerly Healthy Labs)" (employer rename)
 *  - Role line → "Senior Software Engineer" (matches the site hero)
 * Everything else, including copy the engineer might otherwise tighten,
 * is left exactly as the source PDF reads.
 *
 * Editing this file does NOT regenerate public/resume.pdf by itself —
 * the PDF is a committed, manually-exported artifact (see
 * scripts/resume/generate.mjs). After changing anything here, run
 * `pnpm resume:pdf` and commit the updated PDF, or the shipped file
 * silently drifts out of sync with this data.
 */
export class StaticResumeRepository implements ResumeRepository {
  get(): ResumeRepositoryResponse {
    return {
      name: 'André Luiz da Silva',
      role: 'Senior Software Engineer',
      contact: {
        email: 'jobs@andresilva.cc',
        phone: '+55 47 99900-1415',
        site: { label: 'andresilva.cc', url: 'https://andresilva.cc/' },
        github: { label: 'github.com/andresilva-cc', url: 'https://github.com/andresilva-cc' },
      },
      summary: 'Software engineer with 9+ years of experience building web platforms, internal tools, and developer tooling. Works end-to-end — from architecture and infrastructure to product features and integrations. Primarily works with TypeScript, Vue.js, Nuxt, React, and Node.js. Takes ownership of solutions while collaborating effectively with teams, quickly adapting to new technologies and challenges. Holds a BS in Computer Science and a specialization certificate in Technical Leadership.',
      experience: [
        {
          title: 'Senior Engineer',
          employer: 'MPA (formerly Healthy Labs)',
          start: 'Apr 2025',
          bullets: [
            'Developed a multi-agent AI assistant for internal CMS operations and workflows',
            'Built a preview orchestration server using WebSockets and Docker for instant CMS previews',
            'Built core modules of an in-browser devtools panel',
            'Implemented lead compliance integrations (TrustedForm, Jornaya)',
          ],
        },
        {
          title: 'Senior Front-end Engineer',
          employer: 'Atlas Technologies',
          start: 'Jan 2024',
          end: 'Apr 2025',
          bullets: [
            'Worked on performance and DX improvements as part of the platform team',
            'Upgraded projects to Vue 3 and Nuxt 3',
            'Migrated pages to a Nuxt 3 project',
            'Achieved a 74% increase in the performance of a key page',
            'Improved logging in a Nuxt 3 project for better observability and DX',
          ],
        },
        {
          title: 'Front-end Engineering Consultant',
          employer: 'Atlas Technologies',
          start: 'Mar 2022',
          end: 'Jan 2024',
          bullets: [
            'Mentored and provided technical guidance to front-end engineers',
            'Analyzed and developed project improvements',
            'Contributed to the development of a component library using Lerna, TypeScript, and Vue.js',
            'Contributed to the migration of key pages to a Nuxt project',
          ],
        },
        {
          title: 'Front-end Engineer',
          employer: 'Atlas Technologies',
          start: 'Nov 2021',
          end: 'Mar 2022',
          bullets: [
            'Contributed to the development of a security feature for a platform with over 20M monthly visits',
            'Deployed and monitored front-end tasks in production',
            'Contributed with code reviews across multiple teams',
            'Tracked and organized tasks in Jira using Scrum',
          ],
        },
        {
          title: 'CEO & Co-Founder',
          employer: 'Nuxstep',
          start: 'Jun 2018',
          end: 'Oct 2021',
          bullets: [
            'Planned, developed, and deployed web and mobile applications',
            'Contributed to the execution of IT infrastructure projects',
            'Developed a NativeScript plugin integrating Spotify’s SDK using TypeScript',
          ],
        },
        {
          title: 'Software Development Intern',
          employer: 'Gmaes Telecom',
          start: 'Mar 2017',
          end: 'Dec 2018',
          bullets: [
            'Developed an inventory system for the City Hall of Francisco Beltrão using Vue.js and Laravel',
            'Developed the new website for the Federal Council of Engineering and Agronomy (CONFEA) using Drupal',
            'Developed an integration between Nuvemshop and SkyHub using Nuxt and Node.js',
            'Deployed and managed applications on Linux and Windows servers',
          ],
        },
      ],
      education: [
        {
          institution: 'Full Cycle',
          detail: 'Specialization Certificate in Technical Leadership',
          start: 'Apr 2024',
          end: 'Feb 2025',
        },
        {
          institution: 'UNIVALI - Universidade do Vale do Itajaí',
          detail: 'Bachelor Degree in Computer Science',
          start: '2015',
          end: '2019',
        },
      ],
      technologies: [
        'JavaScript', 'TypeScript', 'Vue.js', 'Vuex', 'Pinia', 'Nuxt', 'React', 'Next.js', 'TanStack',
        'AI SDK', 'Sass', 'Vuetify', 'Tailwind CSS', 'Storybook', 'Drupal',
        'PHP', 'Laravel', 'Node.js', 'Express', 'Jest', 'Vitest', 'Lerna', 'SQL', 'NativeScript',
        'Adobe XD', 'Figma', 'Shell Script', 'Linux', 'Windows Server',
      ],
    };
  }
}
