# dnd-kit-tree

A React-based project utilizing `dnd-kit` to create a customizable and interactive tree component for drag-and-drop functionality.

## Features

- Drag-and-drop support for tree nodes.
- Customizable node rendering.
- Lightweight and performant.

## Installation

```bash
npm install dnd-kit-tree
```

## Example

```jsx
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
      renderItemContent={(item) => (
        <div>{item.data?.label}</div>
      )}
    />
  );
};
```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

This project is licensed under the MIT License.