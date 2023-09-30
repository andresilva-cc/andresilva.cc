'use client';

import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { Button } from '@/components/Button';

export interface MenuProps {
  items: Array<{
    name: string
    path: string
  }>
  className?: string
}

export function Menu({ items, className }: MenuProps) {
  const currentPath = usePathname().substring(3);

  return (
    <nav
      className={clsx(
        'overflow-x-auto overflow-y-hidden scrollbar-thin scrollbar-thumb-gray-950',
        className,
      )}
    >
      <ul className="flex gap-8 md:gap-16">
        { items.map((item) => (
          <li key={item.path} className="first:ml-auto last:mr-auto">
            <Button
              variant={currentPath === item.path ? 'default' : 'text'}
              href={item.path}
            >
              { item.name }
            </Button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
