import { Text } from '@/components/text';
import { SectionHead } from '@/components/section-head';

const swatches = [
  { name: '--canvas', hex: '#0B0F0A', role: 'Page background', bg: 'bg-canvas' },
  { name: '--surface', hex: '#0F1410', role: 'Hover / raised cell', bg: 'bg-surface' },
  { name: '--rule', hex: '#1F2A1F', role: '1px dividers', bg: 'bg-rule' },
  { name: '--rule-strong', hex: '#2C3A2C', role: 'Decorative SVG strokes only', bg: 'bg-rule-strong' },
  { name: '--fg', hex: '#D7E5D0', role: 'Primary text', bg: 'bg-fg' },
  { name: '--fg-muted', hex: '#9DAA95', role: 'Body prose', bg: 'bg-fg-muted' },
  { name: '--fg-subtle', hex: '#7E8E76', role: 'Meta / muted text', bg: 'bg-fg-subtle' },
  { name: '--accent', hex: '#C8FF3D', role: 'Brand emphasis — primary noun', bg: 'bg-accent' },
  { name: '--accent-strong', hex: '#DEFF6B', role: 'Hover state of accent', bg: 'bg-accent-strong' },
  { name: '--accent-muted', hex: '#3D4F18', role: 'Chip and badge borders only', bg: 'bg-accent-muted' },
  { name: '--accent-tint', hex: 'rgba(200,255,61,.08)', role: 'CTA hover wash', bg: 'bg-accent-tint' },
];

const contrast = [
  { fg: '--fg', bg: '--canvas', ratio: '14.7 : 1', verdict: 'AAA' },
  { fg: '--fg-muted', bg: '--canvas', ratio: '7.92 : 1', verdict: 'AAA' },
  { fg: '--fg-subtle', bg: '--canvas', ratio: '5.53 : 1', verdict: 'AA (body)' },
  { fg: '--fg-subtle', bg: '--surface', ratio: '5.33 : 1', verdict: 'AA (body)' },
  { fg: '--accent', bg: '--canvas', ratio: '16.4 : 1', verdict: 'AAA' },
  { fg: '--accent-strong', bg: '--canvas', ratio: '17.1 : 1', verdict: 'AAA' },
  { fg: '--accent-muted', bg: '--canvas', ratio: '2.14 : 1', verdict: 'Decorative borders only' },
];

export function ColorBand() {
  return (
    <section id="color" aria-labelledby="color-h" className="py-8 border-t border-rule">
      <SectionHead eyebrow="// 02 / how the page is colored" title="Color tokens" id="color-h" />
      <Text variant="body" className="text-fg-muted max-w-prose-wide">
        Eleven colors total. Near-black canvas, off-white text scale in three contrast steps,
        a four-stop lime accent family, two grey hairlines. No semantic warning / success
        palette — the site has no state machinery that needs them.
      </Text>

      <ul className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 list-none p-0">
        { swatches.map((s) => (
          <li key={s.name} className="flex gap-4 border border-rule p-4">
            <span aria-hidden="true" className={`size-12 shrink-0 border border-rule ${s.bg}`} />
            <div className="flex flex-col gap-1 min-w-0">
              <Text variant="meta" as="span" className="font-mono text-fg">{ s.name }</Text>
              <Text variant="micro" as="span" className="font-mono text-fg-subtle">{ s.hex }</Text>
              <Text variant="micro" as="span" className="text-fg-muted">{ s.role }</Text>
            </div>
          </li>
        )) }
      </ul>

      <Text variant="h3" as="h3" className="mt-12 text-fg">Contrast matrix</Text>
      <Text variant="body" className="text-fg-muted max-w-prose-wide mt-2">
        WCAG 2.2 AA throughout for body and UI text. Ratios computed against the
        actual hex pairs at body size; large-text exemptions are not used because the
        body size is small enough that the AA-body floor is the operative one everywhere.
      </Text>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-left border border-rule border-collapse">
          <thead>
            <tr>
              <th className="p-3 border-b border-rule text-fg-subtle font-mono text-meta font-medium uppercase tracking-eyebrow">Foreground</th>
              <th className="p-3 border-b border-rule text-fg-subtle font-mono text-meta font-medium uppercase tracking-eyebrow">Background</th>
              <th className="p-3 border-b border-rule text-fg-subtle font-mono text-meta font-medium uppercase tracking-eyebrow">Ratio</th>
              <th className="p-3 border-b border-rule text-fg-subtle font-mono text-meta font-medium uppercase tracking-eyebrow">Verdict</th>
            </tr>
          </thead>
          <tbody>
            { contrast.map((row) => (
              <tr key={`${row.fg}-${row.bg}`} className="border-b border-rule last:border-b-0">
                <td className="p-3 font-mono text-fg-muted">{ row.fg }</td>
                <td className="p-3 font-mono text-fg-muted">{ row.bg }</td>
                <td className="p-3 font-mono text-fg">{ row.ratio }</td>
                <td className="p-3 font-mono text-accent font-semibold">{ row.verdict }</td>
              </tr>
            )) }
          </tbody>
        </table>
      </div>
    </section>
  );
}
