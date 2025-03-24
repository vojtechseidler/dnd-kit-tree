# dnd-kit-tree

A React-based project utilizing `dnd-kit` to create a customizable and interactive tree component for drag-and-drop functionality.

## Features

- Drag-and-drop support for tree nodes.
- Customizable node rendering.
- Keyboard accessibility.
- Lightweight and performant.

## Installation

```bash
npm install dnd-kit-tree
```

## Usage

```jsx
import React from 'react';
import Tree from 'dnd-kit-tree';

const App = () => {
  const treeData = [
    { id: '1', parentId: null, text: 'Node 1' },
    { id: '2', parentId: '1', text: 'Child Node 1' },
  ];

  return <Tree data={treeData} />;
};

export default App;
```

## Props

| Prop       | Type     | Description                          |
|------------|----------|--------------------------------------|
| `data`     | `array`  | Array of tree nodes.                 |
| `onDragEnd`| `func`   | Callback for drag-and-drop events.   |

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

This project is licensed under the MIT License.