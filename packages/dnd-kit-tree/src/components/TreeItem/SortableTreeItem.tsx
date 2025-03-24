import type { UniqueIdentifier } from "@dnd-kit/core";

import { CSSProperties } from "react";
import { CSS } from "@dnd-kit/utilities";
import { useSortable, AnimateLayoutChanges } from "@dnd-kit/sortable";

import { iOS } from "../../utilities";
import { TreeItem, Props as TreeItemProps } from "./TreeItem";

interface Props extends TreeItemProps {
  id: UniqueIdentifier;
}

const animateLayoutChanges: AnimateLayoutChanges = ({ isSorting, wasDragging }) =>
  !(isSorting || wasDragging);

export function SortableTreeItem({ id, depth, ...props }: Props) {
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
    id,
    animateLayoutChanges,
  });
  const style: CSSProperties = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  return (
    <TreeItem
      style={style}
      depth={depth}
      ghost={isDragging}
      disableSelection={iOS}
      ref={setDraggableNodeRef}
      disableInteraction={isSorting}
      wrapperRef={setDroppableNodeRef}
      handleProps={{
        ...attributes,
        ...listeners,
      }}
      {...props}
    />
  );
}
