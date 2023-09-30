/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable max-len */
import { useTranslations } from 'next-intl';
import { Job, JobProps } from '@/components/Job';
import { Text } from '@/components/Text';

export default function Career() {
  const t = useTranslations('career');

  const jobs: Array<JobProps> = [
    {
      title: t('consultantAtlas.title'),
      company: 'Atlas Technologies',
      startDate: new Date(2022, 2),
      technologies: ['JavaScript', 'TypeScript', 'Vue.js', 'Laravel', 'Jest', 'Tailwind CSS'],
      children: t.rich('consultantAtlas.description'),
    },
    {
      title: t('frontAtlas.title'),
      company: 'Atlas Technologies',
      startDate: new Date(2021, 10),
      endDate: new Date(2022, 2),
      technologies: ['JavaScript', 'Vue.js', 'Laravel', 'Sass'],
      children: t.rich('frontAtlas.description'),
    },
    {
      title: t('ceoNuxstep.title'),
      company: 'Nuxstep',
      startDate: new Date(2018, 5),
      endDate: new Date(2021, 9),
      links: [
        { name: 'NativeScript Spotify', url: 'https://github.com/Nuxstep/nativescript-plugins/tree/master/packages/nativescript-spotify' },
      ],
      technologies: ['Node.js', 'Vue.js', 'Laravel', 'JavaScript', 'TypeScript', 'NativeScript'],
      children: t.rich('ceoNuxstep.description'),
    },
    {
      title: t('internGmaes.title'),
      company: 'Grupo Gmaes',
      startDate: new Date(2017, 2),
      endDate: new Date(2018, 11),
      links: [
        { name: 'CONFEA', url: 'https://www.confea.org.br/novo-portal-institucional-do-confea-traz-recursos-de-acessibilidade' },
      ],
      technologies: ['Node.js', 'Vue.js', 'Laravel', 'JavaScript', 'Sass', 'Drupal', 'Linux', 'Windows Server'],
      children: t.rich('internGmaes.description'),
    },
  ];

  return (
    <>
      <div className="md:grid md:grid-cols-job md:gap-8">
        <Text variant="h2-mono" element="h1" className="col-start-2">
          { t('title') }
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
