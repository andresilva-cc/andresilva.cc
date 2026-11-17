import { ReactNode } from 'react';

export interface SectionHeadingProps {
  children: ReactNode;
}

// The site's SectionHead (H2 + one rule) at print size; sentence case, no letterspacing.
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
