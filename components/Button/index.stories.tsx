import { Meta, StoryObj } from '@storybook/react';
import { Button, ButtonProps } from './index';

export default {
  title: 'Components/Button',
  component: Button,
  args: {
    children: 'Download Resume',
    href: 'https://andresilva.cc',
    target: '_blank',
  } as Meta<ButtonProps>,
};

export const Default: StoryObj<ButtonProps> = {};

export const Text: StoryObj<ButtonProps> = {
  args: {
    variant: 'text',
  },
};
