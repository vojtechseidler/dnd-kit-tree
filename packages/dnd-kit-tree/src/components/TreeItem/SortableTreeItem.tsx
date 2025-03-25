import { CSS } from "@dnd-kit/utilities";
import { CSSProperties, ReactNode } from "react";
import { useSortable, AnimateLayoutChanges } from "@dnd-kit/sortable";

import { iOS } from "../../utilities";
import { FlattenedItem } from "../../types";
import { TreeItem, Props as TreeItemProps } from "./TreeItem";

interface Props<T> extends TreeItemProps<T> {
  renderItemContent?: (item: FlattenedItem<T>) => ReactNode;
}

const animateLayoutChanges: AnimateLayoutChanges = ({ isSorting, wasDragging }) =>
  !(isSorting || wasDragging);

export function SortableTreeItem<T>({ node, renderItemContent, ...props }: Props<T>) {
  const {
    isSorting,
    listeners,
    transform,
    transition,
    attributes,
    isDragging,
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
      disableSelection={iOS}
      ref={setDraggableNodeRef}
      wrapperRef={setDroppableNodeRef}
      renderContent={renderItemContent}
      handleProps={{
        ...attributes,
        ...listeners,
      }}
      {...props}
    />
  );
}
