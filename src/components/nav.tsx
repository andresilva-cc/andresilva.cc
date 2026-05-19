'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import clsx from 'clsx';

import { Text } from '@/components/text';

export interface NavItem {
  name: string;
  path: string;
}

export interface NavProps {
  items: Array<NavItem>;
  className?: string;
}

function isActivePath(itemPath: string, currentPath: string): boolean {
  if (itemPath === '/') return currentPath === '/';
  return currentPath === itemPath || currentPath.startsWith(`${itemPath}/`);
}

/*
 * Nav — primary site navigation.
 *
 * Client component because it reads `usePathname()` to mark the active
 * item with `aria-current="page"` and wrap the label in literal
 * `[brackets]` — a deliberate decoration that doubles the color-only
 * affordance with a typographic one (design principle: color is never
 * the only signal).
 */
export function Nav({ items, className }: NavProps) {
  const pathname = usePathname();

  return (
    <nav aria-label="Primary" className={clsx('flex -mr-3', className)}>
      { items.map((item) => {
        const isActive = isActivePath(item.path, pathname);
        const label = isActive ? `[${item.name}]` : item.name;
        return (
          <Text key={item.path} asChild variant="meta">
            <Link
              href={item.path}
              aria-current={isActive ? 'page' : undefined}
              className={clsx(
                'inline-flex items-center px-3 py-2 min-h-8 no-underline transition-colors duration-fast ease-out',
                isActive
                  ? 'text-accent'
                  : 'text-fg-muted hover:text-fg',
              )}
            >
              { label }
            </Link>
          </Text>
        );
      }) }
    </nav>
  );
}
