import { useTranslations } from 'next-intl';
import clsx from 'clsx';
import { Project } from '@/components/Project';
import { Text } from '@/components/Text';
import { useRepositories } from '@/repositories';

export default function Projects() {
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
            <Project
              title={project.title}
              description={project.description}
              url={project.url}
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
            <Project
              title={project.title}
              description={project.description}
              url={project.url}
              featured={project.featured}
              technologies={project.technologies}
            />
          </li>
        )) }
      </ul>
    </>
  );
}
