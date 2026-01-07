import clsx from 'clsx';

import { HomeButton } from '@/components/home-button';
import { DesktopMenu } from '@/components/desktop-menu';
import { MobileMenu } from '@/components/mobile-menu';
import { ThemeSelector } from '@/components/theme-selector';
import { useRepositories } from '@/hooks/use-repositories';

export interface HeaderProps {
  className?: string;
}

export function Header({ className }: HeaderProps) {
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
        className="md:hidden"
      />

      <HomeButton />

      <DesktopMenu
        items={items}
        className="hidden md:block mt-0 w-auto"
      />

      <ThemeSelector />
    </header>
  );
}
