import { useTranslations } from 'next-intl';
import { getTranslator } from 'next-intl/server';
import { Job } from '@/components/Job';
import { Text } from '@/components/Text';
import { useRepositories } from '@/repositories';
import { RouteParams } from '@/types/RouteParams';

export async function generateMetadata({ params }: RouteParams) {
  const t = await getTranslator({ locale: params.locale });

  return {
    title: `${t('career.title')} | André Silva`,
  };
}

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
        { jobs.map((job) => (
          <li key={job.startDate.getTime()}>
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
