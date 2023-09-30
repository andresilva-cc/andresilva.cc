import clsx from 'clsx';
import {
  Envelope, GithubLogo, LinkedinLogo, InstagramLogo,
// @ts-ignore
} from '@phosphor-icons/react/dist/ssr';
import { Button } from '@/components/Button';

const items = [
  { title: 'E-mail', icon: Envelope, url: 'mailto:hello@andresilva.cc' },
  { title: 'GitHub', icon: GithubLogo, url: 'https://github.com/andresilva-cc' },
  { title: 'LinkedIn', icon: LinkedinLogo, url: 'https://www.linkedin.com/in/andresilvacc/' },
  { title: 'Instagram', icon: InstagramLogo, url: 'https://www.instagram.com/andresilva.cc/' },
];

export interface FooterProps {
  className?: string
}

export function Footer({ className }: FooterProps) {
  return (
    <footer className={clsx(className)}>
      <ul className="flex gap-8 justify-center">
        { items.map((item) => (
          <li key={item.url}>
            <Button
              variant="icon"
              href={item.url}
              target="_blank"
              title={item.title}
            >
              <item.icon
                size={32}
                className="text-auxiliay-500 hover:text-auxiliary-400 active:text-auxiliary-300 transition-colors hover:transition-none duration-300"
              />
            </Button>
          </li>
        ))}
      </ul>
    </footer>
  );
}
