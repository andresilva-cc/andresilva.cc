import { Text } from '@/components/text';
import { StatusDot } from '@/components/status-dot';
import { HeroPlasma } from '@/components/hero-plasma';
import { SectionHead } from '@/components/section-head';
import { LatestRow } from '@/components/latest-row';
import { ArrowLink } from '@/components/arrow-link';
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
      {/* Hero — accent name, status, pitch, plasma */}
      <section
        aria-labelledby="page-title"
        className="flex flex-col gap-6 pt-16 pb-12 border-b border-rule lg:flex-row lg:items-center lg:gap-12"
      >
        <div className="min-w-0 flex-1">
          <Text variant="display" id="page-title" className="text-accent flex items-center gap-2">
            André Silva
            <span className="name-cursor" aria-hidden="true" />
          </Text>
          <p className="mt-3 flex flex-wrap items-center gap-2">
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
        <HeroPlasma className="hidden lg:block shrink-0 max-w-hero-plasma" />
      </section>

      {/* Bio — // 01 / who */}
      <section aria-labelledby="bio-h" className="py-8 border-b border-rule">
        <SectionHead
          eyebrow="// 01 / who"
          title="Bio"
          id="bio-h"
          cta={<ArrowLink href="/about">Full bio</ArrowLink>}
        />
        <Text variant="body" className="m-0 text-fg-muted max-w-prose-wide">
          Works
          {' '}
          <strong>end-to-end</strong>
          {' '}
          — from architecture and infrastructure to product features and integrations. Primarily
          {' '}
          <strong>TypeScript</strong>
          ,
          {' '}
          <strong>Vue.js</strong>
          ,
          {' '}
          <strong>Nuxt</strong>
          ,
          {' '}
          <strong>React</strong>
          ,
          {' '}
          <strong>Node.js</strong>
          . Takes ownership while collaborating effectively, adapting quickly to new tech and new problems.
        </Text>
      </section>

      {/* Latest — // 02 / what i'm doing now */}
      <section aria-labelledby="latest-h" className="py-8">
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
