import { Text } from '@/components/text';
import { SectionHead } from '@/components/section-head';

const fontFamilies = [
  {
    token: '--font-mono',
    role: 'Body, UI, code',
    stack: '\'JetBrains Mono\', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
  },
  {
    token: '--font-display',
    role: 'Pixel display headings, page-head H1',
    stack: '\'VT323\', \'JetBrains Mono\', ui-monospace, monospace',
  },
];

const typeScale = [
  {
    token: 'text-display',
    size: '56px · VT323 · lh 1.10',
    sampleClass: 'text-display font-display text-accent',
    sample: 'André Silva',
  },
  {
    token: 'text-h1',
    size: '28px · VT323 · lh 1.10',
    sampleClass: 'text-h1 font-display text-accent',
    sample: '<ABOUT />',
  },
  {
    token: 'text-h2',
    size: '18px · mono 600 · lh 1.30',
    sampleClass: 'text-h2 font-mono font-semibold text-fg',
    sample: 'Latest',
  },
  {
    token: 'text-h3',
    size: '16px · mono 600 · lh 1.30',
    sampleClass: 'text-h3 font-mono font-semibold text-fg',
    sample: 'Senior Engineer @ MPA',
  },
  {
    token: 'text-body',
    size: '14px · mono 400 · lh 1.65',
    sampleClass: 'text-body font-mono text-fg-muted',
    sample: 'Software engineer with 9+ years of experience building web platforms, internal tools, and developer tooling.',
  },
  {
    token: 'text-meta',
    size: '12px · mono 500 · lh 1.55',
    sampleClass: 'text-meta font-mono font-medium text-fg-muted',
    sample: '2025.02.13 · 4 min · 11 ♥',
  },
  {
    token: 'text-micro',
    size: '11px · mono 600 · lh 1.50',
    sampleClass: 'text-micro font-mono font-semibold text-accent uppercase tracking-eyebrow',
    sample: '// 01 / current focus',
  },
];

const weights = [
  { weight: '400', label: '400 · regular', role: 'body prose', sampleClass: 'font-normal' },
  { weight: '500', label: '500 · medium', role: 'meta · chip text · nav', sampleClass: 'font-medium' },
  { weight: '600', label: '600 · semibold', role: 'headings · emphasis · CTAs', sampleClass: 'font-semibold' },
];

