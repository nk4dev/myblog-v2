import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { ThreeBackground } from './ThreeBackground';

const meta = {
  title: 'Components/ThreeBackground',
  component: ThreeBackground,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    color: { control: 'color' },
    backgroundColor: { control: 'color' },
    particleCount: { control: { type: 'range', min: 50, max: 1000, step: 50 } },
    particleSize: { control: { type: 'range', min: 1, max: 10, step: 0.5 } },
    speed: { control: { type: 'range', min: 0, max: 5, step: 0.1 } },
    width: { control: { type: 'range', min: 200, max: 1200, step: 50 } },
    height: { control: { type: 'range', min: 200, max: 800, step: 50 } },
  },
} satisfies Meta<typeof ThreeBackground>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    particleCount: 200,
    color: '#6366f1',
    backgroundColor: '#0f0f0f',
    particleSize: 2,
    speed: 1,
    width: 600,
    height: 400,
  },
};

export const DenseGalaxy: Story = {
  args: {
    particleCount: 800,
    color: '#a78bfa',
    backgroundColor: '#000000',
    particleSize: 1.5,
    speed: 0.5,
    width: 600,
    height: 400,
  },
};

export const FastNeon: Story = {
  args: {
    particleCount: 300,
    color: '#22d3ee',
    backgroundColor: '#020617',
    particleSize: 3,
    speed: 3,
    width: 600,
    height: 400,
  },
};

export const GoldenDust: Story = {
  args: {
    particleCount: 500,
    color: '#fbbf24',
    backgroundColor: '#1c1917',
    particleSize: 1,
    speed: 0.8,
    width: 600,
    height: 400,
  },
};

export const WithChildren: Story = {
  args: {
    particleCount: 350,
    color: '#7dd3fc',
    backgroundColor: '#020617',
    particleSize: 2.5,
    speed: 1.2,
    width: 600,
    height: 400,
  },
  render: (args) =>
    React.createElement(
      ThreeBackground,
      args,
      React.createElement(
        'div',
        {
          style: {
            display: 'grid',
            placeItems: 'center',
            width: '100%',
            height: '100%',
            padding: 32,
            color: '#e2e8f0',
            textAlign: 'center',
            background:
              'linear-gradient(180deg, rgba(2,6,23,0.12) 0%, rgba(2,6,23,0.55) 100%)',
          },
        },
        React.createElement(
          'div',
          null,
          React.createElement(
            'div',
            {
              style: {
                fontSize: 14,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
              },
            },
            'Overlay Content'
          ),
          React.createElement(
            'div',
            {
              style: {
                fontSize: 36,
                fontWeight: 700,
                marginTop: 12,
              },
            },
            'Three.js Hero'
          ),
          React.createElement(
            'div',
            {
              style: {
                fontSize: 16,
                marginTop: 12,
                opacity: 0.82,
              },
            },
            'Children now render above the animated particle field.'
          )
        )
      )
    ),
};
