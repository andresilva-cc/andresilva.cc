import { Meta, StoryObj } from '@storybook/react';
import { Project, ProjectProps } from './index';

export default {
  title: 'Components/Project',
  component: Project,
  args: {
    title: 'CustomBurger',
    description: 'A small project where you can build your own burger :)',
    url: undefined,
    featured: false,
    technologies: ['TypeScript', 'Vue.js', 'Nuxt', 'Tailwind CSS'],
  },
  decorators: [
    (Story) => (
      <div className="max-w-sm">
        <Story />
      </div>
    ),
  ],
} as Meta<ProjectProps>;

export const Default: StoryObj<ProjectProps> = {};

export const DefaultSingleURL: StoryObj<ProjectProps> = {
  name: 'Default (with single URL)',
  args: {
    links: [{ url: 'https://customburger.andresilva.cc/' }],
  },
};

export const DefaultMultipleURL: StoryObj<ProjectProps> = {
  name: 'Default (with multiple URL)',
  args: {
    links: [
      { name: 'CustomBurger', url: 'https://customburger.andresilva.cc/' },
      { name: 'CustomBurger', url: 'https://customburger.andresilva.cc/' },
    ],
  },
};

export const Featured: StoryObj<ProjectProps> = {
  args: {
    featured: true,
  },
};
