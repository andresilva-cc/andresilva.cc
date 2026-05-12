import { Text } from '@/components/text';
import { SectionHead } from '@/components/section-head';

const principles = [
  {
    title: 'Accent lands on the surface’s primary noun.',
    body: 'Home hero is an identity statement, so the position carries --accent. Career list is a comparative timeline, so the company carries --accent. The rule is single and global; only the referent changes per surface.',
  },
  {
    title: 'Chip hover is texture, not affordance.',
    body: 'Tag chips brighten their border by one step on hover — no fill, no underline. Chips are labels for the eye, not click targets. The hover only acknowledges where the cursor is.',
  },
  {
    title: 'Card lists are <ul>/<li>; card titles are non-heading elements.',
    body: 'Project / role / article cards are list items; their titles are <p>, not <h3>. The page outline reads as one H1 → many list items rather than a fractured heading tree.',
  },
  {
    title: 'Card lists use <li class="card-class"> directly. No inner <article>.',
    body: 'One landmark per visual card. The <li> is the entire affordance and the entire region — no nested wrappers introducing a second screen-reader landmark.',
  },
  {
    title: 'Tabular figures are unnecessary in monospace stacks.',
    body: 'JetBrains Mono and VT323 are fixed-width by construction. font-variant-numeric: tabular-nums and the tnum OpenType feature are no-ops here; do not declare them.',
  },
  {
    title: ':root token blocks are canonical mirrors across all 5 pages.',
    body: 'No shared stylesheet. The same :root declarations appear byte-identical on every page; tokens not consumed on a page are kept for parity, not pruned.',
  },
  {
    title: '.sec-head--flush zeros both margin-bottom and border-bottom.',
    body: 'Prevents a doubled 2px line where the next element (like a grid-frame) already provides a top rule. The flush variant is the seam-fix, not a stylistic alternative.',
  },
  {
    title: '--photo-filter-soft is mathematically derived from --photo-filter.',
    body: 'Same hue-rotate, halved sepia and saturate. Re-derive both together — the soft variant is the touch-device fallback when hover-to-reveal is unreachable.',
  },
  {
    title: 'Prose uses curly quotes and apostrophes.',
    body: 'U+2019 for apostrophes, U+201C / U+201D for double quotes. Straight ASCII apostrophes and quotes are reserved for HTML attributes, CSS strings, and code blocks.',
  },
];

export function PrinciplesBand() {
  return (
    <section id="principles" aria-labelledby="principles-h" className="py-8 border-t border-rule">
      <SectionHead eyebrow="// 01 / what we won’t compromise on" title="Design principles" id="principles-h" />
      <Text variant="body" className="text-fg-muted max-w-prose-wide">
        Nine rules. Each one is load-bearing — removing it would compromise either consistency,
        accessibility, or affordance hygiene. They override local taste.
      </Text>
      <ol className="mt-8 flex flex-col gap-6 list-none p-0">
        { principles.map((p, i) => (
          <li key={p.title} className="flex gap-4 max-w-prose-wide">
            <Text variant="micro" as="span" className="w-12 shrink-0 uppercase tracking-eyebrow text-accent">
              { String(i + 1).padStart(2, '0') }
            </Text>
            <div>
              <Text variant="h3" as="p" className="text-fg m-0">{ p.title }</Text>
              <Text variant="body" className="text-fg-muted m-0 mt-2">{ p.body }</Text>
            </div>
          </li>
        )) }
      </ol>
    </section>
  );
}
