import { Text } from '@/components/text';
import { StatusDot } from '@/components/status-dot';
import { HeroPlasma } from '@/components/hero-plasma';
import { SectionHead } from '@/components/section-head';
import { LatestRow } from '@/components/latest-row';
import { getRepositories } from '@/repositories';
import { safeHref } from '@/lib/safe-href';

export const metadata = {
  title: 'André Silva',
};

export default async function Home() {
  const { jobsRepository, projectsRepository, articlesRepository } = getRepositories();

  const currentJob = jobsRepository.getAll()[0];
  const featuredProject = projectsRepository.getAll().find((p) => p.featured)
    ?? projectsRepository.getAll()[0];

  let latestArticleTitle = '';
  let latestArticleUrl = '/articles';
  try {
    const articles = await articlesRepository.getAll();
    if (articles.length > 0) {
      latestArticleTitle = articles[0].title;
      latestArticleUrl = safeHref(articles[0].url);
    }
  }
  catch {
    // Forem feed unavailable at build time — fall back to /articles index.
  }

  return (
    <>
      <section aria-labelledby="page-title" className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center py-12 md:py-20 border-b border-rule">
        <div className="min-w-0">
          <Text variant="display" id="page-title" className="text-fg leading-none">André Silva</Text>
          <p className="mt-3 flex flex-wrap items-baseline gap-2">
            <StatusDot ariaLabel="current role" />
            <Text variant="h3" as="span" className="text-accent">{ currentJob.title }</Text>
            <Text variant="h3" as="span" className="text-fg-subtle font-normal mx-1">@</Text>
            <Text variant="h3" as="span" className="text-fg">{ currentJob.company }</Text>
          </p>
          <Text variant="body" className="mt-5 text-fg-muted max-w-prose-narrow">
            Software engineer with
            {' '}
            <strong>9+ years of experience</strong>
            {' '}
            building web platforms, internal tools, and developer tooling.
          </Text>
        </div>
        <HeroPlasma className="hidden lg:block justify-self-end" />
      </section>

      <section aria-labelledby="latest-h" className="py-12 md:py-16">
        <SectionHead eyebrow="// 02 / what i’m doing now" title="Latest" id="latest-h" />
        <ul className="flex flex-col list-none p-0 m-0">
          <LatestRow
            category="Career"
            href="/career"
            title={currentJob.title}
            company={currentJob.company}
          />
          <LatestRow
            category="Project"
            href="/projects"
            title={featuredProject.title}
          />
          { latestArticleTitle && (
            <LatestRow
              category="Article"
              href={latestArticleUrl}
              title={latestArticleTitle}
            />
          ) }
        </ul>
      </section>
    </>
  );
}
