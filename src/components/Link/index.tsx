import { ReactNode } from 'react';
import { Link as LinkIcon } from '@phosphor-icons/react/dist/ssr/index';
import { Text } from '@/components/Text';

export interface LinkProps extends React.HTMLProps<HTMLAnchorElement> {
  href: string
  children: ReactNode
}

export function Link({ href, children, ...props }: LinkProps) {
  return (
    <Text variant="body-3" asChild>
      <a
        href={href}
        target="_blank"
        className="flex gap-1 text-auxiliary-500 hover:text-auxiliary-400 active:text-auxiliary-300 transition-colors hover:transition-none focus:outline-none focus:outline-auxiliary-500 focus:outline-offset-4 focus:outline-1"
        {...props}
      >
        <LinkIcon size={14} />
        { children }
      </a>
    </Text>
  );
}
