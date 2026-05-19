import { PageHead } from '@/components/page-head';
import { RoleCard } from '@/components/role-card';
import { getRepositories } from '@/repositories';
import { formatDateRange } from '@/lib/format-date';

export const metadata = {
  title: 'André Silva · Career',
};

export default function Career() {
  const { jobsRepository } = getRepositories();
  const jobs = jobsRepository.getAll();

  return (
    <>
      <PageHead name="CAREER" />

      <section aria-label="Career" className="py-8">
        <ul className="flex flex-col list-none p-0 m-0 border border-rule">
          { jobs.map((job) => (
            <RoleCard
              key={job.startDate.getTime()}
              dates={formatDateRange(job.startDate, job.endDate)}
              isCurrent={!job.endDate}
              title={job.title}
              company={job.company}
              formerly={job.formerly}
              description={job.description}
              technologies={job.technologies}
              links={job.links}
            />
          )) }
        </ul>
      </section>
    </>
  );
}
