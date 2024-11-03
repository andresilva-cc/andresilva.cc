import {
  Envelope, GithubLogo, LinkedinLogo, InstagramLogo,
} from '@phosphor-icons/react/dist/ssr/index';

export const FooterRepository = () => ({
  getAll() {
    return [
      { title: 'E-mail', icon: Envelope, url: 'mailto:hello@andresilva.cc' },
      { title: 'GitHub', icon: GithubLogo, url: 'https://github.com/andresilva-cc' },
      { title: 'LinkedIn', icon: LinkedinLogo, url: 'https://www.linkedin.com/in/andresilvacc/' },
      { title: 'Instagram', icon: InstagramLogo, url: 'https://www.instagram.com/andresilva.cc/' },
    ];
  },
});
