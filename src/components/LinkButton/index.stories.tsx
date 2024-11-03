import { Meta, StoryObj } from '@storybook/react';
import { GithubLogo } from '@phosphor-icons/react';
import { LinkButton, LinkButtonProps } from './index';

export default {
  title: 'Components/Link Button',
  component: LinkButton,
  args: {
    children: 'Download Resume',
    href: 'https://andresilva.cc',
    target: '_blank',
  },
} as Meta<LinkButtonProps>;

export const Default: StoryObj<LinkButtonProps> = {};

export const Text: StoryObj<LinkButtonProps> = {
  args: {
    variant: 'text',
  },
};

export const Icon: StoryObj<LinkButtonProps> = {
  args: {
    variant: 'icon',
    href: 'https://github.com/andresilva-cc',
    children: <GithubLogo size="32" />,
  },
};
