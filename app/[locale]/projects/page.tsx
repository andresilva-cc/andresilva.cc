import { NextIntlClientProvider, useTranslations, useMessages } from 'next-intl';
import { getTranslator } from 'next-intl/server';
import clsx from 'clsx';

import { Project } from '@/components/Project';
import { Text } from '@/components/Text';
import { useRepositories } from '@/hooks/useRepositories';
import { RouteParams } from '@/types/RouteParams';

export async function generateMetadata({ params }: RouteParams) {
  const t = await getTranslator(params.locale);

  return {
    title: `${t('projects.title')} | André Silva`,
  };
}

export default function Projects() {
  const messages = useMessages();
  const t = useTranslations();

  const { projectsRepository } = useRepositories(t);

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
            <NextIntlClientProvider messages={messages}>
              <Project
                title={project.title}
                description={project.description}
                links={project.links}
                featured={project.featured}
                technologies={project.technologies}
              />
            </NextIntlClientProvider>
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
            <NextIntlClientProvider messages={messages}>
              <Project
                title={project.title}
                description={project.description}
                links={project.links}
                featured={project.featured}
                technologies={project.technologies}
              />
            </NextIntlClientProvider>
          </li>
        )) }
      </ul>
    </>
  );
}
