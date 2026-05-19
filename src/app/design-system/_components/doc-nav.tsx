import Link from 'next/link';

import { Text } from '@/components/text';

const items = [
  { id: 'principles', label: 'Principles' },
  { id: 'color', label: 'Color' },
  { id: 'typography', label: 'Typography' },
  { id: 'spacing', label: 'Spacing' },
  { id: 'motion', label: 'Motion' },
  { id: 'components', label: 'Components' },
  { id: 'layout', label: 'Layout' },
  { id: 'a11y', label: 'Accessibility' },
];

export function DocNav() {
  return (
    <nav aria-label="Sections" className="flex flex-wrap gap-x-6 gap-y-2 py-4 border-b border-rule">
      { items.map((item, i) => (
        <Text asChild key={item.id} variant="meta">
          <Link
            href={`#${item.id}`}
            className="group/nav inline-flex items-baseline gap-1 text-fg-muted no-underline transition-colors duration-fast ease-out motion-safe:hover:text-accent-strong motion-safe:hover:underline underline-offset-4"
          >
            <span className="text-fg-subtle transition-colors duration-fast ease-out motion-safe:group-hover/nav:text-accent-strong">
              { String(i + 1).padStart(2, '0') }
              .
            </span>
            { item.label }
          </Link>
        </Text>
      )) }
    </nav>
  );
}
