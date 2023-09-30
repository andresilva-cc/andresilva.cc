import Image from 'next/image';
import { useTranslations } from 'next-intl';
import clsx from 'clsx';
import { Button } from '@/components/Button';
import { LanguageButton } from '@/components/LanguageButton';
import { Menu, MenuProps } from '@/components/Menu';

export interface HeaderProps {
  className?: string
}

export function Header({ className }: HeaderProps) {
  const t = useTranslations('menu');

  const items: MenuProps['items'] = [
    { name: t('about'), path: '/about' },
    { name: t('career'), path: '/career' },
    { name: t('projects'), path: '/projects' },
  ];

  return (
    <header
      className={clsx(
        'flex flex-wrap justify-between items-center',
        className,
      )}
    >
      <Button variant="icon" href="/">
        <Image src="/logo.svg" alt="Logo" width={32} height={32} />
      </Button>

      <Menu items={items} className="mt-6 md:mt-0 order-3 md:order-2 w-full md:w-auto" />

      <LanguageButton className="order-2 md:order-3" />
    </header>
  );
}
