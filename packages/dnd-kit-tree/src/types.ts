import type { UniqueIdentifier } from "@dnd-kit/core";
import { CSSProperties, ForwardedRef, HTMLAttributes, RefObject } from "react";

export type TreeItem<T = unknown> = {
  data?: T;
  id: UniqueIdentifier;
  children: TreeItem<T>[];
  collapsed?: boolean;
};

export type TreeItems<T = unknown> = TreeItem<T>[];

export interface FlattenedItem<T> extends TreeItem<T> {
  parentId: UniqueIdentifier | null;
  depth: number;
  index: number;
}

export type SensorContext = RefObject<{
  items: FlattenedItem<unknown>[];
  offset: number;
}>;

export interface RenderItemProps<T> {
  node: FlattenedItem<T>;
  depth: number;
  clone: boolean;
  childCount: number;
  isSorting: boolean;
  isDragging: boolean;
  isRemovable: boolean;
  isCollapsible: boolean;
  containerStyle?: CSSProperties;
  wrapperRef?: (node: HTMLDivElement) => void;
  containerRef: ForwardedRef<HTMLDivElement>;
  handleProps?: HTMLAttributes<HTMLButtonElement>;
  onRemove: () => void;
  onCollapse: () => void;
}
