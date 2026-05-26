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
  title: 'Design System · André Silva',
  description: 'Tokens, components, and standing rules for the andresilva.cc design system.',
  robots: { index: false },
};

/*
 * /design-system — living reference doc. Renders every production
 * component from src/components/ so the page itself validates the
 * system: if a token, utility, or component breaks, this surface
 * shows it first.
 *
 * Source spec: docs/design-system.md (tokens, components, standing
 * rules). This route is itself the site's live visual reference — the
 * redesign/ HTML mocks it was first built from have been retired.
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
