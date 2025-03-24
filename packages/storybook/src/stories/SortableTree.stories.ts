import type { Meta, StoryObj } from "@storybook/react";

import { SortableTree } from "dnd-kit-tree";

const meta: Meta<typeof SortableTree> = {
  component: SortableTree,
};

export default meta;

type Story = StoryObj<typeof SortableTree>;

export const Default: Story = {
  args: {
    removable: true,
    indicator: true,
    collapsible: true,
    indentationWidth: 25,
  },
};
