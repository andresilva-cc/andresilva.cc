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
 * fit any date string on one line) with a right border rule, the role
 * content on the right. Collapses to a single column at narrow viewports
 * with the date gutter above the content, separated by a bottom rule.
 */
export function RoleCard({
  dates, isCurrent = false, title, company, formerly, description, technologies, className,
}: RoleCardProps) {
  return (
    <li className={clsx('grid grid-cols-1 md:grid-cols-role border-b border-rule last:border-b-0', className)}>
      {/* Date gutter — 20px padding; at mobile: row layout, bottom border */}
      <div className="p-3 px-4 border-b border-rule flex flex-row flex-wrap items-center gap-3 md:flex-col md:items-start md:gap-2 md:p-5 md:border-b-0 md:border-r md:border-rule">
        <Text variant="meta" as="span" className="inline-flex items-center gap-2 text-fg-muted lowercase">
          { isCurrent && <StatusDot ariaLabel="current role" /> }
          { dates }
        </Text>
      </div>
      {/* Role content — 20px vertical, 24px horizontal padding */}
      <div className="p-4 md:py-5 md:px-6 flex flex-col gap-3">
        <Text variant="h3" as="p" className="m-0 text-fg">
          { title }
          <Text variant="meta" as="span" className="text-fg-subtle mx-2 font-normal">@</Text>
          <Text variant="h3" as="span" className="text-accent">{ company }</Text>
        </Text>
        { formerly && (
          <Text variant="meta" className="text-fg-subtle italic m-0">{ `// formerly ${formerly}` }</Text>
        ) }
        <div className="text-fg-muted text-body max-w-prose-wide [&_ul]:list-none [&_ul]:p-0 [&_ul]:m-0 [&_li]:mb-2 [&_li:last-child]:mb-0 [&_li]:before:content-['+'] [&_li]:before:text-accent [&_li]:before:font-semibold [&_li]:before:mr-2 [&_strong]:text-fg [&_strong]:font-semibold">
          { description }
        </div>
        <div className="flex flex-wrap gap-x-2 gap-y-1">
          { technologies.map((tech) => (
            <Tag key={tech}>{ tech }</Tag>
          )) }
        </div>
      </div>
    </li>
  );
}
