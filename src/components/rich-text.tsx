import { ReactNode } from 'react';

type Tag = 'strong' | 'p' | 'ul' | 'li';

export interface RichTextProps {
  children(tags: Record<Tag, (chunks: ReactNode) => ReactNode>): ReactNode;
}

export function RichText({ children }: RichTextProps) {
  return (
    <>
      {children({
        strong: (chunks: ReactNode) => <strong>{chunks}</strong>,
        p: (chunks: ReactNode) => <p>{chunks}</p>,
        ul: (chunks: ReactNode) => <ul>{chunks}</ul>,
        li: (chunks: ReactNode) => <li>{chunks}</li>,
      })}
    </>
  );
}
