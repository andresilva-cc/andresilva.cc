import { ReactNode } from 'react';

export interface SectionHeadingProps {
  children: ReactNode;
}

/*
 * SectionHeading — the collapsed eyebrow treatment from
 * docs/resume-print-theme.md §2 "Section-heading derivation": the
 * site's two-line eyebrow + H2 collapses to one line on paper. Case
 * and tracking migrate onto the heading text, the eyebrow's accent
 * colour migrates onto the 6pt square, the bottom rule is retained.
 */
export function SectionHeading({ children }: SectionHeadingProps) {
  return (
    <>
      <h2 className="resume__section-heading">
        <span className="resume__section-mark" aria-hidden="true" />
        <span className="resume__section-heading-text">{ children }</span>
      </h2>
      <hr className="resume__section-rule" />
    </>
  );
}
