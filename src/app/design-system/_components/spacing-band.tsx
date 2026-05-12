import { Text } from '@/components/text';
import { SectionHead } from '@/components/section-head';

const spacingScale = [
  { token: '1', px: '4px', use: 'Glyph-tight gaps', barClass: 'w-1' },
  { token: '2', px: '8px', use: 'Inline gaps; chip padding-x', barClass: 'w-2' },
  { token: '3', px: '12px', use: 'Tight gaps; nav padding-x', barClass: 'w-3' },
  { token: '4', px: '16px', use: 'Cell padding; standard gap', barClass: 'w-4' },
  { token: '5', px: '20px', use: 'Section margin-bottom; CTA padding-x', barClass: 'w-5' },
  { token: '6', px: '24px', use: 'Card-internal vertical spacing', barClass: 'w-6' },
  { token: '8', px: '32px', use: 'Shell horizontal padding; section padding', barClass: 'w-8' },
  { token: '10', px: '40px', use: 'Section padding (wider variant)', barClass: 'w-10' },
  { token: '12', px: '48px', use: 'Page-head bottom padding', barClass: 'w-12' },
  { token: '16', px: '64px', use: 'Hero top padding', barClass: 'w-16' },
  { token: '20', px: '80px', use: 'Display-scale gaps', barClass: 'w-20' },
];

const proseWidths = [
  { token: '--max-width-prose-narrow', value: '56ch', used: 'Hero pitch, narrow descriptions' },
  { token: '--max-width-prose-wide', value: '68ch', used: 'Body prose — bio, role bullets, article descriptions' },
  { token: '--max-width-prose-card', value: '38ch', used: 'Project card descriptions (3 cards per row)' },
];

export function SpacingBand() {
  return (
    <section id="spacing" aria-labelledby="spacing-h" className="py-12 md:py-16 border-t border-rule">
      <SectionHead eyebrow="// 04 / how things breathe" title="Spacing" id="spacing-h" />
      <Text variant="body" className="text-fg-muted max-w-prose-wide">
        A 4px base. Non-linear so jumps feel deliberate: 4 / 8 / 12 / 16 / 20 / 24 / 32 / 40 /
        48 / 64 / 80. The scale matches Tailwind v4’s default 4px step exactly, so no
        custom spacing tokens are registered — components consume Tailwind’s defaults directly.
      </Text>

      <Text variant="h3" as="h3" className="mt-10 text-fg">Scale</Text>
      <ul className="mt-4 flex flex-col gap-2 list-none p-0">
        { spacingScale.map((s) => (
          <li key={s.token} className="flex items-center gap-4">
            <Text variant="meta" as="span" className="w-16 shrink-0 font-mono text-fg">
              {`p-${s.token}`}
            </Text>
            <Text variant="meta" as="span" className="w-16 shrink-0 font-mono text-fg-subtle">
              { s.px }
            </Text>
            <div aria-hidden="true" className={`h-3 bg-accent shrink-0 ${s.barClass}`} />
            <Text variant="meta" as="span" className="text-fg-muted">{ s.use }</Text>
          </li>
        )) }
      </ul>

      <Text variant="h3" as="h3" className="mt-10 text-fg">Prose widths</Text>
      <Text variant="body" className="text-fg-muted max-w-prose-wide mt-2">
        Cap readable columns in ch units (not pixels) so the widths survive user
        font-size overrides.
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
            { proseWidths.map((w) => (
              <tr key={w.token} className="border-b border-rule last:border-b-0">
                <td className="p-3 font-mono text-fg">{ w.token }</td>
                <td className="p-3 font-mono text-fg-muted">{ w.value }</td>
                <td className="p-3 text-fg-muted">{ w.used }</td>
              </tr>
            )) }
          </tbody>
        </table>
      </div>
    </section>
  );
}
