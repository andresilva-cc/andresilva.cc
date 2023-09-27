'use client';

import { usePathname } from 'next/navigation';
import { Button } from '@/components/Button';

const items = [
  { name: 'About', path: '/about' },
  { name: 'Career', path: '/career' },
  { name: 'Projects', path: '/projects' },
];

export function Menu() {
  const currentPath = usePathname();

  return (
    <nav>
      <ul className="flex gap-16">
        { items.map((item) => (
          <li key={item.path}>
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
