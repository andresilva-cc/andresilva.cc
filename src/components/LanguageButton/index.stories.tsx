import { Meta, StoryObj } from '@storybook/react';
import { LanguageButton, LanguageButtonProps } from './index';

export default {
  title: 'Components/Language Button',
  component: LanguageButton,
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
} as Meta<LanguageButtonProps>;

export const Default: StoryObj<LanguageButtonProps> = {};
