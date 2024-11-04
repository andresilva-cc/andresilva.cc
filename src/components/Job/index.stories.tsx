import { Meta, StoryObj } from '@storybook/react';
import { Job, JobProps } from './index';

export default {
  title: 'Components/Job',
  component: Job,
  args: {
    title: 'Front-end Engineering Consultant',
    company: 'Atlas Technologies',
    startDate: new Date(2022, 2),
    endDate: undefined,
    links: undefined,
    technologies: [
      'JavaScript',
      'TypeScript',
      'Vue.js',
      'Laravel',
      'Jest',
      'Tailwind CSS',
    ],
    children: (
      <ul>
        <li>Mentoring and technical guidance to front-end engineers</li>
        <li>Monitoring of squad initiatives</li>
        <li>Study and development of project improvements</li>
        <li>Creating and updating chapter documentation</li>
        <li>Code review</li>
      </ul>
    ),
  },
} as Meta<JobProps>;

export const CurrentJob: StoryObj<JobProps> = {};

export const PastJob: StoryObj<JobProps> = {
  args: {
    endDate: new Date(2022, 11),
  },
};

export const WithLink: StoryObj<JobProps> = {
  args: {
    links: [
      {
        name: 'NativeScript Spotify',
        url: 'ttps://github.com/Nuxstep/nativescript-plugins/tree/master/packages/nativescript-spotify',
      },
    ],
  },
};
