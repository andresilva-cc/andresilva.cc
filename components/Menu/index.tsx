'use client';

import { usePathname } from '@/navigation';
import clsx from 'clsx';
import { LinkButton } from '@/components/LinkButton';

export interface MenuProps {
  items: Array<{
    name: string
    path: string
  }>
  className?: string
}

export function Menu({ items, className }: MenuProps) {
  const currentPath = usePathname();

  return (
    <nav
      className={clsx(
        'scrollbar-thin scrollbar-thumb-gray-950',
        className,
      )}
    >
      <ul className="flex gap-8 md:gap-16">
        { items.map((item) => (
          <li key={item.path} className="first:ml-auto last:mr-auto">
            <LinkButton
              variant={currentPath === item.path ? 'default' : 'text'}
              href={item.path}
            >
              { item.name }
            </LinkButton>
          </li>
        ))}
      </ul>
    </nav>
  );
}
