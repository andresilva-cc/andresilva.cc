import { ReactNode } from 'react';
import clsx from 'clsx';
import { Slot } from '@radix-ui/react-slot';
import { Text } from '@/components/Text';

const variants = {
  default: 'text-gray-950 bg-primary-500 hover:bg-primary-400 active:bg-primary-300',
  text: 'text-auxiliary-500 hover:text-auxiliary-400 active:text-auxiliary-300',
  icon: 'text-auxiliary-500 hover:text-auxiliary-400 active:text-auxiliary-300 [&>svg]:inline-block',
};

export interface ButtonProps {
  variant?: keyof typeof variants
  children: ReactNode
  asChild?: boolean
  className?: string
  onClick?: () => void
}

export function Button({
  variant = 'default', children, asChild = false, className, onClick = undefined, ...props
}: ButtonProps) {
  const isIcon = variant === 'icon';
  const Tag = asChild ? Slot : 'button';

  return (
    <Text variant="button" asChild>
      <Tag
        className={clsx(
          'inline-block transition-colors hover:transition-none duration-300',
          { 'px-2.5 py-1 rounded': !isIcon },
          variants[variant],
          className,
        )}
        onClick={onClick}
        {...props}
      >

        { children }
      </Tag>
    </Text>
  );
}
