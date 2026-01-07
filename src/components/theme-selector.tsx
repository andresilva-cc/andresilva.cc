'use client';

import { useState, useEffect, Fragment } from 'react';
import clsx from 'clsx';
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react';
import { PaletteIcon, CheckIcon } from '@phosphor-icons/react/dist/ssr/index';

import { Button } from '@/components/button';
import { useRepositories } from '@/hooks/use-repositories';

export function ThemeSelector() {
  const { themeRepository } = useRepositories();
  const themes = themeRepository.getAll();
  const defaultTheme = themeRepository.getDefault();

  const [currentTheme, setCurrentTheme] = useState(() => {
    const theme = typeof document !== 'undefined'
      ? document.documentElement.dataset.theme
      : defaultTheme.id;

    const isValid = themes.some((t) => t.id === theme);
    return isValid ? theme : defaultTheme.id;
  });

  useEffect(() => {
    document.documentElement.dataset.theme = currentTheme;
    document.cookie = `theme=${currentTheme};path=/;max-age=31536000`;
  }, [currentTheme]);

  return (
    <Menu as="div" className="relative">
      <MenuButton as={Fragment}>
        <Button variant="icon" aria-label="Select theme">
          <PaletteIcon size={32} />
        </Button>
      </MenuButton>

      <Transition
        as={Fragment}
        enter="transform transition ease-out duration-150"
        enterFrom="opacity-0 scale-90"
        enterTo="opacity-100 scale-100"
        leave="transform transition ease-in duration-150"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-90"
      >
        <MenuItems className="absolute right-0 mt-2 w-36 rounded-lg bg-gray-900 border border-auxiliary-500 p-2 focus:outline-none">
          {themes.map((theme) => (
            <MenuItem
              key={theme.id}
              as="button"
              type="button"
              className={clsx(
                'w-full px-3 py-2 text-sm flex items-center justify-between rounded transition-colors text-auxiliary-500 cursor-pointer group data-focus:bg-gray-950',
                [
                  currentTheme === theme.id ? 'text-primary-500 hover:text-primary-400 active:text-primary-300 font-semibold' : 'text-auxiliary-500 hover:text-auxiliary-400 active:text-auxiliary-300',
                ])}
              onClick={() => setCurrentTheme(theme.id)}
            >
              {theme.name}
              {currentTheme === theme.id && (
                <CheckIcon size={16} weight="bold" className="text-primary-500 group-hover:text-primary-400 group-active:text-primary-300" />
              )}
            </MenuItem>
          ))}
        </MenuItems>
      </Transition>
    </Menu>
  );
}
