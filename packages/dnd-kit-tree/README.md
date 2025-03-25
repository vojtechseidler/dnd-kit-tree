# dnd-kit-tree

![npm](https://img.shields.io/npm/v/dnd-kit-tree)
![license](https://img.shields.io/npm/l/dnd-kit-tree)

A React-based project utilizing `dnd-kit` to create a customizable and interactive tree component for drag-and-drop
functionality.

## Features

- Drag-and-drop support for tree nodes.
- Customizable node rendering.
- Lightweight and performant.

## Demo
[View Demo](https://vojtechseidler.github.io/dnd-kit-tree/?path=/story/stories-sortabletree--default)

![Example Image 1](https://raw.githubusercontent.com/vojtechseidler/dnd-kit-tree/refs/heads/main/image-1.jpg)

![Example Image 2](https://raw.githubusercontent.com/vojtechseidler/dnd-kit-tree/refs/heads/main/image-2.jpg)

## Installation

```bash
npm install dnd-kit-tree styled-components @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
```

## Example

```tsx
import { useState } from "react";
import { SortableTree, TreeItems } from "dnd-kit-tree";

type Data = {
  label: string;
};

const MyComponent = () => {
  const [value, setValue] = useState<TreeItems<Data>>([
    {
      id: "id-1",
      data: { label: "Item 1" },
      children: [
        {
          id: "id-2",
          data: { label: "Item 2" },
          children: [
            {
              id: "id-3",
              children: [],
              data: { label: "Item 3" },
            },
          ],
        },
      ],
    },
    {
      id: "id-4",
      children: [],
      data: { label: "Item 4" },
    },
    {
      id: "id-5",
      children: [],
      data: { label: "Item 5" },
    },
  ]);

  return (
    <SortableTree
      removable
      collapsible
      value={value}
      onChange={setValue}
      indentationWidth={25}
      renderItemContent={(item) => <div>{item.data?.label}</div>}
    />
  );
};
```

## Props

| Prop                | Type                                     | Default     | Description                                                  |
| ------------------- | ---------------------------------------- | ----------- | ------------------------------------------------------------ |
| `value`             | `TreeItems<T>`                           | `[]`        | The tree data structure representing the nodes.              |
| `onChange`          | `(items: TreeItems<T>) => void`          | `undefined` | Callback function triggered when the tree structure changes. |
| `removable`         | `boolean`                                | `false`     | Enables the ability to remove tree nodes.                    |
| `collapsible`       | `boolean`                                | `false`     | Enables the ability to collapse/expand tree nodes.           |
| `indentationWidth`  | `number`                                 | `25`        | The width of indentation for child nodes in pixels.          |
| `renderItemContent` | `(item: TreeItem<T>) => React.ReactNode` | `undefined` | Function to customize the rendering of tree node content.    |

## CSS Class Names

- `dnd-tree-item-wrapper`
- `dnd-tree-item-ghost`
- `dnd-tree-item-clone`
- `dnd-tree-item-indicator`
- `dnd-tree-item-disable-selection`
- `dnd-tree-item-disable-interaction`
- `dnd-tree-item`
- `dnd-tree-item-actions`
- `dnd-tree-item-handle`
- `dnd-tree-item-collapse`
- `dnd-tree-item-collapsed`
- `dnd-tree-item-content`
- `dnd-tree-item-remove`
- `dnd-tree-item-count`

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

This project is licensed under the MIT License.
