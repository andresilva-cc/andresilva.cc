import clsx from 'clsx';

import { Wordmark } from '@/components/wordmark';
import { Nav } from '@/components/nav';
import { getRepositories } from '@/repositories';

export interface HeaderProps {
  className?: string;
}

/*
 * Header — wordmark on the left, primary nav on the right.
 *
 * Stacks vertically at narrow viewports (< 480px) with no hamburger
 * disclosure; the layout itself reflows. See design notes for the v4.3
 * mobile pass and docs/architecture.md §"Mobile menu mechanism".
 */
export function Header({ className }: HeaderProps) {
  const { menuRepository } = getRepositories();
  const items = menuRepository.getAll();

  return (
    <header
      className={clsx(
        'flex flex-col items-start gap-3',
        'xs:flex-row xs:items-center xs:justify-between xs:gap-6',
        className,
      )}
    >
      <Wordmark />
      <Nav items={items} className="-ml-3 flex-wrap" />
    </header>
  );
}
