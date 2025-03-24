import type { RefObject } from "react";
import type { UniqueIdentifier } from "@dnd-kit/core";

export interface TreeItem<T = unknown> {
  data?: T;
  id: UniqueIdentifier;
  children: TreeItem<T>[];
  collapsed?: boolean;
}

export type TreeItems<T> = TreeItem<T>[];

export interface FlattenedItem<T> extends TreeItem<T> {
  parentId: UniqueIdentifier | null;
  depth: number;
  index: number;
}

export type SensorContext = RefObject<{
  items: FlattenedItem<unknown>[];
  offset: number;
}>;
