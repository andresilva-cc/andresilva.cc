import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import clsx from 'clsx';

import { Project } from '@/components/Project';
import { Text } from '@/components/Text';
import { useRepositories } from '@/repositories';

export async function generateMetadata() {
  const t = await getTranslations();

  return {
    title: `${t('projects.title')} | André Silva`,
  };
}

export default function Projects() {
  const t = useTranslations();

  const { projectsRepository } = useRepositories();

  const projects = projectsRepository.getAll();

  const featuredProjects = projects.filter((project) => project.featured);
  const allProjects = projects.filter((project) => !project.featured);

  const gridClasses = 'grid gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4';

  return (
    <>
      <Text variant="h2-mono" element="h1">
        { t('projects.title') }
      </Text>
      <Text variant="h3" element="h2" className="mt-8">
        { t('projects.featuredProjects') }
      </Text>
      <ul
        className={clsx(
          gridClasses,
          'mt-4',
        )}
      >
        { featuredProjects.map((project) => (
          <li key={project.title}>
            { /* TODO: fix dynamic key type */ }
            <Project
              title={t(project.title as any)}
              description={t(project.description as any)}
              links={project.links}
              featured={project.featured}
              technologies={project.technologies}
            />
          </li>
        )) }
      </ul>
      <Text variant="h3" element="h2" className="mt-8">
        { t('projects.allProjects') }
      </Text>
      <ul
        className={clsx(
          gridClasses,
          'mt-4',
        )}
      >
        { allProjects.map((project) => (
          <li key={project.title}>
            { /* TODO: fix dynamic key type */ }
            <Project
              title={t(project.title as any)}
              description={t(project.description as any)}
              links={project.links}
              featured={project.featured}
              technologies={project.technologies}
            />
          </li>
        )) }
      </ul>
    </>
  );
}
