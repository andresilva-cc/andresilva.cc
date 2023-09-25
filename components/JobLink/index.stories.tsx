import { Meta, StoryObj } from '@storybook/react';
import { JobLink, JobLinkProps } from './index';

export default {
  title: 'Components/Job Link',
  component: JobLink,
  args: {
    href: 'https://github.com/Nuxstep/nativescript-plugins/tree/master/packages/nativescript-spotify',
    target: '_blank',
    children: 'NativeScript Spotify',
  },
} as Meta<JobLinkProps>;

export const Default: StoryObj<JobLinkProps> = {};
