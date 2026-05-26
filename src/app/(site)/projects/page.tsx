import { PageHead } from '@/components/page-head';
import { GridFrame } from '@/components/grid-frame';
import { ProjectCard } from '@/components/project-card';
import { getRepositories } from '@/repositories';

export const metadata = {
  title: 'Projects · André Silva',
};

export default function Projects() {
  const { projectsRepository } = getRepositories();
  const projects = [...projectsRepository.getAll()].sort(
    (a, b) => Number(b.featured ?? false) - Number(a.featured ?? false),
  );

  return (
    <>
      <PageHead name="PROJECTS" />

      <section aria-label="Projects" className="py-8">
        <GridFrame className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          { projects.map((project) => (
            <ProjectCard
              key={project.title}
              title={project.title}
              description={project.description}
              technologies={project.technologies}
              links={(project.links ?? []).map((link) => ({
                label: link.name ?? 'open',
                href: link.url,
              }))}
              featured={project.featured ?? false}
            />
          )) }
        </GridFrame>
      </section>
    </>
  );
}
