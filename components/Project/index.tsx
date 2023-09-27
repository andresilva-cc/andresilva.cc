import clsx from 'clsx';
import { ArrowUpRight } from '@phosphor-icons/react/dist/ssr';
import { Chip } from '@/components/Chip';
import { Text } from '@/components/Text';

export interface ProjectProps {
  title: string
  description: string
  url?: string
  featured?: boolean
  technologies: Array<string>
}

export function Project({
  title, description, url = undefined, featured = false, technologies,
}: ProjectProps) {
  const content = (
    <div
      className={clsx(
        'group p-4 rounded-lg bg-primary-300 bg-opacity-0 hover:bg-opacity-5 active:bg-opacity-10 select-none transition-colors hover:transition-none duration-300',
        { 'outline outline-1 outline-auxiliary-500 hover:outline-auxiliary-400 active:outline-auxiliary-300': featured },
      )}
    >
      <Text
        variant="h3"
        className="flex gap-1 items-center text-secondary-500 group-hover:text-secondary-400 group-active:text-secondary-300"
      >
        { title }
        { url && (
          <ArrowUpRight
            weight="bold"
            size={16}
            className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
          />
        ) }
      </Text>

      <Text variant="body-2" className="mt-2">{ description }</Text>

      <div className="flex flex-wrap gap-2 mt-4">
        { technologies.map((technology) => (
          <Chip key={technology}>{ technology }</Chip>
        ))}
      </div>
    </div>
  );

  if (url) {
    return (
      <a href={url} target="_blank">
        { content }
      </a>
    );
  }

  return content;
}
