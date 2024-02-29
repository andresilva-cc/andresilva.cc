import { useTranslations } from 'next-intl';
import clsx from 'clsx';

import { HomeButton } from '@/components/HomeButton';
import { LanguageButton } from '@/components/LanguageButton';
import { Menu } from '@/components/Menu';
import { useRepositories } from '@/repositories';

export interface HeaderProps {
  className?: string
}

export function Header({ className }: HeaderProps) {
  const t = useTranslations();

  const { menuRepository } = useRepositories(t);
  const items = menuRepository.getAll();

  return (
    <header
      className={clsx(
        'flex flex-wrap justify-between items-center',
        className,
      )}
    >
      <HomeButton />

      <Menu items={items} className="mt-6 md:mt-0 order-3 md:order-2 w-full md:w-auto" />

      <LanguageButton className="order-2 md:order-3" />
    </header>
  );
}
