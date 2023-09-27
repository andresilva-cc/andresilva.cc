'use client';

import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { Button } from '@/components/Button';

const items = [
  { name: 'About', path: '/about' },
  { name: 'Career', path: '/career' },
  { name: 'Projects', path: '/projects' },
];

export interface MenuProps {
  className?: string
}

export function Menu({ className }: MenuProps) {
  const currentPath = usePathname();

  return (
    <nav
      className={clsx(
        'overflow-x-auto overflow-y-hidden scrollbar-thin scrollbar-thumb-gray-950',
        className,
      )}
    >
      <ul className="flex relative top-[3px] h-[29px] gap-8 md:gap-16">
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
