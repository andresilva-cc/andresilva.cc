import { Text } from '@/components/text';
import { SectionHead } from '@/components/section-head';

const spacingScale = [
  { token: 'gap-1 / p-1', px: '4px', barClass: 'w-1' },
  { token: 'gap-2 / p-2', px: '8px', barClass: 'w-2' },
  { token: 'gap-3 / p-3', px: '12px', barClass: 'w-3' },
  { token: 'gap-4 / p-4', px: '16px', barClass: 'w-4' },
  { token: 'gap-5 / p-5', px: '20px', barClass: 'w-5' },
  { token: 'gap-6 / p-6', px: '24px', barClass: 'w-6' },
  { token: 'gap-8 / p-8', px: '32px', barClass: 'w-8' },
  { token: 'gap-10 / p-10', px: '40px', barClass: 'w-10' },
  { token: 'gap-12 / p-12', px: '48px', barClass: 'w-12' },
  { token: 'gap-16 / p-16', px: '64px', barClass: 'w-16' },
  { token: 'gap-20 / p-20', px: '80px', barClass: 'w-20' },
];

const proseWidths = [
  {
    token: 'max-w-prose-narrow',
    value: '56ch',
    label: 'Hero pitch, education descriptions — tight column for short bursts.',
  },
  {
    token: 'max-w-prose-wide',
    value: '68ch',
    label: 'Body prose — bio, role bullets, article descriptions, chip strips.',
  },
  {
    token: 'max-w-prose-card',
    value: '38ch',
    label: 'Project card descriptions — narrower because three cards share a row.',
  },
];

const componentSizing = [
  {
    token: 'py-0.5 px-2 (tag padding)',
    value: '2px top/bottom, 8px left/right',
    consumer: 'Vertical padding on <Tag> chips',
  },
  {
    token: 'min-w-22 (badge clearance)',
    value: '~88px',
    consumer: 'padding-right on featured <ProjectCard> title so the FEATURED badge in the top-right corner clears the title text.',
  },
  {
    token: 'grid-cols-role (183px 1fr)',
    value: '183px',
    consumer: '<RoleCard> left-column width — the minimum that keeps every date string (apr 2025 — now, mar 2017 — dec 2018) on a single line.',
  },
];

