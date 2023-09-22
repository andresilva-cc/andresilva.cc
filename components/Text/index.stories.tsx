import { Meta, StoryObj } from '@storybook/react';
import { Text, TextProps } from './index';

export default {
  title: 'Components/Text',
  component: Text,
  args: {
    children: 'Text',
  } as Meta<TextProps>,
};

export const Default: StoryObj<TextProps> = {};

export const Header1: StoryObj<TextProps> = {
  args: {
    textStyle: 'h1',
    children: 'Header 1',
  },
};

export const Header2Sans: StoryObj<TextProps> = {
  name: 'Header 2 (sans)',
  args: {
    textStyle: 'h2-sans',
    children: 'Header 2 (sans)',
  },
};

export const Header2Mono: StoryObj<TextProps> = {
  name: 'Header 2 (mono)',
  args: {
    textStyle: 'h2-mono',
    children: 'Header 2 (mono)',
  },
};

export const Header3: StoryObj<TextProps> = {
  args: {
    textStyle: 'h3',
    children: 'Header 3',
  },
};

export const Menu: StoryObj<TextProps> = {
  args: {
    textStyle: 'menu',
    children: 'Menu',
  },
};

export const Body1: StoryObj<TextProps> = {
  args: {
    textStyle: 'body-1',
    children: 'Body 1',
  },
};

export const Body2: StoryObj<TextProps> = {
  args: {
    textStyle: 'body-2',
    children: 'Body 2',
  },
};

export const Body3: StoryObj<TextProps> = {
  args: {
    textStyle: 'body-3',
    children: 'Body 3',
  },
};

export const Caption: StoryObj<TextProps> = {
  args: {
    textStyle: 'caption',
    children: 'Caption',
  },
};
