// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
import type { Meta, StoryObj } from '@storybook/react';
import { Text } from './Text';

// for testing link actions in Storybook
import  { fn } from 'storybook/test';

const meta = {
    title: 'Components/Text',
    component: Text,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        size: {
            control: 'select',
            options: ['small', 'medium', 'large'],
        },
        weight: {
            control: 'select',
            options: ['light', 'normal', 'bold'],
        },
        align: {
            control: 'select', 
            options: ['left', 'center', 'right'],
        },
        heading: {
            control: 'select',
            options: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', false],
        },
    },
} satisfies Meta<typeof Text>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    size: 'medium',
    weight: 'normal',
    align: 'left',
    heading: false,
    children: 'This is a Text component',
  },
};

export const Secondary: Story = {
  args: {
    size: 'medium',
    weight: 'normal',
    align: 'left',
    heading: false,
    children: 'This is a Text component',
  },
};

export const Large: Story = {
  args: {
    size: 'large',
    weight: 'normal',
    align: 'left',
    heading: false,
    children: 'This is a Text component',
  },
};

export const Small: Story = {
  args: {
    size: 'small',
    weight: 'normal',
    align: 'left',
    heading: false,
    children: 'This is a Text component',
  },
};

export const Heading1: Story = {
  args: {
    size: 'large',
    weight: 'bold',
    align: 'left',
    heading: 'h1',
    children: 'This is a Heading component',
  },
};


export const Heading2: Story = {
  args: {
    size: 'large',
    weight: 'bold',
    align: 'left',
    heading: 'h2',
    children: 'This is a Heading component',
  },
};


export const Heading3: Story = {
  args: {
    size: 'large',
    weight: 'bold',
    align: 'left',
    heading: 'h3',
    children: 'This is a Heading component',
  },
};



export const Heading4: Story = {
  args: {
    size: 'large',
    weight: 'bold',
    align: 'left',
    heading: 'h4',
    children: 'This is a Heading component',
  },
};


export const Heading5: Story = {
  args: {
    size: 'large',
    weight: 'bold',
    align: 'left',
    heading: 'h5',
    children: 'This is a Heading component',
  },
};

