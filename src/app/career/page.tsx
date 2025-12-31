import { Job } from '@/components/Job';
import { Text } from '@/components/Text';
import { useRepositories } from '@/hooks/useRepositories';

export const metadata = {
  title: 'Career | Andre Silva',
};

export default function Career() {
  const { jobsRepository } = useRepositories();
  const jobs = jobsRepository.getAll();

  return (
    <>
      <div className="md:grid md:grid-cols-job md:gap-8">
        <Text variant="h2-mono" element="h1" className="col-start-2">
          Career
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
              {job.description}
            </Job>
          </li>
        )) }
      </ul>
    </>
  );
}
