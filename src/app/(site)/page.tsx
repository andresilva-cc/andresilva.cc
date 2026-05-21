import { Text } from '@/components/text';
import { HeroArt } from '@/components/hero-art';
import { SectionHead } from '@/components/section-head';
import { LatestRow } from '@/components/latest-row';
import { InlineLink } from '@/components/inline-link';
import { getRepositories } from '@/repositories';

export const metadata = {
  title: 'André Silva',
};

export default function Home() {
  const { jobsRepository, projectsRepository, articlesRepository } = getRepositories();

  const currentJob = jobsRepository.getAll()[0];
  const projects = projectsRepository.getAll();
  const featuredProject = projects.find((p) => p.featured);

  // T3 stub: only the latest article title is surfaced here. T3 will rewrite
  // this to wire the latest-article card from LocalArticlesRepository properly.
  const articles = articlesRepository.getAll();
  const latestArticle = articles[0];
  const latestArticleTitle = latestArticle?.title ?? '';
  const latestArticleSlug = latestArticle?.slug ?? '';

  return (
    <>
      <section
        aria-labelledby="page-title"
        className="flex flex-col gap-6 pt-8 pb-6 border-b border-rule lg:flex-row lg:items-center lg:gap-12 lg:pt-16 lg:pb-12"
      >
        <div className="min-w-0 flex-1">
          <Text variant="display" id="page-title" className="text-accent flex items-center gap-2 tracking-display">
            André Silva
            <span className="name-cursor" aria-hidden="true" />
          </Text>
          <p className="mt-3">
            <Text variant="h3" as="span" className="text-fg">Senior Software Engineer</Text>
          </p>
          <Text variant="body" className="mt-5 text-fg-muted max-w-prose-narrow">
            Software engineer with
            {' '}
            <strong>9+ years of experience</strong>
            {' '}
            building web platforms, internal tools, and developer tooling.
          </Text>
        </div>
        <HeroArt />
      </section>

      <section aria-labelledby="now-h" className="py-8 border-b border-rule">
        <SectionHead
          eyebrow="// 01 / current focus"
          title="Now"
          id="now-h"
        />
        <Text variant="body" className="m-0 text-fg-muted max-w-prose-wide">
          These days, three builds in parallel:
          {' '}
          <InlineLink href="https://calcloak.com/"><strong>Calcloak</strong></InlineLink>
          , a side project overdue for a finish line;
          {' '}
          <InlineLink href="https://meet.agentairforce.com"><strong>Infinity</strong></InlineLink>
          , a collaboration; and the redesign of this site. Day job is at
          {' '}
          <strong>MPA</strong>
          {' '}
          — shipping features end-to-end with Claude Code, which has rearranged how the work gets done more than any framework has.
        </Text>
      </section>

      <section aria-labelledby="latest-h" className="py-8">
        <SectionHead eyebrow="// 02 / recent activity" title="Latest" id="latest-h" />
        <ul className="flex flex-col list-none p-0 m-0 [&>li:first-child>a]:border-t-0">
          { currentJob && (
            <LatestRow
              category="Career"
              href="/career"
              title={currentJob.title}
              company={currentJob.company}
            />
          ) }
          { featuredProject && (
            <LatestRow
              category="Project"
              href="/projects"
              title={featuredProject.title}
            />
          ) }
          { latestArticleTitle && (
            <LatestRow
              category="Article"
              href={`/articles/${latestArticleSlug}`}
              title={latestArticleTitle}
            />
          ) }
        </ul>
      </section>
    </>
  );
}
