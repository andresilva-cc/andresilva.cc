import { Meta, StoryObj } from '@storybook/react';
import { Chip, ChipProps } from './index';

export default {
  title: 'Components/Chip',
  component: Chip,
  args: {
    children: 'TypeScript',
  },
} as Meta<ChipProps>;

export const Default: StoryObj<ChipProps> = {};