export function SpacingBand() {
  return (
    <section id="spacing" aria-labelledby="spacing-h" className="py-8 border-b border-rule">
      <SectionHead eyebrow="// 04 / how things breathe" title="Spacing" id="spacing-h" />
      <Text variant="body" className="text-fg-muted max-w-prose-wide">
        A 4px base. Eleven tokens covering tight icon gaps through major layout breaks. Proximity
        signals grouping — adjacent elements with shared meaning sit one or two steps apart;
        unrelated elements bracket themselves with
        {' '}
        <code className="text-accent">gap-5</code>
        {' '}
        or
        larger. The scale is non-linear (1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20) so jumps feel
        deliberate rather than mathematically halved.
      </Text>

      <Text variant="h3" as="h3" className="mt-8 mb-3 text-fg">Scale</Text>
      <div className="mt-4">
        {spacingScale.map((s) => (
          // grid-cols-[90px_64px_1fr] — design-system-page-only demo layout; not worth a token for one-off scale rows.
          <div
            key={s.token}
            className="grid grid-cols-[90px_64px_1fr] gap-4 py-3 border-b border-rule last:border-b-0 items-center"
          >
            <span className="text-meta font-mono font-semibold text-accent">{s.token}</span>
            <span className="text-meta font-mono font-medium text-fg text-right">{s.px}</span>
            {/* shadow-[0_0_0_1px_var(--color-accent-muted)] — design-system-page-only demo bar decoration; not worth a token for one-off scale visualization. */}
            <div
              aria-hidden="true"
              className={`h-3.5 bg-accent shadow-[0_0_0_1px_var(--color-accent-muted)] ${s.barClass}`}
            />
          </div>
        ))}
      </div>

      <Text variant="h3" as="h3" className="mt-8 mb-3 text-fg">Spacing principles</Text>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-left border border-rule border-collapse">
          <thead>
            <tr>
              <th className="py-3 px-4 border-b border-rule bg-surface text-fg-subtle font-mono text-micro font-semibold uppercase tracking-eyebrow">Rule</th>
              <th className="py-3 px-4 border-b border-rule bg-surface text-fg-subtle font-mono text-micro font-semibold uppercase tracking-eyebrow">Where it shows up</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-rule last:border-b-0">
              <td className="py-3 px-4 text-meta text-fg align-top font-semibold">Proximity signals grouping.</td>
              <td className="py-3 px-4 text-meta text-fg-muted">
                <code className="text-accent">ArticleCard</code>
                {' '}
                title → desc uses
                {' '}
                <code className="text-accent">mt-2</code>
                {' '}
                (8px) because they are the closer-related pair;
                meta → title uses
                <code className="text-accent">mt-3</code>
                {' '}
                (12px). The rhythm is
                deliberate — the closer pair gets the tighter gap.
              </td>
            </tr>
            <tr className="border-b border-rule last:border-b-0">
              <td className="py-3 px-4 text-meta text-fg align-top font-semibold">Bands separate sections, padding separates content.</td>
              <td className="py-3 px-4 text-meta text-fg-muted">
                Each
                {' '}
                <code className="text-accent">&lt;section&gt;</code>
                {' '}
                uses
                <code className="text-accent">py-8</code>
                {' '}
                (32px) plus a 1px rule; inside the band, content groups use
                {' '}
                <code className="text-accent">gap-4 / gap-5</code>
                .
              </td>
            </tr>
            <tr className="border-b border-rule last:border-b-0">
              <td className="py-3 px-4 text-meta text-fg align-top font-semibold">No ambiguous spacing.</td>
              <td className="py-3 px-4 text-meta text-fg-muted">
                Never set the same margin between A→B and B→C if A and B should read as a group
                while C sits apart. Use a meaningfully larger token for the break.
              </td>
            </tr>
            <tr className="border-b border-rule last:border-b-0">
              <td className="py-3 px-4 text-meta text-fg align-top font-semibold">Tight is the default for the same component.</td>
              <td className="py-3 px-4 text-meta text-fg-muted">
                Chip-to-chip gap is
                {' '}
                <code className="text-accent">gap-1.5</code>
                {' '}
                (6px); chip-strip-to-bullet
                gap is
                {' '}
                <code className="text-accent">mt-4</code>
                {' '}
                (16px). Components compress; the gap to
                the next component expands.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <Text variant="h3" as="h3" className="mt-8 mb-3 text-fg">Prose widths</Text>
      <Text variant="body" className="text-fg-muted max-w-prose-wide mt-2">
        Three character-based widths cap the readable column without imposing a pixel measurement
        that breaks under user font-size overrides.
      </Text>
      <div className="mt-4 border border-rule p-4 flex flex-col gap-3">
        {proseWidths.map((w) => (
          <div key={w.token}>
            <Text variant="meta" as="div" className="font-mono font-semibold text-accent mb-1">
              {w.token}
              {' '}
              ·
              {w.value}
            </Text>
            <div
              aria-hidden="true"
              className="h-2.5 bg-accent-muted"
              style={{ maxWidth: '100%', width: w.value }}
            />
            <Text variant="micro" as="div" className="font-normal text-fg-subtle mt-1">{w.label}</Text>
          </div>
        ))}
      </div>

      <Text variant="h3" as="h3" className="mt-8 mb-3 text-fg">Component-sizing tokens</Text>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-left border border-rule border-collapse">
          <thead>
            <tr>
              <th className="py-3 px-4 border-b border-rule bg-surface text-fg-subtle font-mono text-micro font-semibold uppercase tracking-eyebrow">Token / Utility</th>
              <th className="py-3 px-4 border-b border-rule bg-surface text-fg-subtle font-mono text-micro font-semibold uppercase tracking-eyebrow">Value</th>
              <th className="py-3 px-4 border-b border-rule bg-surface text-fg-subtle font-mono text-micro font-semibold uppercase tracking-eyebrow">Consumer</th>
            </tr>
          </thead>
          <tbody>
            {componentSizing.map((c) => (
              <tr key={c.token} className="border-b border-rule last:border-b-0">
                <td className="py-3 px-4 font-mono text-meta"><code className="text-accent">{c.token}</code></td>
                <td className="py-3 px-4 font-mono text-meta text-fg">{c.value}</td>
                <td className="py-3 px-4 text-meta text-fg-muted">{c.consumer}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
