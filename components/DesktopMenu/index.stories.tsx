import { Meta, StoryObj } from '@storybook/react';
import { DesktopMenu, DesktopMenuProps } from './index';

export default {
  title: 'Components/Desktop Menu',
  component: DesktopMenu,
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
  args: {
    items: [
      { name: 'About', path: '/about' },
      { name: 'Career', path: '/career' },
      { name: 'Projects', path: '/projects' },
    ],
  },
} as Meta<DesktopMenuProps>;

export const Default: StoryObj<DesktopMenuProps> = {};

export const ActiveItem: StoryObj<DesktopMenuProps> = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: '/career',
      },
    },
  },
};
