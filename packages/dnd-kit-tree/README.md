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
npm install dnd-kit-tree @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
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

| Prop                | Type                                                                 | Default     | Description                                                                          |
| ------------------- | -------------------------------------------------------------------- | ----------- | ------------------------------------------------------------------------------------ |
| `value`             | `TreeItems<T>`                                                       | `[]`        | The tree data structure representing the nodes.                                      |
| `maxDepth`          | `number`                                                             | `undefined` | The maximum depth of the tree. (undefined = Infinity)                                |
| `grabbingCursor`    | `string`                                                             | `grabbing`  | The cursor style when dragging a tree node.                                          |
| `onChange`          | `(items: TreeItems<T>) => void`                                      | `undefined` | Callback function triggered when the tree structure changes.                         |
| `canMove`           | `(item: FlattenedItem<T>, parentItem?: FlattenedItem<T>) => boolean` | `undefined` | Callback function to check if the node can move to the new position                  |
| `onMove`            | `(action: SortableTreeMove) => void`                                 | `undefined` | Callback function triggered when a node is moved.                                    |
| `removable`         | `boolean`                                                            | `false`     | Enables the ability to remove tree nodes.                                            |
| `collapsible`       | `boolean`                                                            | `false`     | Enables the ability to collapse/expand tree nodes.                                   |
| `collapseChildren`  | `boolean`                                                            | `false`     | Determines whether the child elements of the node should be automatically collapsed. |
| `indentationWidth`  | `number`                                                             | `25`        | The width of indentation for child nodes in pixels.                                  |
| `adjustTranslateY`  | `number`                                                             | `0`         | Adjusts the vertical position of the dragged node.                                   |
| `virtual`           | `SortableTreeVirtualProps`                                           | `undefined` | Enables virtualization of the tree.                                                  |
| `renderItem`        | `(props: RenderItemProps<T>) => React.ReactNode`                     | `undefined` | Function to customize the rendering of tree nodes.                                   |
| `renderItemContent` | `(item: FlattenedItem<T>) => React.ReactNode`                        | `undefined` | Function to customize the rendering of tree node content.                            |

## CSS Class Names

- `dnd-tree-item`
- `dnd-tree-item-clone`
- `dnd-tree-item-indicator`
- `dnd-tree-item-container`
- `dnd-tree-item-container-clone`
- `dnd-tree-item-container-indicator`
- `dnd-tree-item-content`
- `dnd-tree-item-children-count`
- `dnd-tree-item-actions`
- `dnd-tree-item-action-handle`
- `dnd-tree-item-action-collapse`
- `dnd-tree-item-action-collapsed`
- `dnd-tree-item-action-delete`

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

This project is licensed under the MIT License.
