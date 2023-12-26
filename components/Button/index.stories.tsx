import { Meta, StoryObj } from '@storybook/react';
import { X as CloseIcon } from '@phosphor-icons/react';
import { Button, ButtonProps } from './index';

export default {
  title: 'Components/Button',
  component: Button,
  args: {
    children: 'Close',
  },
} as Meta<ButtonProps>;

export const Default: StoryObj<ButtonProps> = {};

export const Text: StoryObj<ButtonProps> = {
  args: {
    variant: 'text',
  },
};

export const Icon: StoryObj<ButtonProps> = {
  args: {
    variant: 'icon',
    children: <CloseIcon size="32" />,
  },
};
