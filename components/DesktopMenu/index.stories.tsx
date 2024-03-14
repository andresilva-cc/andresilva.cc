import { Meta, StoryObj } from '@storybook/react';
import { Menu, DesktopMenuProps } from './index';

export default {
  title: 'Components/Menu',
  component: Menu,
  parameters: {
    nextjs: {
      appDirectory: true,
    },
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
