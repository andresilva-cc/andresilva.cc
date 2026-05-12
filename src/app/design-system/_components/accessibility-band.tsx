import { Text } from '@/components/text';
import { SectionHead } from '@/components/section-head';

const rules = [
  {
    rule: 'Skip link first, every page.',
    why: 'WCAG 2.4.1 (Bypass Blocks). Tabbing from the URL bar reveals the link at top-left; it jumps focus to #main.',
  },
  {
    rule: 'Focus indicator: 2px solid --accent, 2px offset, square corners.',
    why: 'Default browser outlines suppressed only where replaced. Never `outline: none` without a replacement.',
  },
  {
    rule: 'Touch targets ≥ 32×32 (WCAG 2.5.8 AA).',
    why: 'Nav links and CTAs use min-h-8 + generous horizontal padding. The clickable surface always exceeds the visible glyph.',
  },
  {
    rule: 'Reduced motion is global.',
    why: 'A root rule zeroes animation-duration and transition-duration to 0.01ms. Press-scale rules + the plasma additionally gate with motion-safe.',
  },
  {
    rule: 'hover: hover gating.',
    why: 'Tailwind v4 auto-wraps hover: variants in @media (hover: hover). Touch users never see sticky-hover artifacts.',
  },
  {
    rule: 'Color is never the only signal.',
    why: 'Accent pairs with brackets ([home]), badges (FEATURED), status dots, or aria-current. The lime is decoration; the typographic affordance carries the meaning.',
  },
];

export function AccessibilityBand() {
  return (
    <section id="a11y" aria-labelledby="a11y-h" className="py-12 md:py-16 border-t border-rule">
      <SectionHead eyebrow="// 08 / so everyone can read it" title="Accessibility" id="a11y-h" />
      <Text variant="body" className="text-fg-muted max-w-prose-wide">
        WCAG 2.2 AA across the site. The contrast matrix in §02 covers the color floor;
        the rules below cover the rest: focus, motion, touch, and signal redundancy.
      </Text>
      <ul className="mt-8 flex flex-col gap-6 list-none p-0">
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
