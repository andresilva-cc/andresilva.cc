import { ComponentProps, ReactNode } from 'react';
import { Link } from '@/navigation';
import clsx from 'clsx';
import { Text } from '@/components/Text';

const variants = {
  default: 'text-gray-950 bg-primary-500 hover:bg-primary-400 active:bg-primary-300',
  text: 'text-auxiliary-500 hover:text-auxiliary-400 active:text-auxiliary-300',
  icon: 'text-auxiliary-500 hover:text-auxiliary-400 active:text-auxiliary-300 [&>svg]:inline-block',
};

export interface ButtonProps extends ComponentProps<typeof Link> {
  variant?: keyof typeof variants
  href: string
  children: ReactNode
  className?: string
}

export function Button({
  variant = 'default', href, children, className, ...props
}: ButtonProps) {
  const isIcon = variant === 'icon';

  return (
    <Text variant="button" asChild>
      <Link
        className={clsx(
          'inline-block transition-colors hover:transition-none duration-300',
          { 'px-2.5 py-1 rounded': !isIcon },
          variants[variant],
          className,
        )}
        href={href}
        {...props}
      >

        { children }
      </Link>
    </Text>
  );
}
