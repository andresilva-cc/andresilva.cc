import Image from 'next/image';
import { Translate } from '@phosphor-icons/react';
import { Button } from '@/components/Button';
import { Menu } from '@/components/Menu';

export function Header() {
  return (
    <header className="flex flex-wrap justify-between items-center">
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