import type { FooterRepository } from '../footer-repository';

export class StaticFooterRepository implements FooterRepository {
  getAll() {
    return [
      { title: 'github', url: 'https://github.com/andresilva-cc' },
      { title: 'linkedin', url: 'https://www.linkedin.com/in/andresilvacc/' },
      { title: 'dev.to', url: 'https://dev.to/andresilva-cc' },
      { title: 'email', url: 'mailto:hello@andresilva.cc' },
    ];
  }
}
