import { Text } from '@/components/text';
import { SectionHead } from '@/components/section-head';

const motion = [
  { token: '--ease-out', value: 'cubic-bezier(0, 0, 0.2, 1)', role: 'Enter motion, hover transitions, press release' },
  { token: '--ease-in', value: 'cubic-bezier(0.4, 0, 1, 1)', role: 'Exits (reserved; mirrored for parity)' },
  { token: '--duration-fast', value: '120ms', role: 'Default hover / press feedback' },
  { token: 'duration-200 (built-in)', value: '200ms', role: 'Compound transitions' },
];

const rules = [
  {
    rule: 'Animate only transform and opacity.',
    why: 'Both run on the compositor thread; animating background-color forces layout/paint. The Latest row hover swaps a ::before overlay’s opacity, not the row’s background.',
  },
  {
    rule: 'Active / press feedback is scale(0.97).',
    why: 'Tactile micro-press without changing the press target’s footprint enough to break adjacent layout. On .row, the scale targets .row__body so the trailing CTA stays anchored as a fixed locator.',
  },
  {
    rule: 'Enter uses ease-out; exit uses ease-in.',
    why: 'Natural readback: enter decelerates into place, exit accelerates away. Matches platform convention.',
  },
  {
    rule: 'Respect prefers-reduced-motion.',
    why: 'Global override zeros animation- and transition-duration to 0.01ms; press-scale rules are additionally gated with @media (prefers-reduced-motion: no-preference). The hero plasma renders one static frame instead of looping.',
  },
  {
    rule: 'Hover effects are gated by hover: hover.',
    why: 'Touch devices don’t resolve hover meaningfully; gating prevents sticky-hover artifacts on tap. Tailwind v4’s hover: variant auto-gates by default.',
  },
];

export function MotionBand() {
  return (
    <section id="motion" aria-labelledby="motion-h" className="py-12 md:py-16 border-t border-rule">
      <SectionHead eyebrow="// 05 / how things move" title="Motion" id="motion-h" />
      <Text variant="body" className="text-fg-muted max-w-prose-wide">
        Two easing curves, two durations. Motion is a subtle layer here — confirming hover,
        acknowledging press, and letting the hero plasma drift. The rest is still.
      </Text>

      <Text variant="h3" as="h3" className="mt-10 text-fg">Tokens</Text>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-left border border-rule border-collapse">
          <thead>
            <tr>
              <th className="p-3 border-b border-rule text-fg-subtle font-mono text-meta font-medium uppercase tracking-eyebrow">Token</th>
              <th className="p-3 border-b border-rule text-fg-subtle font-mono text-meta font-medium uppercase tracking-eyebrow">Value</th>
              <th className="p-3 border-b border-rule text-fg-subtle font-mono text-meta font-medium uppercase tracking-eyebrow">Role</th>
            </tr>
          </thead>
          <tbody>
            { motion.map((m) => (
              <tr key={m.token} className="border-b border-rule last:border-b-0">
                <td className="p-3 font-mono text-fg">{ m.token }</td>
                <td className="p-3 font-mono text-fg-muted">{ m.value }</td>
                <td className="p-3 text-fg-muted">{ m.role }</td>
              </tr>
            )) }
          </tbody>
        </table>
      </div>

      <Text variant="h3" as="h3" className="mt-10 text-fg">Standing rules</Text>
      <ul className="mt-4 flex flex-col gap-4 list-none p-0">
        { rules.map((r) => (
          <li key={r.rule} className="max-w-prose-wide">
            <Text variant="h3" as="p" className="text-fg m-0">{ r.rule }</Text>
            <Text variant="body" className="text-fg-muted m-0 mt-2">{ r.why }</Text>
          </li>
        )) }
      </ul>
    </section>
  );
}
