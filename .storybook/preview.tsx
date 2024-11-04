import type { Preview } from '@storybook/react';
import { NextIntlClientProvider } from 'next-intl';
import { firaCode, firaSans } from '@/app/fonts';
import messages from '../messages/en.json';
import '@/app/globals.css';

document.body.className += ` ${firaCode.variable} ${firaSans.variable}`;

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
  decorators: [
    (Story) => (
      <NextIntlClientProvider locale="en" messages={messages}>
        <Story />
      </NextIntlClientProvider>
    ),
  ],
};

export default preview;
