import type { BlogMetaData } from "types/blog";
import { BlogGridBox } from "./BlogGridBox";
import type { Meta, StoryObj } from "@storybook/react";

import { fn } from 'storybook/test';

const meta = {
    title: "Blog/GridBox",
    component: BlogGridBox,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
} satisfies Meta<typeof BlogGridBox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {
        blog: {
            id: "1",
            createdAt: "2024 / 01 / 01 00:00:00",
            updatedAt: "2024 / 01 / 01 00:00:00",
            publishedAt: "2024 / 01 / 01",
            title: "Sample Blog Post",
            content: "This is a sample blog post for testing the BlogGridBox component.",
            category: {
                id: "cat1",
                name: "Category 1",
            },
            eyecatch: {
                url: "storybook-static/sample.jpeg",
                width: 400,
                height: 300,
            },
        },
    },
};
