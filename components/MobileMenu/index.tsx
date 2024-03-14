'use client';

import { useState, Fragment } from 'react';
import { usePathname } from '@/navigation';
import { Dialog, Transition } from '@headlessui/react';
import clsx from 'clsx';
import { List, X as CloseIcon } from '@phosphor-icons/react/dist/ssr/index';

import { Button } from '@/components/Button';
import { LinkButton } from '@/components/LinkButton';

export interface MobileMenuProps {
  items: Array<{
    name: string
    path: string
  }>
  openMenuLabel: string
  closeMenuLabel: string
  className?: string
}

export function MobileMenu({
  items, openMenuLabel, closeMenuLabel, className,
}: MobileMenuProps) {
  const [isMenuVisible, setMenuVisibility] = useState(false);
  const currentPath = usePathname();

  function toggleMenu() {
    setMenuVisibility(!isMenuVisible);
  }

  return (
    <>
      <Button
        variant="icon"
        className={clsx(className)}
        aria-label={openMenuLabel}
        onClick={() => toggleMenu()}
      >
        <List size={32} />
      </Button>

      <Transition
        show={isMenuVisible}
        as={Fragment}
      >
        <Dialog
          className="w-screen h-screen fixed left-0 top-0"
          onClose={() => toggleMenu()}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="-translate-y-full"
            enterTo="translate-x-0"
            leave="ease-in duration-300"
            leaveFrom="translate-x-0"
            leaveTo="-translate-y-full"
          >
            <Dialog.Panel className="bg-gray-950 p-4 absolute h-screen w-screen">
              <div className="flex border-b border-b-auxiliary-500 pb-4 mb-4">
                <Button
                  variant="icon"
                  aria-label={closeMenuLabel}
                  onClick={() => toggleMenu()}
                >
                  <CloseIcon size={32} />
                </Button>
              </div>

              <nav>
                <ul className="flex flex-col gap-4">
                  { items.map((item) => (
                    <li key={item.path}>
                      <LinkButton
                        variant={currentPath === item.path ? 'default' : 'text'}
                        href={item.path}
                        onClick={() => toggleMenu()}
                      >
                        { item.name }
                      </LinkButton>
                    </li>
                  ))}
                </ul>
              </nav>
            </Dialog.Panel>
          </Transition.Child>
        </Dialog>
      </Transition>
    </>
  );
}
