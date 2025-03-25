import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";

import { SortableTree } from "dnd-kit-tree";
import type { SortableTreeProps, TreeItems } from "dnd-kit-tree";

const meta: Meta<typeof SortableTree> = {
  component: SortableTree,
};

export default meta;

type Story = StoryObj<typeof SortableTree>;

type Data = {
  label: string;
};

const StoryHook = (props: SortableTreeProps<unknown>) => {
  const [value, setValue] = useState<TreeItems<Data>>([
    {
      id: "id-1",
      data: { label: "Root Item 1" },
      children: [
        {
          id: "id-2",
          data: { label: "Sub Item 2" },
          children: [
            {
              id: "id-3",
              children: [],
              data: { label: "Sub Item 3" },
            },
          ],
        },
      ],
    },
    {
      id: "id-4",
      children: [],
      data: { label: "Root Item 2" },
    },
    {
      id: "id-5",
      children: [],
      data: { label: "Root Item 3" },
    },
  ]);
  return (
    <SortableTree
      {...props}
      value={value}
      onChange={setValue}
      renderItemContent={(item) => (
        <div>
          <div>{item.data?.label}</div>
        </div>
      )}
    />
  );
};

export const Default: Story = {
  args: {
    removable: true,
    collapsible: true,
    indentationWidth: 25,
  },
  render: (props) => <StoryHook {...props} />,
};
