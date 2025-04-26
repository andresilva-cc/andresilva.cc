import { Fira_Code, Fira_Sans } from 'next/font/google';

export const firaSans = Fira_Sans({
  weight: ['400', '500'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-fira-sans',
});

export const firaCode = Fira_Code({
  weight: ['400', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-fira-code',
});
