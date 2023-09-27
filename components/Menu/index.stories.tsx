import { Meta, StoryObj } from '@storybook/react';
import { Menu, MenuProps } from './index';

export default {
  title: 'Components/Menu',
  component: Menu,
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
} as Meta<MenuProps>;

export const Default: StoryObj<MenuProps> = {};

export const ActiveItem: StoryObj<MenuProps> = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: '/career',
      },
    },
  },
};
