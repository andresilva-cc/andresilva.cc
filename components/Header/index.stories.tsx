import { Meta, StoryObj } from '@storybook/react';
import { Header } from './index';

export default {
  title: 'Components/Header',
  component: Header,
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
