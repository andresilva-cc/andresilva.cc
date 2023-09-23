import { Meta, StoryObj } from '@storybook/react';
import { Text, TextProps } from './index';

export default {
  title: 'Components/Text',
  component: Text,
  args: {
    children: 'Text',
    asChild: false,
  } as Meta<TextProps>,
};

export const Default: StoryObj<TextProps> = {};

export const Header1: StoryObj<TextProps> = {
  args: {
    variant: 'h1',
    children: 'Header 1',
  },
};

export const Header2Sans: StoryObj<TextProps> = {
  name: 'Header 2 (sans)',
  args: {
    variant: 'h2-sans',
    children: 'Header 2 (sans)',
  },
};

export const Header2Mono: StoryObj<TextProps> = {
  name: 'Header 2 (mono)',
  args: {
    variant: 'h2-mono',
    children: 'Header 2 (mono)',
  },
};

export const Header3: StoryObj<TextProps> = {
  args: {
    variant: 'h3',
    children: 'Header 3',
  },
};

export const Button: StoryObj<TextProps> = {
  args: {
    variant: 'button',
    children: 'Button',
  },
};

export const Body1: StoryObj<TextProps> = {
  args: {
    variant: 'body-1',
    children: 'Body 1',
  },
};

export const Body2: StoryObj<TextProps> = {
  args: {
    variant: 'body-2',
    children: 'Body 2',
  },
};

export const Body3: StoryObj<TextProps> = {
  args: {
    variant: 'body-3',
    children: 'Body 3',
  },
};

export const Caption: StoryObj<TextProps> = {
  args: {
    variant: 'caption',
    children: 'Caption',
  },
};
