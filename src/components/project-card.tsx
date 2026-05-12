import clsx from 'clsx';

import { Text } from '@/components/text';
import { Tag } from '@/components/tag';
import { Badge } from '@/components/badge';
import { ArrowLink } from '@/components/arrow-link';

export interface ProjectLink {
  /** Label rendered inside the link (e.g. "site", "github"). Lowercase. */
  label: string;
  href: string;
}

export interface ProjectCardProps {
  title: string;
  description: string;
  technologies: Array<string>;
  links?: Array<ProjectLink>;
  /** Adds the FEATURED corner badge and clears space in the title row. */
  featured?: boolean;
  className?: string;
}

/*
 * ProjectCard — a single project entry inside a GridFrame.
 *
 * Renders as a flex column with the title up top, the description body
 * filling the middle, and the tech chips + external links anchored to
 * the bottom via `mt-auto` on the chips wrapper. Featured projects
 * additionally show a corner Badge that overlays the top-right.
 */
export function ProjectCard({
  title, description, technologies, links = [], featured = false, className,
}: ProjectCardProps) {
  return (
    <li className={clsx('flex flex-col gap-2 relative', className)}>
      <Text variant="h3" as="p" className={clsx('m-0 text-fg', featured && 'pr-22')}>
        { title }
      </Text>
      { featured && (
        <Badge className="absolute top-4 right-4">Featured</Badge>
      ) }
      <Text variant="meta" className="text-fg-muted max-w-prose-card m-0">
        { description }
      </Text>
      <div className="flex flex-wrap gap-1 mt-auto">
        { technologies.map((tech) => (
          <Tag key={tech}>{ tech }</Tag>
        )) }
      </div>
      { links.length > 0 && (
        <div className="flex flex-wrap gap-4">
          { links.map((link) => (
            <ArrowLink key={link.href} href={link.href}>{ link.label }</ArrowLink>
          )) }
        </div>
      ) }
    </li>
  );
}
