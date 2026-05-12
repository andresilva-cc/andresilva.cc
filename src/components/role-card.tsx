import { ReactNode } from 'react';
import clsx from 'clsx';

import { Text } from '@/components/text';
import { Tag } from '@/components/tag';
import { StatusDot } from '@/components/status-dot';

export interface RoleCardProps {
  /** Pre-formatted date range string (e.g. "apr 2025 — now"). Lowercase month abbreviations, em-dash with spaces. */
  dates: string;
  /** Mark the role as current — adds a pulsing StatusDot next to the dates. */
  isCurrent?: boolean;
  title: string;
  company: string;
  /** Optional "formerly X" note for renamed/acquired employers. */
  formerly?: string;
  /** Rich content — bullets, paragraphs, etc. */
  description: ReactNode;
  technologies: Array<string>;
  className?: string;
}

/*
 * RoleCard — a single career role entry.
 *
 * Two columns at desktop: the date gutter on the left (183px, sized to
 * fit any date string on one line), the role content on the right.
 * Collapses to a single column at narrow viewports (< md).
 */
export function RoleCard({
  dates, isCurrent = false, title, company, formerly, description, technologies, className,
}: RoleCardProps) {
  return (
    <li className={clsx('grid grid-cols-1 md:grid-cols-role border-b border-rule pb-8 pt-8 first:pt-0 last:border-b-0', className)}>
      <div className="pb-3 md:pb-0 md:pr-8">
        <Text variant="meta" as="span" className="inline-flex items-baseline gap-2 text-fg-subtle lowercase">
          { isCurrent && <StatusDot ariaLabel="current role" /> }
          { dates }
        </Text>
      </div>
      <div className="flex flex-col gap-3">
        <Text variant="h3" as="p" className="m-0 text-fg">
          { title }
          <Text variant="meta" as="span" className="text-fg-subtle mx-2 font-normal">@</Text>
          <Text variant="h3" as="span" className="text-accent">{ company }</Text>
        </Text>
        { formerly && (
          <Text variant="meta" className="text-fg-subtle italic m-0">{ `// formerly ${formerly}` }</Text>
        ) }
        <div className="text-fg-muted text-body leading-relaxed [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:m-0 [&_li]:mb-1 [&_strong]:text-fg [&_strong]:font-semibold max-w-prose-wide">
          { description }
        </div>
        <div className="flex flex-wrap gap-1">
          { technologies.map((tech) => (
            <Tag key={tech}>{ tech }</Tag>
          )) }
        </div>
      </div>
    </li>
  );
}
