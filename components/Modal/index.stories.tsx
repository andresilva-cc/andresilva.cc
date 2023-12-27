/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react/jsx-props-no-spreading */

import { Meta, StoryObj } from '@storybook/react';
import { useArgs } from '@storybook/preview-api';
import { Link } from '@/components/Link';
import { Modal, ModalProps } from './index';

export default {
  title: 'Components/Modal',
  component: Modal,
  args: {
    isOpen: true,
    title: 'Links',
    children:
  <ul className="flex flex-col gap-4">
    <li><Link href="https://andresilva.cc/">Example</Link></li>
    <li><Link href="https://andresilva.cc/">Example</Link></li>
    <li><Link href="https://andresilva.cc/">Example</Link></li>
  </ul>,
  },
  render: function Render(args) {
    const [, updateArgs] = useArgs();

    function onClose() {
      updateArgs({ visible: false });
    }

    return <Modal {...args} onClose={() => onClose()} />;
  },
} as Meta<ModalProps>;

export const Default: StoryObj<ModalProps> = {};
