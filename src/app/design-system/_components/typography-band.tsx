import { Text } from '@/components/text';
import { SectionHead } from '@/components/section-head';

const fontFamilies = [
  { token: '--font-mono', stack: 'JetBrains Mono → ui-monospace → SFMono-Regular → Menlo → Consolas → monospace', role: 'Body, UI, code' },
  { token: '--font-display', stack: 'VT323 → JetBrains Mono → ui-monospace → monospace', role: 'Pixel display headings' },
];

const typeScale = [
  { token: '--text-display', size: '56px', face: 'VT323 / 400', leading: '1.10', used: 'Home hero name' },
  { token: '--text-h1', size: '28px', face: 'VT323 / 400', leading: '1.10', used: 'Page-head title' },
  { token: '--text-h2', size: '18px', face: 'Mono / 600', leading: '1.30', used: 'Section heads' },
  { token: '--text-h3', size: '16px', face: 'Mono / 600', leading: '1.30', used: 'Card titles, role titles' },
  { token: '--text-body', size: '14px', face: 'Mono / 400', leading: '1.65', used: 'Body prose, bullets' },
  { token: '--text-meta', size: '12px', face: 'Mono / 500', leading: '1.55', used: 'Meta lines, chip text, nav' },
  { token: '--text-micro', size: '11px', face: 'Mono / 600', leading: '1.50', used: 'Eyebrows, badges, footer' },
];

export function TypographyBand() {
  return (
    <section id="typography" aria-labelledby="type-h" className="py-8 border-t border-rule">
      <SectionHead eyebrow="// 03 / how the words look" title="Typography" id="type-h" />
      <Text variant="body" className="text-fg-muted max-w-prose-wide">
        Two faces, three weights, seven sizes. JetBrains Mono carries everything except
        the identity moment per page, where VT323 — a pixel-display face — takes over.
      </Text>

      <Text variant="h3" as="h3" className="mt-10 text-fg">Font stack</Text>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-left border border-rule border-collapse">
          <thead>
            <tr>
              <th className="p-3 border-b border-rule text-fg-subtle font-mono text-meta font-medium uppercase tracking-eyebrow">Token</th>
              <th className="p-3 border-b border-rule text-fg-subtle font-mono text-meta font-medium uppercase tracking-eyebrow">Stack</th>
              <th className="p-3 border-b border-rule text-fg-subtle font-mono text-meta font-medium uppercase tracking-eyebrow">Role</th>
            </tr>
          </thead>
          <tbody>
            { fontFamilies.map((f) => (
              <tr key={f.token} className="border-b border-rule last:border-b-0">
                <td className="p-3 font-mono text-fg">{ f.token }</td>
                <td className="p-3 font-mono text-fg-muted">{ f.stack }</td>
                <td className="p-3 text-fg-muted">{ f.role }</td>
              </tr>
            )) }
          </tbody>
        </table>
      </div>

      <Text variant="h3" as="h3" className="mt-10 text-fg">Type scale</Text>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-left border border-rule border-collapse">
          <thead>
            <tr>
              <th className="p-3 border-b border-rule text-fg-subtle font-mono text-meta font-medium uppercase tracking-eyebrow">Token</th>
              <th className="p-3 border-b border-rule text-fg-subtle font-mono text-meta font-medium uppercase tracking-eyebrow">Size</th>
              <th className="p-3 border-b border-rule text-fg-subtle font-mono text-meta font-medium uppercase tracking-eyebrow">Face / Weight</th>
              <th className="p-3 border-b border-rule text-fg-subtle font-mono text-meta font-medium uppercase tracking-eyebrow">Line-height</th>
              <th className="p-3 border-b border-rule text-fg-subtle font-mono text-meta font-medium uppercase tracking-eyebrow">Used for</th>
            </tr>
          </thead>
          <tbody>
            { typeScale.map((t) => (
              <tr key={t.token} className="border-b border-rule last:border-b-0">
                <td className="p-3 font-mono text-fg">{ t.token }</td>
                <td className="p-3 font-mono text-fg-muted">{ t.size }</td>
                <td className="p-3 font-mono text-fg-muted">{ t.face }</td>
                <td className="p-3 font-mono text-fg-muted">{ t.leading }</td>
                <td className="p-3 text-fg-muted">{ t.used }</td>
              </tr>
            )) }
          </tbody>
        </table>
      </div>

      <Text variant="h3" as="h3" className="mt-10 text-fg">Live samples</Text>
      <div className="mt-4 flex flex-col gap-4 border border-rule p-6">
        <Text variant="display">Display 56px</Text>
        <Text variant="h1">H1 28px</Text>
        <Text variant="h2">H2 18px</Text>
        <Text variant="h3">H3 16px</Text>
        <Text variant="body">Body 14px — the prose track. Sentences read at their natural rhythm.</Text>
        <Text variant="meta">Meta 12px — chip text, nav items, dates.</Text>
        <Text variant="micro" className="uppercase tracking-eyebrow text-accent">Micro 11px — eyebrows & badges</Text>
      </div>
    </section>
  );
}
