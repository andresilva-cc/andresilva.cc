import { Meta, StoryObj } from '@storybook/react';
import { Menu } from './index';

export default {
  title: 'Components/Menu',
  component: Menu,
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
} as Meta;

export const Default: StoryObj = {};

export const ActiveItem: StoryObj = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: '/career',
      },
    },
  },
};
