import { Text } from '@/components/text';
import { SectionHead } from '@/components/section-head';
import { Button } from '@/components/button';
import { ArrowLink } from '@/components/arrow-link';

export function AccessibilityBand() {
  return (
    <section id="a11y" aria-labelledby="a11y-h" className="py-8">
      <SectionHead eyebrow="// 08 / so everyone can read it" title="Accessibility" id="a11y-h" />

      <Text variant="h3" as="h3" className="mt-8 mb-3 text-fg">Focus indicator</Text>
      <div className="mt-4 border border-rule">
        <div className="flex items-baseline justify-between gap-4 flex-wrap py-3 px-4 border-b border-rule bg-surface">
          <Text variant="meta" as="code" className="font-mono font-semibold text-accent">:focus-visible</Text>
          <Text variant="micro" as="span" className="font-normal text-fg-subtle uppercase tracking-eyebrow">
            2px solid --color-accent &middot; 2px offset
          </Text>
        </div>
        <div className="p-6 bg-canvas flex flex-wrap items-center gap-4">
          <Button type="button">Tab to focus &rarr;</Button>
          <ArrowLink href="/about">tab here too</ArrowLink>
        </div>
        <div className="py-3 px-4 border-t border-rule bg-surface">
          <ul className="m-0 pl-4 flex flex-col gap-1">
            <li>
              <Text variant="meta" className="text-fg-muted">
                Square corners on every focus ring (
                <code className="text-accent">border-radius: 0</code>
                ) to match the brutalist register.
              </Text>
            </li>
            <li>
              <Text variant="meta" className="text-fg-muted">
                Offset is
                {' '}
                <code className="text-accent">2px</code>
                {' '}
                for most elements;
                {' '}
                <code className="text-accent">-3px</code>
                {' '}
                for
                {' '}
                <code className="text-accent">&lt;LatestRow&gt;</code>
                {' '}
                (rings sit inside so they don&#x2019;t overdraw the top rule).
              </Text>
            </li>
            <li>
              <Text variant="meta" className="text-fg-muted">
                Focus uses
                {' '}
                <code className="text-accent">:focus-visible</code>
                , not
                {' '}
                <code className="text-accent">:focus</code>
                , so mouse clicks don&#x2019;t leave a ring behind.
              </Text>
            </li>
          </ul>
        </div>
      </div>

      <Text variant="h3" as="h3" className="mt-8 mb-3 text-fg">Standing accessibility rules</Text>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-left border border-rule border-collapse">
          <thead>
            <tr>
              <th className="py-3 px-4 border-b border-rule bg-surface text-fg-subtle font-mono text-micro font-semibold uppercase tracking-eyebrow">Rule</th>
              <th className="py-3 px-4 border-b border-rule bg-surface text-fg-subtle font-mono text-micro font-semibold uppercase tracking-eyebrow">Implementation</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-rule last:border-b-0">
              <td className="py-3 px-4 text-meta text-fg font-semibold align-top">Skip link on every page.</td>
              <td className="py-3 px-4 text-meta text-fg-muted">
                First focusable element; lands on
                {' '}
                <code className="text-accent">#main</code>
                . See component 01.
              </td>
            </tr>
            <tr className="border-b border-rule last:border-b-0">
              <td className="py-3 px-4 text-meta text-fg font-semibold align-top">Heading hierarchy follows option-b.</td>
              <td className="py-3 px-4 text-meta text-fg-muted">
                One
                {' '}
                <code className="text-accent">&lt;h1&gt;</code>
                {' '}
                per page.
                {' '}
                <code className="text-accent">&lt;h2&gt;</code>
                {' '}
                only on sections with a labeled heading (Home Bio/Latest, About&#x2019;s four sections). Career,
                Projects, Articles have zero
                {' '}
                <code className="text-accent">&lt;h2&gt;</code>
                {' '}
                in
                {' '}
                <code className="text-accent">&lt;main&gt;</code>
                ; their sections use
                {' '}
                <code className="text-accent">aria-label</code>
                .
              </td>
            </tr>
            <tr className="border-b border-rule last:border-b-0">
              <td className="py-3 px-4 text-meta text-fg font-semibold align-top">
                Card titles are
                {' '}
                <code className="text-accent">&lt;p&gt;</code>
                , not
                {' '}
                <code className="text-accent">&lt;h3&gt;</code>
                .
              </td>
              <td className="py-3 px-4 text-meta text-fg-muted">
                Card lists are
                {' '}
                <code className="text-accent">&lt;ul&gt;</code>
                /
                <code className="text-accent">&lt;li&gt;</code>
                {' '}
                &mdash; database rows, not document sub-sections.
              </td>
            </tr>
            <tr className="border-b border-rule last:border-b-0">
              <td className="py-3 px-4 text-meta text-fg font-semibold align-top">ARIA labels match visible text.</td>
              <td className="py-3 px-4 text-meta text-fg-muted">
                Latest row aria-labels are just the row&#x2019;s identity phrase (no &#x201C;Read more on the career
                page&#x201D;).
                {' '}
                <code className="text-accent">aria-current=&quot;page&quot;</code>
                {' '}
                on the active nav item.
              </td>
            </tr>
            <tr className="border-b border-rule last:border-b-0">
              <td className="py-3 px-4 text-meta text-fg font-semibold align-top">
                Decorative SVGs are
                {' '}
                <code className="text-accent">aria-hidden=&quot;true&quot;</code>
                .
              </td>
              <td className="py-3 px-4 text-meta text-fg-muted">
                Every arrow, illustration, and wordmark glyph. The wrapping
                {' '}
                <code className="text-accent">&lt;a&gt;</code>
                {' '}
                or
                {' '}
                <code className="text-accent">&lt;span&gt;</code>
                {' '}
                carries the accessible name.
              </td>
            </tr>
            <tr className="border-b border-rule last:border-b-0">
              <td className="py-3 px-4 text-meta text-fg font-semibold align-top">Reduced-motion handling.</td>
              <td className="py-3 px-4 text-meta text-fg-muted">
                Global override zeroes animation- and transition-duration. The hero&#x2019;s stipple art renders one static frame.
                Press-scale rules are individually gated with
                {' '}
                <code className="text-accent">@media (prefers-reduced-motion: no-preference)</code>
                .
              </td>
            </tr>
            <tr className="border-b border-rule last:border-b-0">
              <td className="py-3 px-4 text-meta text-fg font-semibold align-top">Photo touch-device parity.</td>
              <td className="py-3 px-4 text-meta text-fg-muted">
                Photo wrapper is
                {' '}
                <code className="text-accent">tabindex=&quot;0&quot;</code>
                {' '}
                with an explanatory
                {' '}
                <code className="text-accent">aria-label</code>
                . Touch devices consume
                {' '}
                <code className="text-accent">--photo-filter-soft</code>
                {' '}
                so the portrait reads recognizably without hover.
              </td>
            </tr>
            <tr className="border-b border-rule last:border-b-0">
              <td className="py-3 px-4 text-meta text-fg font-semibold align-top">Curly quotes in prose, straight quotes in code.</td>
              <td className="py-3 px-4 text-meta text-fg-muted">
                See &sect;03 typography.
                {' '}
                <code className="text-accent">aria-label</code>
                {' '}
                attributes use straight quotes by HTML rule; visible prose uses curly.
              </td>
            </tr>
            <tr className="border-b border-rule last:border-b-0">
              <td className="py-3 px-4 text-meta text-fg font-semibold align-top">
                <code className="text-accent">--color-fg-subtle</code>
                {' '}
                AA-clears on both dark surfaces.
              </td>
              <td className="py-3 px-4 text-meta text-fg-muted">
                <code className="text-accent">--color-fg-subtle</code>
                {' '}
                (#7E8E76) clears 5.53:1 on
                {' '}
                <code className="text-accent">--color-canvas</code>
                {' '}
                and 5.33:1 on
                {' '}
                <code className="text-accent">--color-surface</code>
                . See &sect;02 contrast matrix.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}