export function TypographyBand() {
  return (
    <section id="typography" aria-labelledby="type-h" className="py-8 border-b border-rule">
      <SectionHead eyebrow="// 03 / how the words look" title="Typography" id="type-h" />
      <Text variant="body" className="text-fg-muted max-w-prose-wide">
        Two faces, both fixed-width.
        {' '}
        <strong>JetBrains Mono</strong>
        {' '}
        carries the prose and UI;
        {' '}
        <strong>VT323</strong>
        {' '}
        carries the display headings — pixel-display character that signals
        the brutalist register at first glance. The site is mono-typed end to end; there is no
        sans companion.
      </Text>

      <Text variant="h3" as="h3" className="mt-8 mb-3 text-fg">Font stack</Text>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-left border border-rule border-collapse" aria-label="Font stack">
          <thead>
            <tr>
              <th className="py-3 px-4 border-b border-rule bg-surface text-fg-subtle font-mono text-micro font-semibold uppercase tracking-eyebrow">Token</th>
              <th className="py-3 px-4 border-b border-rule bg-surface text-fg-subtle font-mono text-micro font-semibold uppercase tracking-eyebrow">Role</th>
              <th className="py-3 px-4 border-b border-rule bg-surface text-fg-subtle font-mono text-micro font-semibold uppercase tracking-eyebrow">Stack</th>
            </tr>
          </thead>
          <tbody>
            {fontFamilies.map((f) => (
              <tr key={f.token} className="border-b border-rule last:border-b-0">
                <td className="py-3 px-4 font-mono text-meta"><code className="text-accent">{f.token}</code></td>
                <td className="py-3 px-4 text-meta text-fg-muted">{f.role}</td>
                <td className="py-3 px-4 font-mono text-meta text-fg">{f.stack}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Text variant="h3" as="h3" className="mt-8 mb-3 text-fg">Type scale</Text>
      <div className="mt-4">
        {typeScale.map((t) => (
          // grid-cols-[200px_1fr] — design-system-page-only demo layout; not worth a token for one-off type-scale rows.
          <div
            key={t.token}
            className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6 py-5 border-b border-rule last:border-b-0 items-baseline"
          >
            <div className="flex flex-col gap-1">
              <span className="text-meta font-mono font-semibold text-accent">{t.token}</span>
              <span className="text-micro font-mono font-normal uppercase tracking-eyebrow text-fg-subtle">{t.size}</span>
            </div>
            <div className="min-w-0">
              <span className={t.sampleClass}>{t.sample}</span>
            </div>
          </div>
        ))}
      </div>

      <Text variant="h3" as="h3" className="mt-8 mb-3 text-fg">Weights</Text>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        {weights.map((w) => (
          <div key={w.weight} className="border border-rule p-5">
            {/* 36px is design-system-page-only — sits between text-h1 (28px) and text-display (56px); not worth a token for one-off weight specimens. */}
            <div className={`text-fg font-mono text-[36px] leading-[1.1] mb-3 ${w.sampleClass}`}>
              Aa Bb 09
            </div>
            <div className="text-meta font-mono font-semibold text-accent">{w.label}</div>
            <div className="text-micro font-mono uppercase tracking-eyebrow text-fg-subtle mt-1">{w.role}</div>
          </div>
        ))}
      </div>

      <Text variant="h3" as="h3" className="mt-8 mb-3 text-fg">Mono vs display deployment</Text>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-left border border-rule border-collapse" aria-label="Mono vs display rules">
          <thead>
            <tr>
              <th className="py-3 px-4 border-b border-rule bg-surface text-fg-subtle font-mono text-micro font-semibold uppercase tracking-eyebrow">
                Use
                {' '}
                <code className="text-accent">font-display</code>
                {' '}
                (VT323) for
              </th>
              <th className="py-3 px-4 border-b border-rule bg-surface text-fg-subtle font-mono text-micro font-semibold uppercase tracking-eyebrow">
                Use
                {' '}
                <code className="text-accent">font-mono</code>
                {' '}
                (JetBrains Mono) for
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="py-3 px-4 text-meta text-fg-muted align-top">
                Home hero name (
                <code className="text-accent">&lt;Text variant=&quot;display&quot;&gt;</code>
                {' '}
                André Silva)
                <br />
                Page-head H1 (
                <code className="text-accent">&lt;ABOUT /&gt;</code>
                )
                <br />
                Pixel ornament · brace glyphs
                <br />
                Cover stat values
              </td>
              <td className="py-3 px-4 text-meta text-fg-muted align-top">
                Every other heading (H2, H3)
                <br />
                Body prose, bullets, chip text
                <br />
                Eyebrows, badges, footer
                <br />
                All UI text (buttons, nav, meta)
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <Text variant="body" className="text-fg-muted max-w-prose-wide mt-4">
        Rule of thumb: VT323 marks the
        {' '}
        <strong>identity moment</strong>
        {' '}
        on a page (the noun the
        page is about); JetBrains Mono carries everything else. VT323 is never used inside body prose.
      </Text>

      <Text variant="h3" as="h3" className="mt-8 mb-3 text-fg">Article prose hygiene</Text>
      <Text variant="body" className="text-fg-muted max-w-prose-wide mt-2">
        Three typographic rules scoped to
        {' '}
        <code className="text-accent">.article-prose</code>
        {' '}
        (applied via the wrapper div in
        {' '}
        <code className="text-accent">/articles/[slug]</code>
        ):
      </Text>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-left border border-rule border-collapse" aria-label="Article prose typographic rules">
          <thead>
            <tr>
              <th className="py-3 px-4 border-b border-rule bg-surface text-fg-subtle font-mono text-micro font-semibold uppercase tracking-eyebrow">Rule</th>
              <th className="py-3 px-4 border-b border-rule bg-surface text-fg-subtle font-mono text-micro font-semibold uppercase tracking-eyebrow">Applied to</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-rule last:border-b-0">
              <td className="py-3 px-4 font-mono text-meta text-fg-muted align-top">
                <code className="text-accent">text-wrap: balance</code>
              </td>
              <td className="py-3 px-4 text-meta text-fg-muted">
                All
                {' '}
                <code className="text-accent">h2</code>
                {' '}
                headings &mdash; prevents ragged single-word final lines in section titles.
              </td>
            </tr>
            <tr className="border-b border-rule last:border-b-0">
              <td className="py-3 px-4 font-mono text-meta text-fg-muted align-top">
                <code className="text-accent">text-wrap: pretty</code>
              </td>
              <td className="py-3 px-4 text-meta text-fg-muted">
                Last paragraph of the article and any paragraph immediately before an
                {' '}
                <code className="text-accent">h2</code>
                {' '}
                or
                {' '}
                <code className="text-accent">h3</code>
                {' '}
                &mdash; scoped to end-of-section positions to avoid performance cost across the whole body.
              </td>
            </tr>
            <tr className="border-b border-rule last:border-b-0">
              <td className="py-3 px-4 font-mono text-meta text-fg-muted align-top">
                <code className="text-accent">font-feature-settings: &quot;tnum&quot;, &quot;zero&quot;</code>
              </td>
              <td className="py-3 px-4 text-meta text-fg-muted">
                Tables &mdash; tabular figures align numeric columns; slashed zero prevents 0/O ambiguity in data cells.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <Text variant="h3" as="h3" className="mt-8 mb-3 text-fg">Quotes &amp; apostrophes (standing rule)</Text>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-left border border-rule border-collapse" aria-label="Quote conventions">
          <thead>
            <tr>
              <th className="py-3 px-4 border-b border-rule bg-surface text-fg-subtle font-mono text-micro font-semibold uppercase tracking-eyebrow">Context</th>
              <th className="py-3 px-4 border-b border-rule bg-surface text-fg-subtle font-mono text-micro font-semibold uppercase tracking-eyebrow">Use</th>
              <th className="py-3 px-4 border-b border-rule bg-surface text-fg-subtle font-mono text-micro font-semibold uppercase tracking-eyebrow">Example</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-rule last:border-b-0">
              <td className="py-3 px-4 text-meta text-fg-muted">User-facing prose — apostrophes</td>
              <td className="py-3 px-4 font-mono text-meta">
                <code className="text-accent">&#x2019;</code>
                {' '}
                (U+2019)
              </td>
              <td className="py-3 px-4 text-meta text-fg-muted">what i&#x2019;m doing now</td>
            </tr>
            <tr className="border-b border-rule last:border-b-0">
              <td className="py-3 px-4 text-meta text-fg-muted">User-facing prose — double quotes</td>
              <td className="py-3 px-4 font-mono text-meta"><code className="text-accent">&#x201C; &#x201D;</code></td>
              <td className="py-3 px-4 text-meta text-fg-muted">&#x201C;current role&#x201D;</td>
            </tr>
            <tr className="border-b border-rule last:border-b-0">
              <td className="py-3 px-4 text-meta text-fg-muted">HTML attributes, CSS strings, code, comments</td>
              <td className="py-3 px-4 font-mono text-meta">
                <code className="text-accent">&apos;</code>
                {' '}
                /
                {' '}
                <code className="text-accent">&quot;</code>
              </td>
              <td className="py-3 px-4 font-mono text-meta text-fg-muted">aria-label=&quot;current role&quot;</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}
