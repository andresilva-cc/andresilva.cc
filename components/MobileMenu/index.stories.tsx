import { Meta, StoryObj } from '@storybook/react';
import { MobileMenu, MobileMenuProps } from './index';

export default {
  title: 'Components/Mobile Menu',
  component: MobileMenu,
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
  args: {
    items: [
      { name: 'Home', path: '/' },
      { name: 'About', path: '/about' },
      { name: 'Career', path: '/career' },
      { name: 'Projects', path: '/projects' },
    ],
    openMenuLabel: 'Open menu',
    closeMenuLabel: 'Close menu',
  },
} as Meta<MobileMenuProps>;

export const Default: StoryObj<MobileMenuProps> = {};

export const ActiveItem: StoryObj<MobileMenuProps> = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: '/career',
      },
    },
  },
};
