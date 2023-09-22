import type { Preview } from '@storybook/react';
import { firaCode, firaSans } from '@/app/fonts';
import '@/app/globals.css';

document.body.className += ` ${firaCode.variable} ${firaSans.variable}`;

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
};

export default preview;
