import { ReactNode } from 'react';
import { Button } from '@/components/Button';

export interface MenuItemProps {
  href: string
  active?: boolean
  children: ReactNode
}

export function MenuItem({
  href, active = false, children,
}: MenuItemProps) {
  const variant = active ? 'default' : 'text';

  return (
    <Button variant={variant} href={href}>
      { children }
    </Button>
  );
}
