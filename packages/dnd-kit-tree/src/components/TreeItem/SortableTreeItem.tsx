import { CSS } from "@dnd-kit/utilities";
import { CSSProperties, ReactNode } from "react";
import { useSortable, AnimateLayoutChanges } from "@dnd-kit/sortable";

import { FlattenedItem, RenderItemProps } from "../../types";
import { TreeItem, Props as TreeItemProps } from "./TreeItem";

interface Props<T> extends TreeItemProps<T> {
  renderItem?: (props: RenderItemProps<T>) => ReactNode;
  renderItemContent?: (item: FlattenedItem<T>) => ReactNode;
}

const animateLayoutChanges: AnimateLayoutChanges = ({ isSorting, wasDragging }) =>
  !(isSorting || wasDragging);

export function SortableTreeItem<T>({ node, renderItem, renderItemContent, ...props }: Props<T>) {
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
