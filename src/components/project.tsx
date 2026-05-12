import clsx from 'clsx';
import { ArrowUpRightIcon } from '@phosphor-icons/react/dist/ssr/index';
import { Chip } from '@/components/chip';
import { Text } from '@/components/text';
import type { Project as ProjectType } from '@/types/project';

export interface ProjectProps extends ProjectType {}

/* Legacy Project — kept building so projects/page.tsx still renders.
   T54 replaces this with ProjectCard inside the rewritten page. */
export function Project({
  title, description, links = [], featured = false, technologies,
}: ProjectProps) {
  const focusClasses = clsx('focus:rounded-lg focus:outline-hidden focus:outline-auxiliary-500', {
    'focus:outline-offset-4': featured,
  });

  const content = (
    <div
      className={clsx(
        'group text-left p-4 rounded-lg bg-primary-300/0 hover:bg-primary-300/5 active:bg-primary-300/10 select-none transition-colors hover:transition-none duration-300',
        { 'h-full flex flex-col outline-1 outline-auxiliary-500 hover:outline-auxiliary-400 active:outline-auxiliary-300': featured },
        { 'cursor-pointer': links.length > 0 },
      )}
    >
      <Text
        variant="h3"
        className="inline-block text-secondary-500 group-hover:text-secondary-400 group-active:text-secondary-300"
      >
        { title }
        { links.length > 0 && (
          <ArrowUpRightIcon
            weight="bold"
            size={16}
            className="inline-block ml-1 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
          />
        ) }
      </Text>

      <Text
        variant="meta"
        className={clsx('mt-2', { 'flex-1': featured })}
      >
        { description }
      </Text>

      <div className="flex flex-wrap gap-2 mt-4">
        { technologies.map((technology) => (
          <Chip key={technology}>{ technology }</Chip>
        ))}
      </div>
    </div>
  );

  if (links.length >= 1) {
    return (
      <a
        href={links[0].url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={title}
        className={clsx('block w-full', { 'h-full': featured }, focusClasses)}
      >
        { content }
      </a>
    );
  }

  return content;
}
