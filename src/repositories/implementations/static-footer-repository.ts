import {
  DevToLogoIcon,
  GithubLogoIcon,
  LinkedinLogoIcon,
  EnvelopeIcon,
  InstagramLogoIcon,
} from '@phosphor-icons/react/dist/ssr/index';
import type { FooterRepository } from '../footer-repository';

export class StaticFooterRepository implements FooterRepository {
  getAll() {
    return [
      { title: 'GitHub', icon: GithubLogoIcon, url: 'https://github.com/andresilva-cc' },
      { title: 'LinkedIn', icon: LinkedinLogoIcon, url: 'https://www.linkedin.com/in/andresilvacc/' },
      { title: 'DEV Community', icon: DevToLogoIcon, url: 'https://dev.to/andresilva-cc' },
      { title: 'E-mail', icon: EnvelopeIcon, url: 'mailto:hello@andresilva.cc' },
      { title: 'Instagram', icon: InstagramLogoIcon, url: 'https://www.instagram.com/andresilva.cc/' },
    ];
  }
}
