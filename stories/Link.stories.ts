import type { Meta, StoryObj } from '@storybook/react-vite';

import { fn } from 'storybook/test';

import { NaviLink } from './Link';

const DEFAULT_URL = "https://nknighta.me/";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Components/NaviLink',
  component: NaviLink,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
    backgroundColor: { control: 'color' },
    target: {
      control: 'select',
      options: ['_self', '_blank', '_parent', '_top'],
    },
  },
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#story-args
  args: { onClick: fn() },
} satisfies Meta<typeof NaviLink>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary: Story = {
  args: {
    primary: true,
    label: 'Link',
    href: DEFAULT_URL,
  },
};

export const Secondary: Story = {
  args: {
    label: 'Link',
    href: DEFAULT_URL,
  },
};

export const Large: Story = {
  args: {
    size: 'large',
    label: 'Link',
    href: DEFAULT_URL,
  },
};

export const Small: Story = {
  args: {
    size: 'small',
    label: 'Link',
    href: DEFAULT_URL,
  },
};

export const ExternalLink: Story = {
  args: {
    primary: true,
    label: 'Open in new tab',
    href: DEFAULT_URL,
    target: '_blank',
  },
};

