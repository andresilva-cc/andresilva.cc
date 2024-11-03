import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';

import { Job } from '@/components/Job';
import { RichText } from '@/components/RichText';
import { Text } from '@/components/Text';
import { useRepositories } from '@/repositories';

export async function generateMetadata() {
  const t = await getTranslations();

  return {
    title: `${t('career.title')} | André Silva`,
  };
}

export default function Career() {
  const t = useTranslations();
  const { jobsRepository } = useRepositories();

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
            { /* TODO: fix dynamic key type */ }
            <Job
              title={t(job.title as any)}
              company={job.company}
              startDate={job.startDate}
              endDate={job.endDate}
              links={job.links}
              technologies={job.technologies}
            >
              <RichText>
                { (tags) => t.rich(job.description as any, tags) }
              </RichText>
            </Job>
          </li>
        )) }
      </ul>
    </>
  );
}
