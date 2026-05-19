import { Text } from '@/components/text';
import { SectionHead } from '@/components/section-head';
import { Button } from '@/components/button';

const motionTiles = [
  {
    token: '--ease-out',
    value: 'cubic-bezier(0, 0, 0.2, 1)',
    desc: 'Enter motion. Used for every hover transition, the <ArrowLink> arrow nudge, and the press release.',
    animClass: 'motion-safe:animate-[motion-slide_1.6s_cubic-bezier(0,0,0.2,1)_infinite_alternate]',
  },
  {
    token: '--ease-in',
    value: 'cubic-bezier(0.4, 0, 1, 1)',
    desc: 'Reserved for exits. No current page consumer — kept across all 5 token blocks for parity (principle 06).',
    animClass: 'motion-safe:animate-[motion-slide_1.6s_cubic-bezier(0.4,0,1,1)_infinite_alternate]',
  },
  {
    token: 'duration-fast',
    value: '120ms',
    desc: 'Default for hover state changes, color transitions, and press feedback.',
    animClass: 'motion-safe:animate-[motion-slide_120ms_cubic-bezier(0,0,0.2,1)_infinite_alternate]',
  },
  {
    token: 'duration-200 (built-in)',
    value: '200ms',
    desc: 'Reserved for compound transitions and larger property crossfades.',
    animClass: 'motion-safe:animate-[motion-slide_200ms_cubic-bezier(0,0,0.2,1)_infinite_alternate]',
  },
];

const standingRules = [
  {
    rule: 'Animate only transform and opacity.',
    why: 'Both run on the compositor thread; animating background-color forces layout/paint. The <LatestRow> hover swaps a ::before overlay\'s opacity, not the row\'s background.',
  },
  {
    rule: 'Active/press feedback is scale(0.97).',
    why: 'Tactile micro-press without changing the press target\'s footprint enough to break adjacent layout. Exception: on <LatestRow>, the scale targets the row body rather than the anchor itself — the trailing arrow CTA stays anchored as a fixed locator while the bulk content compresses, keeping the ::before hover overlay stable.',
  },
  {
    rule: 'Enter uses ease-out; exit uses ease-in.',
    why: 'Natural readback: enter decelerates into place, exit accelerates away. Matches platform convention.',
  },
  {
    rule: 'Respect prefers-reduced-motion.',
    why: 'Global override zeros animation- and transition-duration to 0.01ms; press-scale rules are additionally gated with motion-safe:. The hero plasma renders one static frame instead of looping.',
  },
  {
    rule: 'Hover effects are gated by hover: hover.',
    why: 'Touch devices don\'t resolve hover meaningfully; gating prevents sticky-hover artifacts on tap. Tailwind v4\'s hover: variant auto-gates by default.',
  },
];

export function MotionBand() {
  return (
    <section id="motion" aria-labelledby="motion-h" className="py-8 border-b border-rule">
      <SectionHead eyebrow="// 05 / how things move" title="Motion" id="motion-h" />
      <Text variant="body" className="text-fg-muted max-w-prose-wide">
        Two easing curves, two durations. Animate only
        {' '}
        <strong>transform</strong>
        {' '}
        and
        {' '}
        <strong>opacity</strong>
        . Press feedback is a 0.97 micro-scale; enter motion uses
        ease-out, exit motion uses ease-in. Every animated rule is gated by
        {' '}
        <code className="text-accent">prefers-reduced-motion</code>
        .
      </Text>

      <Text variant="h3" as="h3" className="mt-8 mb-3 text-fg">Easing &amp; duration tokens</Text>
      <style>
        {`
        @keyframes motion-slide {
          from { transform: translateX(0); }
          to   { transform: translateX(160px); }
        }
      `}
      </style>
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {motionTiles.map((t) => (
          <div key={t.token} className="border border-rule p-5">
            <div className="text-meta font-mono font-semibold text-accent">{t.token}</div>
            <div className="text-micro font-mono uppercase tracking-eyebrow text-fg-subtle mt-1">{t.value}</div>
            <Text variant="body" className="text-fg-muted m-0 mt-3">{t.desc}</Text>
            <div
              aria-hidden="true"
              className={`size-14 bg-accent mt-3 ${t.animClass}`}
            />
          </div>
        ))}
      </div>

      <Text variant="h3" as="h3" className="mt-8 mb-3 text-fg">Press feedback (live demo)</Text>
      <div className="mt-4 border border-rule p-5">
        <Text variant="body" className="text-fg-muted m-0 mb-3">
          Click and hold the button. The
          {' '}
          <code className="text-accent">scale(0.97)</code>
          {' '}
          compresses
          on press and releases on lift — gated by
          {' '}
          <code className="text-accent">motion-safe:</code>
          .
        </Text>
        <Button type="button">
          Press me →
        </Button>
      </div>

      <Text variant="h3" as="h3" className="mt-8 mb-3 text-fg">Standing rules</Text>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-left border border-rule border-collapse">
          <thead>
            <tr>
              <th className="py-3 px-4 border-b border-rule bg-surface text-fg-subtle font-mono text-micro font-semibold uppercase tracking-eyebrow">Rule</th>
              <th className="py-3 px-4 border-b border-rule bg-surface text-fg-subtle font-mono text-micro font-semibold uppercase tracking-eyebrow">Why</th>
            </tr>
          </thead>
          <tbody>
            {standingRules.map((r) => (
              <tr key={r.rule} className="border-b border-rule last:border-b-0">
                <td className="py-3 px-4 text-meta text-fg font-semibold align-top">{r.rule}</td>
                <td className="py-3 px-4 text-meta text-fg-muted">{r.why}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
