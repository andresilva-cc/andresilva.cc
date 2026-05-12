import { Cover } from './_components/cover';
import { DocNav } from './_components/doc-nav';
import { PrinciplesBand } from './_components/principles-band';
import { ColorBand } from './_components/color-band';
import { TypographyBand } from './_components/typography-band';
import { SpacingBand } from './_components/spacing-band';
import { MotionBand } from './_components/motion-band';
import { ComponentsBand } from './_components/components-band';
import { LayoutBand } from './_components/layout-band';
import { AccessibilityBand } from './_components/accessibility-band';

export const metadata = {
  title: 'Design System — andresilva.cc',
  description: 'Tokens, components, and standing rules for the andresilva.cc design system.',
};

/*
 * /design-system — living reference doc. Renders every production
 * component from src/components/ so the page itself validates the
 * system: if a token, utility, or component breaks, this surface
 * shows it first.
 *
 * Source spec: redesign/design-system.html (visual canon) and
 * docs/design-system.md (engineer-facing token mapping).
 */
export default function DesignSystemPage() {
  return (
    <>
      <Cover />
      <DocNav />
      <PrinciplesBand />
      <ColorBand />
      <TypographyBand />
      <SpacingBand />
      <MotionBand />
      <ComponentsBand />
      <LayoutBand />
      <AccessibilityBand />
    </>
  );
}
