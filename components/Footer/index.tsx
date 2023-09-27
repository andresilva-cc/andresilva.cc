import clsx from 'clsx';
import {
  Envelope, GithubLogo, LinkedinLogo, InstagramLogo,
} from '@phosphor-icons/react/dist/ssr';
import { Button } from '@/components/Button';

const items = [
  { icon: Envelope, url: 'mailto:hello@andresilva.cc' },
  { icon: GithubLogo, url: 'https://github.com/andresilva-cc' },
  { icon: LinkedinLogo, url: 'https://www.linkedin.com/in/andresilvacc/' },
  { icon: InstagramLogo, url: 'https://www.instagram.com/andresilva.cc/' },
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
            <Button variant="icon" href={item.url} target="_blank">
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
