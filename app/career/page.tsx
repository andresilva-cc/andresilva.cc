/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable max-len */
import { Job, JobProps } from '@/components/Job';
import { Text } from '@/components/Text';

const jobs: Array<JobProps> = [
  {
    title: 'Front-end Engineering Consultant',
    company: 'Atlas Technologies',
    startDate: new Date(2022, 2),
    technologies: ['JavaScript', 'TypeScript', 'Vue.js', 'Laravel', 'Jest', 'Tailwind CSS'],
    children:
  <ul>
    <li>Mentoring and technical guidance to front-end engineers</li>
    <li>Monitoring of squad initiatives</li>
    <li>Study and development of project improvements</li>
    <li>Creating and updating chapter documentation</li>
    <li>Code review</li>
  </ul>,
  },
  {
    title: 'Front-end Engineer',
    company: 'Atlas Technologies',
    startDate: new Date(2021, 10),
    endDate: new Date(2022, 2),
    technologies: ['JavaScript', 'Vue.js', 'Laravel', 'Sass'],
    children:
  <>
    <p>Assignments in a squad:</p>
    <ul>
      <li>Front-end development for a platform with more than 20 million monthly visits</li>
      <li>Front-end responsible for the deployment process</li>
      <li>Code review</li>
      <li>Tracking and organization of tasks in Jira using Scrum</li>
    </ul>
  </>,
  },
  {
    title: 'CEO & Co-Founder',
    company: 'Nuxstep',
    startDate: new Date(2018, 5),
    endDate: new Date(2021, 9),
    links: [
      { name: 'NativeScript Spotify', url: 'https://github.com/Nuxstep/nativescript-plugins/tree/master/packages/nativescript-spotify' },
    ],
    technologies: ['Node.js', 'Vue.js', 'Laravel', 'JavaScript', 'TypeScript', 'NativeScript'],
    children:
  <ul>
    <li>Planning, development and deployment of web and mobile applications</li>
    <li>Participation in the execution of IT infrastructure projects</li>
    <li>Development of a plugin that integrates Spotify&apos;s SDK into NativeScript using TypeScript</li>
  </ul>,
  },
  {
    title: 'Software Development Intern',
    company: 'Grupo Gmaes',
    startDate: new Date(2017, 2),
    endDate: new Date(2018, 11),
    links: [
      { name: 'CONFEA', url: 'https://www.confea.org.br/novo-portal-institucional-do-confea-traz-recursos-de-acessibilidade' },
    ],
    technologies: ['Node.js', 'Vue.js', 'Laravel', 'JavaScript', 'Sass', 'Drupal', 'Linux', 'Windows Server'],
    children:
  <ul>
    <li>Participation in the development of a web inventory system for the City Hall of Francisco Beltrão using Vue.js and Laravel</li>
    <li>Planning and development of the new website of the Federal Council of Engineering and Agronomy (CONFEA) using Drupal</li>
    <li>Development of an integration between the Nuvemshop e-commerce platform and SkyHub marketplace integrator using Nuxt and Node.js</li>
    <li>Deploy of applications on Linux and Windows servers</li>
  </ul>,
  },
];

export default function Career() {
  return (
    <>
      <div className="md:grid md:grid-cols-job md:gap-8">
        <Text variant="h2-mono" element="h1" className="col-start-2">
          Career
        </Text>
      </div>
      <ul className="flex flex-col gap-8 mt-8">
        { jobs.map((job, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <li key={index}>
            <Job
              title={job.title}
              company={job.company}
              startDate={job.startDate}
              endDate={job.endDate}
              links={job.links}
              technologies={job.technologies}
            >
              { job.children }
            </Job>
          </li>
        )) }
      </ul>
    </>
  );
}
