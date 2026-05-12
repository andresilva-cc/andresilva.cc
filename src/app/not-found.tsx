import { Text } from '@/components/text';
import { ArrowLink } from '@/components/arrow-link';
import { PageHead } from '@/components/page-head';
import { SectionHead } from '@/components/section-head';

export const metadata = {
  title: 'André Silva · Not Found',
};

/*
 * 404 — spec'd by the ui-ux-designer (T56). Reuses PageHead's brace
 * pattern with `NOT_FOUND` as the name (valid JSX-tag style, mirrors
 * HTTP enum naming). Eyebrow carries the numeric code so the H2 stays
 * the plain-text status. Single recovery link to home; the header nav
 * already covers the other surfaces one click away.
 *
 * See docs/ui-spec.md §404 and docs/copy-guide.md for the canonical
 * copy + composition.
 */
export default function NotFound() {
  return (
    <>
      <PageHead name="NOT_FOUND" />

      <section aria-labelledby="status-h" className="py-8 flex flex-col gap-5 max-w-prose-wide">
        <SectionHead
          eyebrow="// 01 / status 404"
          title="Page not found."
          id="status-h"
        />
        <Text variant="body" className="text-fg-muted m-0">
          The URL didn’t match any page on this site. Try one of the surfaces below.
        </Text>
        <ArrowLink href="/">home</ArrowLink>
      </section>
    </>
  );
}
