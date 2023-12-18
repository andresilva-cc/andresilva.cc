import { Meta, StoryObj } from '@storybook/react';
import { Link, LinkProps } from './index';

export default {
  title: 'Components/Link',
  component: Link,
  args: {
    href: 'https://github.com/Nuxstep/nativescript-plugins/tree/master/packages/nativescript-spotify',
    target: '_blank',
    children: 'NativeScript Spotify',
  },
} as Meta<LinkProps>;

export const Default: StoryObj<LinkProps> = {};
