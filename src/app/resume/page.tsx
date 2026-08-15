import clsx from 'clsx';

import { getRepositories } from '@/repositories';
import { safeHref } from '@/lib/safe-href';

import './print.css';
import { resumeMono } from './fonts';
import { SectionHeading } from './_components/section-heading';
import { ResumeQr } from './_components/resume-qr';
import {
  EnvelopeIcon, PhoneIcon, GlobeIcon, GithubIcon,
} from './_components/contact-icons';

// robots.index is deliberately false while /resume renders phone and
// email as plain text — a default we can flip later, not a permanent
// decision. Same pattern as design-system/page.tsx.
export const metadata = {
  title: 'Resume · André Silva',
  robots: { index: false },
};

// Spaced en dash — matches the date-range glyph used across the print
// theme (docs/resume-print-theme.md §2 "Glyph notes").
function dateRange(start: string, end?: string): string {
  return `${start} – ${end ?? 'Present'}`;
}

/*
 * /resume — a code-based, print-themed resume that exports to PDF via
 * scripts/resume/generate.mjs (`pnpm resume:pdf`).
 *
 * DOM order is designed for the PDF text layer first: header, then
 * Experience in full, then Education, then Technologies — the same
 * order a reader (or an ATS) should extract. CSS grid only repositions
 * the Experience/sidebar split visually; it never reorders the source,
 * so pdftotext output stays linear despite the two-column layout.
 *
 * Palette + type scale are the print-only tokens scoped under `.resume`
 * in globals.css, per docs/resume-print-theme.md — deliberately
 * separate from the site's dark @theme tokens.
 */
export default function ResumePage() {
  const { resumeRepository } = getRepositories();
  const resume = resumeRepository.get();

  const midpoint = Math.ceil(resume.technologies.length / 2);
  const techColumnLeft = resume.technologies.slice(0, midpoint);
  const techColumnRight = resume.technologies.slice(midpoint);

  return (
    <main className={clsx('resume', resumeMono.variable)}>
      <header className="resume__header">
        <h1 className="resume__name">{ resume.name }</h1>
        <p className="resume__role">{ resume.role }</p>
        <ul className="resume__contact">
          <li>
            <EnvelopeIcon />
            <a href={safeHref(`mailto:${resume.contact.email}`)}>{ resume.contact.email }</a>
          </li>
          <li>
            <PhoneIcon />
            <span>{ resume.contact.phone }</span>
          </li>
          <li>
            <GlobeIcon />
            <a href={safeHref(resume.contact.site.url)}>{ resume.contact.site.label }</a>
          </li>
          <li>
            <GithubIcon />
            <a href={safeHref(resume.contact.github.url)}>{ resume.contact.github.label }</a>
          </li>
        </ul>
        <p className="resume__summary">{ resume.summary }</p>
      </header>

      <div className="resume__body">
        <section className="resume__section" aria-label="Experience">
          <SectionHeading>Experience</SectionHeading>
          { resume.experience.map((job) => (
            <article key={`${job.employer}-${job.start}`} className="resume__job">
              <h3 className="resume__job-heading">
                { job.title }
                <span className="resume__job-connector">{ ' @ ' }</span>
                <span className="resume__job-employer">{ job.employer }</span>
              </h3>
              <p className="resume__job-dates">{ dateRange(job.start, job.end) }</p>
              <ul className="resume__bullets">
                { job.bullets.map((bullet) => (
                  <li key={bullet}>{ bullet }</li>
                )) }
              </ul>
            </article>
          )) }
        </section>

        <aside className="resume__sidebar">
          <section className="resume__section" aria-label="Education">
            <SectionHeading>Education</SectionHeading>
            { resume.education.map((entry) => (
              <div key={entry.institution} className="resume__edu">
                <h3 className="resume__edu-heading">{ entry.institution }</h3>
                <p className="resume__edu-dates">{ dateRange(entry.start, entry.end) }</p>
                <p className="resume__edu-detail">{ entry.detail }</p>
              </div>
            )) }
          </section>

          <section className="resume__section" aria-label="Technologies">
            <SectionHeading>Technologies</SectionHeading>
            <div className="resume__tech-columns">
              <ul>
                { techColumnLeft.map((tech) => <li key={tech}>{ tech }</li>) }
              </ul>
              <ul>
                { techColumnRight.map((tech) => <li key={tech}>{ tech }</li>) }
              </ul>
            </div>
          </section>

          <ResumeQr url={resume.contact.site.url} />
        </aside>
      </div>
    </main>
  );
}
