/* eslint-disable no-console */

'use client';

import { useState } from 'react';
import Image from 'next/image';
import clsx from 'clsx';
import { LinkButton } from '@/components/LinkButton';

export function HomeButton() {
  const [count, setCount] = useState(0);
  const [enableEasterEgg, setEnableEasterEgg] = useState(false);

  function handleClick() {
    if (count === 4) {
      setEnableEasterEgg(true);
      document.body.classList.add('animate');
      console.log('Congratulations, you have found an Easter Egg!');
      return;
    }

    setCount(count + 1);
  }

  return (
    <LinkButton
      variant="icon"
      href="/"
      className={clsx({ 'animate-spin': enableEasterEgg })}
    >
      <Image
        src="/logo.svg"
        alt="Logo"
        width={32}
        height={32}
        onClick={() => handleClick()}
      />
    </LinkButton>
  );
}
