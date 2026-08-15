export interface ResumeRoleEntry {
  title: string;
  employer: string;
  /** Pre-formatted, e.g. "Apr 2025". */
  start: string;
  /** Undefined for the current role — renders as "Present". */
  end?: string;
  bullets: Array<string>;
}

export interface ResumeEducationEntry {
  institution: string;
  detail: string;
  start: string;
  end: string;
}

export interface ResumeRepositoryResponse {
  name: string;
  role: string;
  contact: {
    email: string;
    phone: string;
    site: { label: string; url: string };
    github: { label: string; url: string };
  };
  summary: string;
  experience: Array<ResumeRoleEntry>;
  education: Array<ResumeEducationEntry>;
  technologies: Array<string>;
}

export interface ResumeRepository {
  get(): ResumeRepositoryResponse;
}
