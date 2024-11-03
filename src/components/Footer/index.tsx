import clsx from 'clsx';
import { LinkButton } from '@/components/LinkButton';
import { useRepositories } from '@/repositories';

export interface FooterProps {
  className?: string
}

export function Footer({ className }: FooterProps) {
  const { footerRepository } = useRepositories();

  const items = footerRepository.getAll();

  return (
    <footer className={clsx(className)}>
      <ul className="flex gap-8 justify-center">
        { items.map((item) => (
          <li key={item.url}>
            <LinkButton
              variant="icon"
              href={item.url}
              target="_blank"
              title={item.title}
            >
              <item.icon
                size={32}
                className="text-auxiliay-500 hover:text-auxiliary-400 active:text-auxiliary-300 transition-colors hover:transition-none duration-300"
              />
            </LinkButton>
          </li>
        ))}
      </ul>
    </footer>
  );
}
