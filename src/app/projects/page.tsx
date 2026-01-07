import clsx from 'clsx';

import { Project } from '@/components/project';
import { Text } from '@/components/text';
import { useRepositories } from '@/hooks/use-repositories';

export const metadata = {
  title: 'Projects | André Silva',
};

export default function Projects() {
  const { projectsRepository } = useRepositories();
  const projects = projectsRepository.getAll();

  const featuredProjects = projects.filter((project) => project.featured);
  const allProjects = projects.filter((project) => !project.featured);

  const gridClasses = 'grid gap-4 grid-rows-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4';

  return (
    <>
      <Text variant="h2-mono" element="h1">
        Projects
      </Text>
      <Text variant="h3" element="h2" className="mt-8">
        Featured Projects
      </Text>
      <ul
        className={clsx(
          gridClasses,
          'mt-4',
        )}
      >
        { featuredProjects.map((project) => (
          <li key={project.title} className="h-full">
            <Project
              title={project.title}
              description={project.description}
              links={project.links}
              technologies={project.technologies}
              featured
            />
          </li>
        )) }
      </ul>
      <Text variant="h3" element="h2" className="mt-8">
        All Projects
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
              links={project.links}
              technologies={project.technologies}
            />
          </li>
        )) }
      </ul>
    </>
  );
}
