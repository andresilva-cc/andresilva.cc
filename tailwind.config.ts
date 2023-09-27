import type { Config } from 'tailwindcss';
import scrollbar from 'tailwind-scrollbar';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    colors: {
      gray: {
        200: '#f6f5fa',
        900: '#2f2b42',
        950: '#232032',
      },
      primary: {
        300: '#b0a2f6',
        400: '#a190f4',
        500: '#9b7ef2',
      },
      secondary: {
        300: '#ffc65c',
        400: '#ffbf47',
        500: '#ffb633',
      },
      auxiliary: {
        300: '#c2bddb',
        400: '#b6b0d4',
        500: '#aaa3cc',
      },
    },
    fontFamily: {
      sans: 'var(--sans-font)',
      mono: 'var(--mono-font)',
    },
    borderRadius: {
      DEFAULT: '5px',
      lg: '10px',
    },
    extend: {
      listStyleType: {
        dash: '"- "',
      },
    },
  },
  plugins: [scrollbar],
};
export default config;
