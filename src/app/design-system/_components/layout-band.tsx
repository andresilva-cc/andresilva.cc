import { Text } from '@/components/text';
import { SectionHead } from '@/components/section-head';

const breakpoints = [
  { name: 'xs', value: '480px', use: 'Header reflow — wordmark + nav stack vertically below this' },
  { name: 'sm (built-in)', value: '640px', use: 'Not currently consumed; available' },
  { name: 'md (built-in)', value: '768px', use: 'Most content layouts switch from 1-col to 2/3-col' },
  { name: 'lg (built-in)', value: '1024px', use: 'Home hero gains the side plasma column' },
  { name: 'xl (built-in)', value: '1280px', use: 'Projects grid promotes to 3 columns' },
];

const grids = [
  { token: '--grid-template-columns-role', value: '183px 1fr', use: 'Career role: fixed date gutter + content' },
  { token: '--grid-template-columns-article', value: '200px 1fr', use: 'About bio (Portrait + prose)' },
  { token: '--grid-template-columns-article-card', value: '240px 1fr', use: 'Article card: illustration + body' },
];

export function LayoutBand() {
  return (
    <section id="layout" aria-labelledby="layout-h" className="py-8 border-t border-rule">
      <SectionHead eyebrow="// 07 / how a page is framed" title="Layout" id="layout-h" />
      <Text variant="body" className="text-fg-muted max-w-prose-wide">
        Every page sits inside the same shell: 1240px max-width, centered, 16/32px horizontal
        padding. Header + main + footer flow top-to-bottom. No fixed sidebars, no overlay
        panels, no sticky chrome.
      </Text>

      <Text variant="h3" as="h3" className="mt-10 text-fg">Shell</Text>
      <Text variant="body" className="text-fg-muted max-w-prose-wide mt-2">
        Container is 1240px wide, centered, with responsive horizontal padding (16px below
        the md breakpoint, 32px above). The wrapper is a flex column so the footer stays
        at the bottom on short pages.
      </Text>

      <Text variant="h3" as="h3" className="mt-10 text-fg">Breakpoints</Text>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-left border border-rule border-collapse">
          <thead>
            <tr>
              <th className="p-3 border-b border-rule text-fg-subtle font-mono text-meta font-medium uppercase tracking-eyebrow">Breakpoint</th>
              <th className="p-3 border-b border-rule text-fg-subtle font-mono text-meta font-medium uppercase tracking-eyebrow">Min-width</th>
              <th className="p-3 border-b border-rule text-fg-subtle font-mono text-meta font-medium uppercase tracking-eyebrow">Used for</th>
            </tr>
          </thead>
          <tbody>
            { breakpoints.map((b) => (
              <tr key={b.name} className="border-b border-rule last:border-b-0">
                <td className="p-3 font-mono text-fg">{ b.name }</td>
                <td className="p-3 font-mono text-fg-muted">{ b.value }</td>
                <td className="p-3 text-fg-muted">{ b.use }</td>
              </tr>
            )) }
          </tbody>
        </table>
      </div>

      <Text variant="h3" as="h3" className="mt-10 text-fg">Bespoke grids</Text>
      <Text variant="body" className="text-fg-muted max-w-prose-wide mt-2">
        Two pages need a fixed left column plus flexible content. Both layouts are
        registered as Tailwind utilities under the grid-template-columns namespace.
      </Text>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-left border border-rule border-collapse">
          <thead>
            <tr>
              <th className="p-3 border-b border-rule text-fg-subtle font-mono text-meta font-medium uppercase tracking-eyebrow">Token</th>
              <th className="p-3 border-b border-rule text-fg-subtle font-mono text-meta font-medium uppercase tracking-eyebrow">Value</th>
              <th className="p-3 border-b border-rule text-fg-subtle font-mono text-meta font-medium uppercase tracking-eyebrow">Used for</th>
            </tr>
          </thead>
          <tbody>
            { grids.map((g) => (
              <tr key={g.token} className="border-b border-rule last:border-b-0">
                <td className="p-3 font-mono text-fg">{ g.token }</td>
                <td className="p-3 font-mono text-fg-muted">{ g.value }</td>
                <td className="p-3 text-fg-muted">{ g.use }</td>
              </tr>
            )) }
          </tbody>
        </table>
      </div>
    </section>
  );
}
