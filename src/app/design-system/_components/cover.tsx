import { Text } from '@/components/text';
import { Eyebrow } from '@/components/eyebrow';

export function Cover() {
  return (
    <section aria-labelledby="ds-cover-h" className="pt-16 pb-12 border-b border-rule">
      <Eyebrow>&#47;&#47; 00 / how the site is built</Eyebrow>
      <Text variant="display" id="ds-cover-h" className="text-accent mt-3 leading-none tracking-display">
        <span className="text-fg-subtle">&lt;</span>
        DESIGN&nbsp;SYSTEM
        <span className="text-fg-subtle"> /&gt;</span>
      </Text>
      <Text variant="body" className="mt-6 text-fg-muted max-w-prose-wide">
        A
        {' '}
        <strong>brutalist mono</strong>
        {' '}
        design system in service of a quiet personal site.
        The register is
        {' '}
        <strong>professional, terse, and craft-forward</strong>
        : pixel-display
        headings, JetBrains Mono body, lime-on-near-black, square corners everywhere. Every
        surface earns its emphasis — accent lands on the
        {' '}
        <strong>primary noun</strong>
        {' '}
        of
        the page, chips wear borders not fills, motion animates only transform and
        opacity, and the layout reads top-to-bottom like a structured document.
      </Text>
      <Text variant="body" className="mt-4 text-fg-muted max-w-prose-wide">
        This page is the canonical reference for the system. It documents every token,
        component, and standing rule, with live examples pulled verbatim from the five
        pages of the site.
      </Text>
      <Text variant="meta" as="div" className="mt-5 text-fg-subtle">
        <span className="text-accent">pages</span>
        {' '}
        home · about · career · projects · articles
      </Text>

      <dl className="mt-6 grid grid-cols-1 sm:grid-cols-3 border border-rule" aria-label="System at a glance">
        {[
          { label: 'tokens', value: '42' },
          { label: 'components', value: '17' },
          { label: 'standing rules', value: '15' },
        ].map((stat, i, arr) => (
          <div
            key={stat.label}
            className={`p-5${i < arr.length - 1 ? ' border-b sm:border-b-0 sm:border-r border-rule' : ''}`}
          >
            <Text variant="micro" as="dt" className="block uppercase tracking-eyebrow text-fg-subtle mb-2">
              {stat.label}
            </Text>
            <Text variant="display" as="dd" className="text-accent m-0 leading-none">
              {stat.value}
            </Text>
          </div>
        ))}
      </dl>
    </section>
  );
}
