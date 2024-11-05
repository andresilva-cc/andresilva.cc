import path from 'path';
import type { StorybookConfig } from '@storybook/nextjs';

// https://github.com/storybookjs/storybook/issues/26586
// @ts-ignore
const config: StorybookConfig = {
  stories: ['../src/components/**/*.mdx', '../src/components/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  staticDirs: ['../public'],

  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-onboarding',
    '@storybook/addon-interactions',
  ],

  framework: {
    name: '@storybook/nextjs',
    options: {},
  },

  webpackFinal: async (webpackConfig) => {
    if (webpackConfig.resolve) {
      // eslint-disable-next-line no-param-reassign
      webpackConfig.resolve.alias = {
        ...webpackConfig.resolve.alias,
        '@': path.resolve(__dirname, '../src/'),
      };
    }

    return webpackConfig;
  },

  typescript: {
    reactDocgen: 'react-docgen-typescript',
  },
};

export default config;
