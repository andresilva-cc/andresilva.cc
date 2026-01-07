'use client';

import { useState } from 'react';
import clsx from 'clsx';
import { LinkButton } from '@/components/link-button';

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
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        onClick={() => handleClick()}
        aria-label="Logo"
      >
        <rect width="32" height="32" rx="5" className="fill-primary-500" />
        <path
          d="M19.4892 22.3379H12.8267L11.6287 27.2446H6L12.9579 4.5H19.4892L26.4472 27.2446H20.6872L19.4892 22.3379ZM13.68 18.4323H18.6031L16.1415 8.37282L13.68 18.4323Z"
          className="fill-gray-950"
        />
      </svg>
    </LinkButton>
  );
}
