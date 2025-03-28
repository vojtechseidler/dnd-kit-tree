import type { UniqueIdentifier } from "@dnd-kit/core";

import { arrayMove } from "@dnd-kit/sortable";

import type { TreeItem, TreeItems, FlattenedItem } from "./types";

export const iOS = /iPad|iPhone|iPod/.test(navigator.platform);

function getDragDepth(offset: number, indentationWidth: number) {
  return Math.round(offset / indentationWidth);
}

export function getProjection(
  items: FlattenedItem<unknown>[],
  activeId: UniqueIdentifier,
  overId: UniqueIdentifier,
  dragOffset: number,
  indentationWidth: number,
  depthLimit?: number
) {
  const item = items.find(({ id }) => id === activeId);
  const overItemIndex = items.findIndex(({ id }) => id === overId);
  const activeItemIndex = items.findIndex(({ id }) => id === activeId);
  const activeItem = items[activeItemIndex];
  const newItems = arrayMove(items, activeItemIndex, overItemIndex);
  const previousItem = newItems[overItemIndex - 1];
  const nextItem = newItems.length > 1 ? newItems[overItemIndex + 1] : undefined;

  const dragDepth = getDragDepth(dragOffset, indentationWidth);
  const projectedDepth = activeItem.depth + dragDepth;
  let depth = projectedDepth;

  const minDepth = nextItem ? getMinDepth({ nextItem }) : 0;
  let maxDepth = getMaxDepth({
    previousItem,
    depthLimit,
  });

  if (projectedDepth >= maxDepth) {
    depth = maxDepth;
  } else if (projectedDepth < minDepth) {
    depth = minDepth;
  }

  const parentNode = getParentNode(newItems, overItemIndex, depth, previousItem);

  // If the item has children, we need to check if the depth limit is reached
  if (depthLimit !== undefined && item && parentNode) {
    const treeDepth = getMaxDepthFromFlattenItem(item);
    const treeMaxDepth = treeDepth + parentNode.depth;
    if (treeMaxDepth >= depthLimit) {
      maxDepth = parentNode.depth;
    }
  }

  if (depth >= maxDepth) {
    depth = maxDepth;
  } else if (depth < minDepth) {
    depth = minDepth;
  }

  return {
    depth,
    maxDepth,
    minDepth,
    parentId: getParentNode(newItems, overItemIndex, depth, previousItem)?.id ?? null,
  };
}

function getParentNode(
  items: FlattenedItem<unknown>[],
  overIndex: number,
  depth: number,
  previousItem?: FlattenedItem<unknown>
) {
  if (depth === 0 || !previousItem) {
    return null;
  }

  if (depth === previousItem.depth) {
    return items.find(({ id }) => id === previousItem.parentId);
  }

  if (depth > previousItem.depth) {
    return items.find(({ id }) => id === previousItem.id);
  }

  const parentId = items
    .slice(0, overIndex)
    .reverse()
    .find((item) => item.depth === depth)?.parentId;

  return parentId ? items.find(({ id }) => id === parentId) : undefined;
}

function getMaxDepth({
  depthLimit,
  previousItem,
}: {
  depthLimit?: number;
  previousItem: FlattenedItem<unknown>;
}) {
  if (previousItem) {
    const depth = previousItem.depth + 1;
    return depthLimit !== undefined && depth > depthLimit ? depthLimit : depth;
  }
  return 0;
}

function getMinDepth({ nextItem }: { nextItem: FlattenedItem<unknown> }) {
  if (nextItem) {
    return nextItem.depth;
  }

  return 0;
}

function flatten<T>(
  items: TreeItems<T>,
  parentId: UniqueIdentifier | null = null,
  depth = 0
): FlattenedItem<T>[] {
  return items.reduce<FlattenedItem<T>[]>((acc, item, index) => {
    return [
      ...acc,
      { ...item, parentId, depth, index },
      ...flatten<T>(item.children, item.id, depth + 1),
    ];
  }, []);
}

export function flattenTree<T>(items: TreeItems<T>): FlattenedItem<T>[] {
  return flatten(items);
}

export function buildTree(flattenedItems: FlattenedItem<unknown>[]): TreeItems<unknown> {
  const root: TreeItem = { id: "root", children: [] };
  const nodes: Record<string, TreeItem> = { [root.id]: root };
  const items = flattenedItems.map((item) => ({ ...item, children: [] }));

  for (const item of items) {
    const { id, children } = item;
    const parentId = item.parentId ?? root.id;
    const parent = nodes[parentId] ?? findItem(items, parentId);

    nodes[id] = { id, children };
    parent.children.push(item);
  }

  return root.children;
}

export function findItem(items: TreeItem[], itemId: UniqueIdentifier) {
  return items.find(({ id }) => id === itemId);
}

export function findItemDeep(
  items: TreeItems<unknown>,
  itemId: UniqueIdentifier
): TreeItem | undefined {
  for (const item of items) {
    const { id, children } = item;

    if (id === itemId) {
      return item;
    }

    if (children.length) {
      const child = findItemDeep(children, itemId);

      if (child) {
        return child;
      }
    }
  }

  return undefined;
}

export function removeItem(items: TreeItems<unknown>, id: UniqueIdentifier) {
  const newItems = [];

  for (const item of items) {
    if (item.id === id) {
      continue;
    }

    if (item.children.length) {
      item.children = removeItem(item.children, id);
    }

    newItems.push(item);
  }

  return newItems;
}

export function setProperty<T extends keyof TreeItem>(
  items: TreeItems<unknown>,
  id: UniqueIdentifier,
  property: T,
  setter: (value: TreeItem[T]) => TreeItem[T]
) {
  for (const item of items) {
    if (item.id === id) {
      item[property] = setter(item[property]);
      continue;
    }

    if (item.children.length) {
      item.children = setProperty(item.children, id, property, setter);
    }
  }

  return [...items];
}

function countChildren(items: TreeItem[], count = 0): number {
  return items.reduce((acc, { children }) => {
    if (children.length) {
      return countChildren(children, acc + 1);
    }

    return acc + 1;
  }, count);
}

export function getChildCount(items: TreeItems<unknown>, id: UniqueIdentifier) {
  const item = findItemDeep(items, id);

  return item ? countChildren(item.children) : 0;
}

export function removeChildrenOf(items: FlattenedItem<unknown>[], ids: UniqueIdentifier[]) {
  const excludeParentIds = [...ids];

  return items.filter((item) => {
    if (item.parentId && excludeParentIds.includes(item.parentId)) {
      if (item.children.length) {
        excludeParentIds.push(item.id);
      }
      return false;
    }

    return true;
  });
}

function getMaxDepthFromFlattenItem(item: FlattenedItem<unknown>, initial: number = 0): number {
  let res = initial;
  if (item.children.length) {
    res += 1;
    for (const child of item.children) {
      res = Math.max(res, getMaxDepthFromFlattenItem(child as FlattenedItem<unknown>, res));
    }
  }
  return res;
}
