import { ReactNode } from 'react';
import { Link as LinkIcon } from '@phosphor-icons/react/dist/ssr';
import { Text } from '@/components/Text';

export interface JobLinkProps extends React.HTMLProps<HTMLAnchorElement> {
  href: string
  children: ReactNode
}

export function JobLink({ href, children, ...props }: JobLinkProps) {
  return (
    <Text variant="body-3" asChild>
      <a
        href={href}
        target="_blank"
        className="flex gap-1 text-auxiliary-500 hover:text-auxiliary-400 active:text-auxiliary-300 transition-colors hover:transition-none"
        {...props}
      >
        <LinkIcon size={14} />
        { children }
      </a>
    </Text>
  );
}
