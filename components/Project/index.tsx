'use client';

import { useState } from 'react';
import clsx from 'clsx';
import { ArrowUpRight } from '@phosphor-icons/react/dist/ssr/index';
import { Chip } from '@/components/Chip';
import { Link } from '@/components/Link';
import { Modal } from '@/components/Modal';
import { Text } from '@/components/Text';
import type { Project as ProjectType } from '@/types/Project';

export interface ProjectProps extends ProjectType {}

export function Project({
  title, description, links = [], featured = false, technologies,
}: ProjectProps) {
  const [isModalOpen, setModalVisibility] = useState(false);
  const focusClasses = clsx('focus:rounded-lg focus:outline-none focus:outline-auxiliary-500', {
    'focus:outline-offset-4': featured,
  });

  const content = (
    <div
      className={clsx(
        'group text-left p-4 rounded-lg bg-primary-300 bg-opacity-0 hover:bg-opacity-5 active:bg-opacity-10 select-none transition-colors hover:transition-none duration-300',
        { 'outline outline-1 outline-auxiliary-500 hover:outline-auxiliary-400 active:outline-auxiliary-300': featured },
        { 'cursor-pointer': links.length > 0 },
      )}
    >
      <Text
        variant="h3"
        className="inline-block text-secondary-500 group-hover:text-secondary-400 group-active:text-secondary-300"
      >
        { title }
        { links.length > 0 && (
          <ArrowUpRight
            weight="bold"
            size={16}
            className="inline-block ml-1 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
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

  if (links.length === 1) {
    return (
      <a
        href={links[0].url}
        target="_blank"
        aria-label={title}
        className={clsx('block', focusClasses)}
      >
        { content }
      </a>
    );
  }

  if (links.length > 1) {
    return (
      <>
        <Modal
          isOpen={isModalOpen}
          className="flex flex-col gap-4"
          title={title}
          onClose={() => setModalVisibility(false)}
        >
          { links.map((link) => (<Link href={link.url} key={link.url}>{ link.name }</Link>))}
        </Modal>
        <button
          type="button"
          aria-label={title}
          className={focusClasses}
          onClick={() => setModalVisibility(true)}
        >
          { content }
        </button>
      </>
    );
  }

  return content;
}
