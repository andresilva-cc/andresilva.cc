import Image from 'next/image';
import clsx from 'clsx';
import { Translate } from '@phosphor-icons/react/dist/ssr';
import { Button } from '@/components/Button';
import { Menu } from '@/components/Menu';

export interface HeaderProps {
  className?: string
}

export function Header({ className }: HeaderProps) {
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

      <Menu className="mt-6 md:mt-0 order-3 md:order-2 w-full md:w-auto" />

      <Button variant="icon" href="/" className="order-2 md:order-3">
        <Translate size={32} />
      </Button>
    </header>
  );
}
