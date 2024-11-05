import { useTranslations } from 'next-intl';
import clsx from 'clsx';

import { HomeButton } from '@/components/HomeButton';
import { LanguageButton } from '@/components/LanguageButton';
import { DesktopMenu } from '@/components/DesktopMenu';
import { MobileMenu } from '@/components/MobileMenu';
import { useRepositories } from '@/hooks/useRepositories';

export interface HeaderProps {
  className?: string
}

export function Header({ className }: HeaderProps) {
  const t = useTranslations();
  const { menuRepository } = useRepositories();
  const items = menuRepository.getAll();

  return (
    <header
      className={clsx(
        'flex justify-between items-center',
        className,
      )}
    >
      <MobileMenu
        items={items}
        openMenuLabel={t('common.openMenu')}
        closeMenuLabel={t('common.closeMenu')}
        className="md:hidden"
      />

      <HomeButton />

      <DesktopMenu
        items={items}
        className="hidden md:block mt-0 w-auto"
      />

      <LanguageButton />
    </header>
  );
}
