import { ReactNode, Fragment } from 'react';
import clsx from 'clsx';
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import { XIcon } from '@phosphor-icons/react/dist/ssr/index';
import { Button } from '@/components/button';
import { Text } from '@/components/text';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: ReactNode;
  children: ReactNode;
  className?: string;
}

export function Modal({
  isOpen, onClose, title, children, className,
}: ModalProps) {
  return (
    <Transition
      show={isOpen}
      as={Fragment}
    >
      <Dialog
        className="w-screen h-screen fixed left-0 top-0 flex items-center justify-center"
        onClose={() => onClose()}
      >
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-150"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div
            className="fixed inset-0 bg-black/50"
            aria-hidden="true"
          />
        </TransitionChild>

        <TransitionChild
          as={Fragment}
          enter="transform transition ease-out duration-150"
          enterFrom="opacity-0 scale-90"
          enterTo="opacity-100 scale-100"
          leave="transform transition ease-in duration-150"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-90"
        >
          <DialogPanel className="bg-gray-900 p-4 inline-block rounded-lg border-auxiliary-500 border min-w-[300px] relative">
            <div className="flex justify-between items-center mb-4">
              <Text variant="h3" asChild>
                <DialogTitle>{ title }</DialogTitle>
              </Text>
              <Button
                variant="icon"
                className="ml-3"
                aria-label="Close"
                onClick={() => onClose()}
              >
                <XIcon size={16} weight="bold" />
              </Button>
            </div>

            <div className={clsx(className)}>
              { children }
            </div>
          </DialogPanel>
        </TransitionChild>
      </Dialog>
    </Transition>
  );
}
