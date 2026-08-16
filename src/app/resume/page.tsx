import clsx from 'clsx';

import { getRepositories } from '@/repositories';
import { safeHref } from '@/lib/safe-href';
import { formatDateRange } from '@/lib/format-date';

import './print.css';
import { resumeMono } from './fonts';
import { SectionHeading } from './_components/section-heading';
import { ResumeQr } from './_components/resume-qr';

// robots.index is deliberately false while /resume renders phone and
// email as plain text — a default we can flip later, not a permanent
// decision. Same pattern as design-system/page.tsx.
export const metadata = {
  title: 'Resume · André Silva',
  robots: { index: false },
};

// Education dates are hand-authored strings (UNIVALI's end date is a
// bare year, with no month), not Date objects, so they can't go
// through formatDateRange — same em dash, joined locally instead.
function educationDateRange(start: string, end: string): string {
  return `${start} — ${end}`;
}

/*
 * /resume — a code-based, print-themed resume that exports to PDF via
 * scripts/resume/generate.ts (`pnpm resume:pdf`).
 *
 * Single column, full width, DOM order = reading order = extraction
 * order: header, then Experience in full (page 1), then a page-2
 * continuation head, Education, and Technologies. `break-before-page`
 * forces the fold explicitly so it can't drift as content changes —
 * see docs/resume-print-theme.md §6.6.
 *
 * Palette + type scale are the print-only tokens registered under the
 * `resume-*` `@theme` namespace in globals.css (docs/resume-print-theme.md
 * §1) — deliberately separate from the site's dark tokens. Everything
 * else is expressed as Tailwind utilities directly in this file; the
 * `.resume` class exists only as a CSS hook for the `body:has()` white-
 * background override in globals.css (print.css's `@page` rule can't be
 * scoped by class, so it can't do this job).
 */
export default function ResumePage() {
  const { resumeRepository } = getRepositories();
  const resume = resumeRepository.get();

  return (
    <main
      className={clsx(
        'resume',
        resumeMono.variable,
        'font-resume mx-auto max-w-[527.24pt] bg-resume-paper px-0 py-[24pt] text-resume-ink-body print:py-0',
        '[text-rendering:geometricPrecision] [print-color-adjust:exact] [-webkit-print-color-adjust:exact]',
      )}
    >
      <header>
        <div className="flex items-start justify-between gap-[24pt]">
          <div>
            <h1 className="m-0 text-resume-name font-bold tracking-[-0.01em] text-resume-ink">
              { resume.name }
            </h1>
            <p className="mt-[2pt] text-resume-role font-medium text-resume-ink-body">
              { resume.role }
            </p>
            <ul className="m-0 mt-[8pt] flex list-none flex-wrap gap-x-[14pt] gap-y-[4pt] p-0 text-resume-meta font-medium text-resume-ink-body">
              <li>
                <a className="text-inherit no-underline" href={safeHref(`mailto:${resume.contact.email}`)}>{ resume.contact.email }</a>
              </li>
              <li>{ resume.contact.phone }</li>
              <li>
                <a className="text-inherit no-underline" href={safeHref(resume.contact.site.url)}>{ resume.contact.site.label }</a>
              </li>
              <li>
                <a className="text-inherit no-underline" href={safeHref(resume.contact.github.url)}>{ resume.contact.github.label }</a>
              </li>
            </ul>
          </div>
          <ResumeQr url={resume.contact.site.url} />
        </div>
        <p className="mt-[10pt] text-resume-summary font-normal text-resume-ink-body">
          { resume.summary }
        </p>
      </header>

      <section aria-label="Experience" className="mt-[14pt]">
        <SectionHeading>Experience</SectionHeading>
        { resume.experience.map((job) => (
          <article
            key={job.startDate.getTime()}
            className="mt-[8pt] break-inside-avoid first:mt-0 [page-break-inside:avoid]"
          >
            <h3 className="m-0 mb-[4pt] text-resume-entry font-semibold text-resume-ink-body">
              { job.title }
              <span className="font-normal text-resume-ink-subtle">{ ' @ ' }</span>
              <span className="text-resume-ink">{ job.employer }</span>
              <span className="font-normal text-resume-ink-subtle">{ ' · ' }</span>
              <span className="font-medium text-resume-ink-subtle">{ formatDateRange(job.startDate, job.endDate, 'present') }</span>
            </h3>
            <ul className="m-0 list-none p-0">
              { job.bullets.map((bullet) => (
                <li
                  key={bullet}
                  className="relative mt-[2.5pt] pl-[1.3em] text-resume-body font-normal text-resume-ink-body first:mt-0 before:absolute before:left-0 before:font-semibold before:text-resume-ink before:content-['+']"
                >
                  { bullet }
                </li>
              )) }
            </ul>
          </article>
        )) }
      </section>

      <div className="break-before-page">
        <p className="m-0 text-resume-meta font-medium text-resume-ink-subtle">
          { resume.name }
          { ' · page 2 of 2' }
        </p>
        <hr className="mt-[2pt] mb-[8pt] border-0 border-t-[0.5pt] border-resume-rule" />

        <section aria-label="Education" className="mt-[14pt]">
          <SectionHeading>Education</SectionHeading>
          { resume.education.map((entry) => (
            <div key={entry.institution} className="mt-[6pt] first:mt-0">
              <h3 className="m-0 text-resume-entry font-semibold text-resume-ink">
                { entry.institution }
                <span className="font-normal text-resume-ink-subtle">{ ' · ' }</span>
                <span className="font-medium text-resume-ink-subtle">{ educationDateRange(entry.start, entry.end) }</span>
              </h3>
              <p className="m-0 text-resume-body font-normal text-resume-ink-body">
                { entry.detail }
              </p>
            </div>
          )) }
        </section>

        <section aria-label="Technologies" className="mt-[14pt]">
          <SectionHeading>Technologies</SectionHeading>
          <ul className="m-0 flex list-none flex-wrap gap-[4pt] p-0">
            { resume.technologies.map((tech) => (
              <li
                key={tech}
                className="border-[0.5pt] border-resume-rule px-[4pt] py-[1.5pt] text-resume-meta font-medium text-resume-ink-body"
              >
                { tech }
              </li>
            )) }
          </ul>
        </section>
      </div>
    </main>
  );
}
