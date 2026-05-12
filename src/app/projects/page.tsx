import { PageHead } from '@/components/page-head';
import { SectionHead } from '@/components/section-head';
import { GridFrame } from '@/components/grid-frame';
import { ProjectCard } from '@/components/project-card';
import { getRepositories } from '@/repositories';

export const metadata = {
  title: 'André Silva · Projects',
};

export default function Projects() {
  const { projectsRepository } = getRepositories();
  const projects = projectsRepository.getAll();

  return (
    <>
      <PageHead name="PROJECTS" />

      <section aria-labelledby="projects-h" className="py-12 md:py-16">
        <SectionHead eyebrow="// 01 / built and shipped" title="Projects" id="projects-h" flush />
        <GridFrame className="grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
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
