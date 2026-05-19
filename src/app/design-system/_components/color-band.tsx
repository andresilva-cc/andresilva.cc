import { Text } from '@/components/text';
import { SectionHead } from '@/components/section-head';

const swatchGroups = [
  {
    label: 'Brand & surfaces',
    swatches: [
      { name: '--color-canvas', hex: '#0B0F0A', role: 'page base', bg: 'bg-canvas' },
      { name: '--color-surface', hex: '#0F1410', role: 'hover · raised cell', bg: 'bg-surface' },
      { name: '--color-rule', hex: '#1F2A1F', role: '1px dividers', bg: 'bg-rule' },
      { name: '--color-rule-strong', hex: '#2C3A2C', role: 'decorative SVG strokes only', bg: 'bg-rule-strong' },
    ],
  },
  {
    label: 'Text tints',
    swatches: [
      { name: '--color-fg', hex: '#D7E5D0', role: 'primary text', bg: 'bg-fg' },
      { name: '--color-fg-muted', hex: '#9DAA95', role: 'body prose', bg: 'bg-fg-muted' },
      { name: '--color-fg-subtle', hex: '#7E8E76', role: 'muted · meta', bg: 'bg-fg-subtle' },
    ],
  },
  {
    label: 'Accent family',
    swatches: [
      { name: '--color-accent', hex: '#C8FF3D', role: 'brand emphasis', bg: 'bg-accent' },
      { name: '--color-accent-strong', hex: '#DEFF6B', role: 'hover state', bg: 'bg-accent-strong' },
      { name: '--color-accent-muted', hex: '#3D4F18', role: 'chip · badge borders', bg: 'bg-accent-muted' },
      { name: '--color-accent-tint', hex: 'rgba(200,255,61,.08)', role: 'CTA hover wash', bg: 'bg-accent-tint' },
    ],
  },
];

const contrast = [
  { fg: '--color-fg', fgBg: 'bg-fg', bg: '--color-canvas', ratio: '14.7 : 1', verdict: 'AAA', verdictClass: 'text-accent' },
  { fg: '--color-fg-muted', fgBg: 'bg-fg-muted', bg: '--color-canvas', ratio: '7.92 : 1', verdict: 'AAA', verdictClass: 'text-accent' },
  { fg: '--color-fg-subtle', fgBg: 'bg-fg-subtle', bg: '--color-canvas', ratio: '5.53 : 1', verdict: 'AA (body)', verdictClass: 'text-fg' },
  { fg: '--color-fg-subtle', fgBg: 'bg-fg-subtle', bg: '--color-surface', ratio: '5.33 : 1', verdict: 'AA (body)', verdictClass: 'text-fg' },
  { fg: '--color-accent', fgBg: 'bg-accent', bg: '--color-canvas', ratio: '16.4 : 1', verdict: 'AAA', verdictClass: 'text-accent' },
  { fg: '--color-accent-strong', fgBg: 'bg-accent-strong', bg: '--color-canvas', ratio: '17.1 : 1', verdict: 'AAA', verdictClass: 'text-accent' },
  { fg: '--color-accent-muted', fgBg: 'bg-accent-muted', bg: '--color-canvas', ratio: '2.14 : 1', verdict: 'Decorative borders only', verdictClass: 'text-fg-subtle' },
];

export function ColorBand() {
  return (
    <section id="color" aria-labelledby="color-h" className="py-8 border-b border-rule">
      <SectionHead eyebrow="// 02 / how the page is colored" title="Color tokens" id="color-h" />
      <Text variant="body" className="text-fg-muted max-w-prose-wide">
        A near-black ground (
        <code className="text-accent">--color-canvas</code>
        {' '}
        #0B0F0A), a hairline
        rule grid, three text tints (
        <code className="text-accent">--color-fg / --color-fg-muted / --color-fg-subtle</code>
        ),
        and a single lime accent (
        <code className="text-accent">--color-accent</code>
        {' '}
        #C8FF3D) that does all the
        wayfinding. No semantic warning/success palette — the site has no state machinery that needs them.
      </Text>

      {swatchGroups.map((group) => (
        <div key={group.label}>
          <Text variant="h3" as="h3" className="mt-8 mb-3 text-fg">{group.label}</Text>
          <ul className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 list-none p-0">
            {group.swatches.map((s) => (
              <li key={s.name} className="flex flex-col border border-rule">
                <span
                  aria-hidden="true"
                  className={`block h-22 border-b border-rule ${s.bg}`}
                />
                <div className="py-3 px-4 flex flex-col gap-1">
                  <Text variant="meta" as="span" className="font-mono text-accent font-semibold">{s.name}</Text>
                  <Text variant="meta" as="span" className="font-mono text-fg">{s.hex}</Text>
                  <Text variant="micro" as="span" className="font-normal uppercase tracking-eyebrow text-fg-subtle">{s.role}</Text>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}

      <Text variant="h3" as="h3" className="mt-8 mb-3 text-fg">Contrast matrix</Text>
      <Text variant="body" className="text-fg-muted max-w-prose-wide mt-2">
        WCAG AA threshold is 4.5:1 for body text, 3:1 for large text (≥ 18px / 14px bold).
        <code className="text-accent"> --color-fg-subtle</code>
        {' '}
        (#7E8E76) clears AA at body size on
        both
        <code className="text-accent">--color-canvas</code>
        {' '}
        and
        <code className="text-accent">--color-surface</code>
        ,
        so it can be used anywhere body text needs a muted tint.
      </Text>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-left border border-rule border-collapse" aria-label="Contrast ratios">
          <thead>
            <tr>
              <th className="py-3 px-4 border-b border-rule bg-surface text-fg-subtle font-mono text-micro font-semibold uppercase tracking-eyebrow">Foreground</th>
              <th className="py-3 px-4 border-b border-rule bg-surface text-fg-subtle font-mono text-micro font-semibold uppercase tracking-eyebrow">Background</th>
              <th className="py-3 px-4 border-b border-rule bg-surface text-fg-subtle font-mono text-micro font-semibold uppercase tracking-eyebrow">Ratio</th>
              <th className="py-3 px-4 border-b border-rule bg-surface text-fg-subtle font-mono text-micro font-semibold uppercase tracking-eyebrow">Verdict</th>
            </tr>
          </thead>
          <tbody>
            {contrast.map((row) => (
              <tr key={`${row.fg}-${row.bg}`} className="border-b border-rule last:border-b-0">
                <td className="py-3 px-4 font-mono text-fg-muted text-meta align-middle">
                  <span aria-hidden="true" className={`inline-block size-7 border border-rule-strong align-middle mr-3 ${row.fgBg}`} />
                  <code className="text-accent">{row.fg}</code>
                </td>
                <td className="py-3 px-4 font-mono text-meta text-fg-muted"><code className="text-accent">{row.bg}</code></td>
                <td className="py-3 px-4 font-mono text-meta text-fg">{row.ratio}</td>
                <td className={`py-3 px-4 font-mono text-meta font-semibold ${row.verdictClass}`}>{row.verdict}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
