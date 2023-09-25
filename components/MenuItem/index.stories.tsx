import { Meta, StoryObj } from '@storybook/react';
import { MenuItem, MenuItemProps } from './index';

export default {
  title: 'Components/Menu Item',
  component: MenuItem,
  args: {
    children: 'About',
    href: '/about',
  },
} as Meta<MenuItemProps>;

export const Default: StoryObj<MenuItemProps> = {};

export const Active: StoryObj<MenuItemProps> = {
  args: {
    active: true,
  },
};
