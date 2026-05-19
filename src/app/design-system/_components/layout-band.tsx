import { Text } from '@/components/text';
import { SectionHead } from '@/components/section-head';

const shellRows = [
  { selector: 'max-w-shell (div wrapper)', value: 'max-width: 1240px', notes: 'Horizontal cap on every page; centered with mx-auto.' },
  { selector: 'px-4 md:px-8 (shell padding)', value: '0 32px → 0 16px at ≤ 768px', notes: '32px desktop / 16px mobile gutter.' },
  { selector: '<section> (py-8 border-b border-rule)', value: 'padding: 32px 0; border-bottom: 1px solid --color-rule', notes: 'Last band drops the rule via last:border-b-0 or :last-of-type.' },
  { selector: '<PageHead>', value: 'padding: 48px 0 20px', notes: 'Generous top to set the page\'s identity; --color-rule bottom border.' },
  { selector: 'Home hero <section>', value: 'padding: 64px 0 48px (lg:pt-16 lg:pb-12)', notes: '2-col flex row at lg: text left, plasma right; collapses to 1-col below lg.' },
];

const breakpoints = [
  { width: '< lg (1024px)', what: 'Projects <GridFrame className="lg:grid-cols-3"> collapses 3-col → 2-col.' },
  { width: '< lg (1024px)', what: 'About bio grid (grid-cols-article) collapses to 1-col; portrait widens.' },
  { width: '< lg (1024px)', what: 'Home hero flex-row collapses to flex-col; <HeroPlasma> is hidden below lg.' },
  {
    width: '< md (768px)',
    what: 'Shell padding 32px → 16px (px-4). <RoleCard> grid-cols-role collapses to 1-col; date gutter flips to horizontal row with bottom border. Articles grid-cols-article-card collapses to 1-col. Home hero display text drops 56px → smaller.',
  },
  { width: '< md (768px)', what: 'Projects <GridFrame> collapses md:grid-cols-2 → 1-col. About education/facts <GridFrame> collapses md:grid-cols-2 → 1-col.' },
  {
    width: '< xs (480px)',
    what: 'Header stacks vertically: <Wordmark> first row, <Nav> below with flex-wrap and tightened padding. Hamburger deliberately avoided.',
  },
];

export function LayoutBand() {
  return (
    <section id="layout" aria-labelledby="layout-h" className="py-8 border-b border-rule">
      <SectionHead eyebrow="// 07 / how a page is framed" title="Layout" id="layout-h" />

      <Text variant="h3" as="h3" className="mt-8 mb-3 text-fg">Shell</Text>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-left border border-rule border-collapse">
          <thead>
            <tr>
              <th className="py-3 px-4 border-b border-rule bg-surface text-fg-subtle font-mono text-micro font-semibold uppercase tracking-eyebrow">Selector</th>
              <th className="py-3 px-4 border-b border-rule bg-surface text-fg-subtle font-mono text-micro font-semibold uppercase tracking-eyebrow">Value</th>
              <th className="py-3 px-4 border-b border-rule bg-surface text-fg-subtle font-mono text-micro font-semibold uppercase tracking-eyebrow">Notes</th>
            </tr>
          </thead>
          <tbody>
            { shellRows.map((r) => (
              <tr key={r.selector} className="border-b border-rule last:border-b-0">
                <td className="py-3 px-4 font-mono text-meta text-fg-muted"><code className="text-accent">{r.selector}</code></td>
                <td className="py-3 px-4 font-mono text-meta text-fg">{r.value}</td>
                <td className="py-3 px-4 text-meta text-fg-muted">{r.notes}</td>
              </tr>
            )) }
          </tbody>
        </table>
      </div>

      <Text variant="h3" as="h3" className="mt-8 mb-3 text-fg">Responsive breakpoints</Text>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-left border border-rule border-collapse" aria-label="Breakpoints">
          <thead>
            <tr>
              <th className="py-3 px-4 border-b border-rule bg-surface text-fg-subtle font-mono text-micro font-semibold uppercase tracking-eyebrow">Width</th>
              <th className="py-3 px-4 border-b border-rule bg-surface text-fg-subtle font-mono text-micro font-semibold uppercase tracking-eyebrow">What changes</th>
            </tr>
          </thead>
          <tbody>
            { breakpoints.map((b, i) => (
              <tr key={`${b.width}-${i}`} className="border-b border-rule last:border-b-0">
                <td className="py-3 px-4 font-mono text-meta text-fg whitespace-nowrap">{ b.width }</td>
                <td className="py-3 px-4 text-meta text-fg-muted">{ b.what }</td>
              </tr>
            )) }
          </tbody>
        </table>
      </div>
    </section>
  );
}
