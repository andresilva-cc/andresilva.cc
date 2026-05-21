import { ReactNode } from 'react';

type DataLanguage = { 'data-language'?: string };

export type PreShikiRssProps = DataLanguage & { style?: React.CSSProperties; children?: ReactNode };

export function PreShikiRss({ children }: PreShikiRssProps) {
  return <pre>{children}</pre>;
}
