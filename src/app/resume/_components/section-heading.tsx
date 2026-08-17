import { ReactNode } from 'react';

export interface SectionHeadingProps {
  children: ReactNode;
}

/*
 * SectionHeading — the site's section-marking language (section-head.tsx:
 * an eyebrow, an H2, a bottom rule) collapsed for paper. The two-line
 * eyebrow is dropped outright — unaffordable at this density, and its
 * editorial "// nn / phrasing" register doesn't belong on a resume —
 * rather than compressed into a mark glyph or an uppercase treatment.
 * On the site the bottom rule alone marks a section boundary and a
 * section title (as opposed to a subordinate label like a table header
 * or the About page's Facts keys) is always sentence case — see
 * about/page.tsx's "Bio" / "Education" / "Facts". The heading only
 * shrank to 10.5pt for print economy; that doesn't demote what it is,
 * so this stays sentence case with no eyebrow-style letterspacing.
 */
export function SectionHeading({ children }: SectionHeadingProps) {
  return (
    <>
      <h2 className="m-0 text-resume-heading font-semibold text-resume-ink">
        { children }
      </h2>
      <hr className="mt-[3pt] mb-[8pt] border-0 border-t-[0.5pt] border-resume-rule" />
    </>
  );
}
