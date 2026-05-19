import { Text } from '@/components/text';

export interface SkipLinkProps {
  /** Fragment ID to jump to. Defaults to "main". */
  targetId?: string;
}

/*
 * SkipLink — first focusable element on every page (WCAG 2.4.1 Bypass Blocks).
 *
 * Invisible until a keyboard user tabs into it from the URL bar; then it
 * appears at top-left and jumps focus to the page's main content on Enter.
 * Renders Mono / 600 / micro via Text composition; the rest is structural.
 */
export function SkipLink({ targetId = 'main' }: SkipLinkProps) {
  return (
    <Text asChild variant="micro">
      <a
        href={`#${targetId}`}
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-2 focus:z-50 focus:inline-flex focus:bg-accent focus:px-3 focus:py-2 focus:uppercase focus:tracking-eyebrow focus:text-canvas focus:outline focus:outline-2 focus:outline-accent-strong focus:outline-offset-2"
      >
        Skip to main
      </a>
    </Text>
  );
}
