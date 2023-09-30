import { useTranslations } from 'next-intl';
import { Job } from '@/components/Job';
import { Text } from '@/components/Text';
import { useRepositories } from '@/repositories';

export default function Career() {
  const t = useTranslations();
  const { jobsRepository } = useRepositories(t);

  const jobs = jobsRepository.getAll();

  return (
    <>
      <div className="md:grid md:grid-cols-job md:gap-8">
        <Text variant="h2-mono" element="h1" className="col-start-2">
          { t('career.title') }
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
