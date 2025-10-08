import { CSS } from "@dnd-kit/utilities";
import { CSSProperties, ReactNode } from "react";
import { useSortable, AnimateLayoutChanges } from "@dnd-kit/sortable";

import { TreeItem, Props as TreeItemProps } from "./TreeItem";
import { FlattenedItem, RenderItemProps, TreeItemProjection } from "../../types";

interface Props<T> extends TreeItemProps<T> {
  itemProjected?: TreeItemProjection;
  renderItem?: (props: RenderItemProps<T>) => ReactNode;
  renderItemContent?: (item: FlattenedItem<T>) => ReactNode;
}

const animateLayoutChanges: AnimateLayoutChanges = ({ isSorting, wasDragging }) =>
  !(isSorting || wasDragging);

export function SortableTreeItem<T>({
  node,
  renderItem,
  renderItemContent,
  itemProjected,
  ...props
}: Props<T>) {
  const {
    isSorting,
    listeners,
    transform,
    isDragging,
    transition,
    attributes,
    setDraggableNodeRef,
    setDroppableNodeRef,
  } = useSortable({
    id: node.id,
    animateLayoutChanges,
  });
  const style: CSSProperties = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  return (
    <TreeItem
      node={node}
      style={style}
      isSorting={isSorting}
      isDragging={isDragging}
      renderItem={renderItem}
      ref={setDraggableNodeRef}
      itemProjected={itemProjected}
      wrapperRef={setDroppableNodeRef}
      renderContent={renderItemContent}
      handleProps={{
        ...attributes,
        ...listeners,
        style: {
          ...props.handleProps?.style,
          touchAction: "none",
        },
      }}
      {...props}
    />
  );
}
