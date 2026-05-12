import { Text } from '@/components/text';
import { Eyebrow } from '@/components/eyebrow';

export function Cover() {
  return (
    <section aria-labelledby="ds-cover-h" className="py-8">
      <Eyebrow>&#47;&#47; 00 / how the site is built</Eyebrow>
      <Text variant="display" id="ds-cover-h" className="text-fg mt-3 leading-none">
        <span className="text-fg-subtle">&lt;</span>
        DESIGN&nbsp;SYSTEM
        <span className="text-fg-subtle"> /&gt;</span>
      </Text>
      <Text variant="body" className="mt-5 text-fg-muted max-w-prose-wide">
        A
        {' '}
        <strong>brutalist mono</strong>
        {' '}
        design system in service of a quiet personal site. The register is
        {' '}
        <strong>professional, terse, and craft-forward</strong>
        : pixel-display headings, JetBrains Mono body, lime-on-near-black,
        square corners everywhere. Every surface earns its emphasis — accent lands on
        the
        {' '}
        <strong>primary noun</strong>
        {' '}
        of the page, chips wear borders not fills, motion animates only transform and
        opacity, and the layout reads top-to-bottom like a structured document.
      </Text>
      <Text variant="body" className="mt-4 text-fg-muted max-w-prose-wide">
        This page is the canonical reference for the system. It documents every token,
        component, and standing rule, with live examples pulled verbatim from the five
        surfaces of the site.
      </Text>

      <dl className="mt-8 grid grid-cols-3 border border-rule">
        {[
          { label: 'tokens', value: '43' },
          { label: 'components', value: '16' },
          { label: 'standing rules', value: '9' },
        ].map((stat, i, arr) => (
          <div
            key={stat.label}
            className={`p-5 ${i < arr.length - 1 ? 'border-r border-rule' : ''}`}
          >
            <Text variant="micro" as="dt" className="uppercase tracking-eyebrow text-fg-subtle">
              { stat.label }
            </Text>
            <Text variant="display" as="dd" className="font-display text-accent m-0 leading-none mt-2">
              { stat.value }
            </Text>
          </div>
        ))}
      </dl>
    </section>
  );
}
