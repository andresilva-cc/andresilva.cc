import { Meta, StoryObj } from '@storybook/react';
import { GithubLogo } from '@phosphor-icons/react';
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

export const Icon: StoryObj<ButtonProps> = {
  args: {
    variant: 'icon',
    href: 'https://github.com/andresilva-cc',
    children: <GithubLogo size="32" />,
  },
};
