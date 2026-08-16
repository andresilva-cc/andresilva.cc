import type { ResumeRepository, ResumeRepositoryResponse } from '../resume-repository';
import { EMPLOYMENT_HISTORY, type EmploymentRole } from './employment-history';

/*
 * Experience content derives from EMPLOYMENT_HISTORY (employment-history.ts),
 * the dataset shared with StaticJobsRepository — see that file for the
 * unification rationale. Dates stay Date objects here too (not
 * pre-formatted strings) — the page formats them through the same
 * `formatMonthYear`/`formatDateRange` helpers /career uses
 * (src/lib/format-date.ts), so the two surfaces can't drift on
 * case or dash glyph the way they previously did.
 *
 * Everything else here (contact, summary, education, technologies) has
 * no shared upstream source and is authored directly.
 *
 * Editing this file does NOT regenerate public/resume.pdf by itself —
 * the PDF is a committed, manually-exported artifact (see
 * scripts/resume/generate.ts). After changing anything here, run
 * `pnpm resume:pdf` and commit the updated PDF, or the shipped file
 * silently drifts out of sync with this data.
 */

function formatEmployer(role: EmploymentRole): string {
  return role.formerly ? `${role.company} (formerly ${role.formerly})` : role.company;
}

export class StaticResumeRepository implements ResumeRepository {
  get(): ResumeRepositoryResponse {
    return {
      name: 'André Luiz da Silva',
      role: 'Senior Software Engineer',
      contact: {
        email: 'hello@andresilva.cc',
        phone: '+55 47 99900-1415',
        site: { label: 'andresilva.cc', url: 'https://andresilva.cc/' },
        github: { label: 'github.com/andresilva-cc', url: 'https://github.com/andresilva-cc' },
      },
      summary: 'Software engineer with 9+ years of experience building web platforms, internal tools, and developer tooling. Works end-to-end — from architecture and infrastructure to product features and integrations. Primarily works with TypeScript, Vue.js, Nuxt, React, and Node.js. Takes ownership of solutions while collaborating effectively with teams, quickly adapting to new technologies and challenges. Holds a BS in Computer Science and a specialization certificate in Technical Leadership.',
      experience: EMPLOYMENT_HISTORY.map((role) => ({
        title: role.title,
        employer: formatEmployer(role),
        startDate: role.startDate,
        endDate: role.endDate,
        bullets: role.bullets.map((bullet) => bullet.short ?? bullet.text),
      })),
      // Independent of the About page's own education card
      // (about/page.tsx's educationItems) and of /career (which has no
      // education section at all) — not shared with either. See the file
      // header for why.
      education: [
        {
          institution: 'Full Cycle',
          detail: 'Specialization Certificate in Technical Leadership',
          start: '2024',
          end: '2025',
        },
        {
          institution: 'UNIVALI - Universidade do Vale do Itajaí',
          detail: 'Bachelor Degree in Computer Science',
          start: '2015',
          end: '2019',
        },
      ],
      // A curated ~15-item positioning list, not derived from
      // EMPLOYMENT_HISTORY's per-job technologies — those are per-role
      // detail, not a single "here's my stack" statement, so this stays
      // hand-authored rather than a dedupe/union of the per-job arrays.
      technologies: [
        'TypeScript', 'JavaScript', 'Vue.js', 'Nuxt', 'React', 'Next.js', 'Node.js', 'TanStack', 'Pinia',
        'Tailwind CSS', 'Storybook', 'Vitest', 'Docker', 'WebSockets', 'AI SDK',
      ],
    };
  }
}
