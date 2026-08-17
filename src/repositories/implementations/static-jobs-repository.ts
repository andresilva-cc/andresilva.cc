import type { JobsRepository } from '../jobs-repository';
import { EMPLOYMENT_HISTORY } from './employment-history';

export class StaticJobsRepository implements JobsRepository {
  getAll() {
    return EMPLOYMENT_HISTORY.map((role) => ({
      title: role.title,
      company: role.company,
      formerly: role.formerly,
      startDate: role.startDate,
      endDate: role.endDate,
      bullets: role.bullets.map((bullet) => bullet.text),
      technologies: role.technologies,
      links: role.links,
    }));
  }
}
