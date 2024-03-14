import { ComponentProps, ReactNode } from 'react';
import { Link } from '@/navigation';
import { Button, ButtonProps } from '@/components/Button';

export interface LinkButtonProps extends ButtonProps, Partial<ComponentProps<typeof Link>> {
  href: string
  children: ReactNode
  onClick?: () => any
}

export function LinkButton({
  variant, className, href, children, onClick, ...props
}: LinkButtonProps) {
  return (
    <Button
      variant={variant}
      className={className}
      asChild
      onClick={onClick}
    >
      <Link
        href={href}
        {...props}
      >
        { children }
      </Link>
    </Button>
  );
}
