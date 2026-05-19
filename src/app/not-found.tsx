import { Text } from '@/components/text';
import { ArrowLink } from '@/components/arrow-link';
import { PageHead } from '@/components/page-head';
import { SectionHead } from '@/components/section-head';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { SkipLink } from '@/components/skip-link';

export const metadata = {
  title: 'André Silva · Not Found',
};

/*
 * Lives at the app root (not inside (site)) so Next.js uses it as the
 * global catch-all for unmatched routes. The (site) layout doesn't wrap
 * root files, so the shell (SkipLink, Header, Footer, max-w-shell
 * container) is replicated here directly from (site)/layout.tsx.
 *
 * See docs/ui-spec.md §404 and docs/copy-guide.md for the canonical
 * copy + composition.
 */
export default function NotFound() {
  return (
    <>
      <SkipLink />
      <div className="max-w-shell mx-auto w-full px-4 md:px-8 flex flex-col flex-1">
        <Header className="py-4 border-b border-rule" />
        <main id="main" className="flex-1">
          <PageHead name="NOT_FOUND" />

          <section aria-labelledby="status-h" className="py-8 max-w-prose-wide">
            <SectionHead
              eyebrow="// 01 / status 404"
              title="Page not found."
              id="status-h"
            />
            <Text variant="body" className="text-fg-muted m-0">
              The URL didn&#x2019;t match any page on this site. Try one of the surfaces below.
            </Text>
            <ArrowLink href="/" className="mt-4">home</ArrowLink>
          </section>
        </main>
        <Footer className="mt-12" />
      </div>
    </>
  );
}
