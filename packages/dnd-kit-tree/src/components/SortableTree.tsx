import { createPortal } from "react-dom";
import { CSS } from "@dnd-kit/utilities";
import { useRef, useMemo, useState, useEffect, ReactNode, CSSProperties } from "react";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import {
  Modifier,
  useSensor,
  DndContext,
  useSensors,
  DragOverlay,
  DragEndEvent,
  Announcements,
  closestCenter,
  PointerSensor,
  DragMoveEvent,
  DragOverEvent,
  DropAnimation,
  DragStartEvent,
  UniqueIdentifier,
  MeasuringStrategy,
  defaultDropAnimation,
} from "@dnd-kit/core";

import type { TreeItems, FlattenedItem, SensorContext, RenderItemProps } from "../types";

import { VirtualList } from "./VirtualList";
import { SortableTreeItem } from "./TreeItem";
import {
  isSafari,
  buildTree,
  removeItem,
  flattenTree,
  setProperty,
  getProjection,
  getChildCount,
  removeChildrenOf,
} from "../utilities";

const measuring = {
  droppable: {
    strategy: MeasuringStrategy.Always,
  },
};

const dropAnimationConfig: DropAnimation = {
  keyframes({ transform }) {
    return [
      { opacity: 1, transform: CSS.Transform.toString(transform.initial) },
      {
        opacity: 0,
        transform: CSS.Transform.toString({
          ...transform.final,
          x: transform.final.x + 5,
          y: transform.final.y + 5,
        }),
      },
    ];
  },
  easing: "ease-out",
  sideEffects({ active }) {
    active.node.animate([{ opacity: 0 }, { opacity: 1 }], {
      duration: defaultDropAnimation.duration,
      easing: defaultDropAnimation.easing,
    });
  },
};

export interface SortableTreeVirtualProps {
  height: number;
  itemSize: number;
}

export interface SortableTreeProps<T> {
  maxDepth?: number;
  removable?: boolean;
  value: TreeItems<T>;
  collapsible?: boolean;
  adjustTranslateY?: number;
  indentationWidth?: number;
  virtual?: SortableTreeVirtualProps;
  grabbingCursor?: CSSProperties["cursor"];
  onChange?: (items: TreeItems<T>) => void;
  renderItem?: (props: RenderItemProps<T>) => ReactNode;
  renderItemContent?: (item: FlattenedItem<T>) => ReactNode;
}

export function SortableTree<T>({
  value,
  virtual,
  maxDepth,
  removable,
  collapsible,
  onChange,
  renderItem,
  indentationWidth = 50,
  adjustTranslateY = -25,
  grabbingCursor = "grabbing",
  renderItemContent = (item) => <div>{item.id}</div>,
}: SortableTreeProps<T>) {
  const indicator = true;
  const [activeNode, setActiveNode] = useState<FlattenedItem<T> | null>(null);
  const [overId, setOverId] = useState<UniqueIdentifier | null>(null);
  const [offsetLeft, setOffsetLeft] = useState(0);
  const [currentPosition, setCurrentPosition] = useState<{
    parentId: UniqueIdentifier | null;
    overId: UniqueIdentifier;
  } | null>(null);

  const defaultBodyCursor = useRef<string | null>(null);
  const defaultBodyUserSelect = useRef<string | null>(null);

  const flattenedItems = useMemo(() => {
    const flattenedTree = flattenTree<T>(value);
    const collapsedItems = flattenedTree.reduce<string[]>(
      (acc, { children, collapsed, id }) =>
        (collapsed && children.length ? [...acc, id] : acc) as string[],
      []
    );

    return removeChildrenOf(
      flattenedTree,
      activeNode?.id != null ? [activeNode.id, ...collapsedItems] : collapsedItems
    ) as FlattenedItem<T>[];
  }, [activeNode, value]);

  const projected =
    activeNode?.id && overId
      ? getProjection(flattenedItems, activeNode.id, overId, offsetLeft, indentationWidth, maxDepth)
      : null;

  const sensorContext: SensorContext = useRef({
    items: flattenedItems,
    offset: offsetLeft,
  });

  const sensors = useSensors(useSensor(PointerSensor));
  const sortedIds = useMemo(() => flattenedItems.map(({ id }) => id), [flattenedItems]);

  useEffect(() => {
    sensorContext.current = {
      items: flattenedItems,
      offset: offsetLeft,
    };
  }, [flattenedItems, offsetLeft]);

  const announcements: Announcements = {
    onDragStart({ active }) {
      return `Picked up ${active.id}.`;
    },
    onDragMove({ active, over }) {
      return getMovementAnnouncement("onDragMove", active.id, over?.id);
    },
    onDragOver({ active, over }) {
      return getMovementAnnouncement("onDragOver", active.id, over?.id);
    },
    onDragEnd({ active, over }) {
      return getMovementAnnouncement("onDragEnd", active.id, over?.id);
    },
    onDragCancel({ active }) {
      return `Moving was cancelled. ${active.id} was dropped in its original position.`;
    },
  };

  function handleDragStart({ active: { id: activeId } }: DragStartEvent) {
    setOverId(activeId);

    const activeItem = flattenedItems.find(({ id }) => id === activeId);
    setActiveNode(activeItem || null);

    if (activeItem) {
      setCurrentPosition({
        parentId: activeItem.parentId,
        overId: activeId,
      });
    }

    defaultBodyCursor.current = document.body.style.getPropertyValue("cursor");
    defaultBodyUserSelect.current = document.body.style.getPropertyValue("user-select");
    document.body.style.setProperty("cursor", grabbingCursor);
    document.body.style.setProperty("user-select", "none");
  }

  function handleDragMove({ delta }: DragMoveEvent) {
    setOffsetLeft(delta.x);
  }

  function handleDragOver({ over }: DragOverEvent) {
    setOverId(over?.id ?? null);
  }

  function handleDragEnd({ active, over }: DragEndEvent) {
    resetState();

    if (projected && over) {
      const { depth, parentId } = projected;
      const clonedItems: FlattenedItem<T>[] = JSON.parse(JSON.stringify(flattenTree(value)));
      const overIndex = clonedItems.findIndex(({ id }) => id === over.id);
      const activeIndex = clonedItems.findIndex(({ id }) => id === active.id);
      const activeTreeItem = clonedItems[activeIndex];

      clonedItems[activeIndex] = { ...activeTreeItem, depth, parentId };

      const sortedItems = arrayMove(clonedItems, activeIndex, overIndex);
      const newItems = buildTree(sortedItems) as TreeItems<T>;

      onChange?.(newItems);
    }
  }

  function handleDragCancel() {
    resetState();
  }

  function resetState() {
    setOverId(null);
    setActiveNode(null);
    setOffsetLeft(0);
    setCurrentPosition(null);

    document.body.style.setProperty("cursor", defaultBodyCursor.current);
    document.body.style.setProperty("user-select", defaultBodyUserSelect.current);
  }

  function handleRemove(id: UniqueIdentifier) {
    onChange?.(removeItem(value, id) as TreeItems<T>);
  }

  function handleCollapse(id: UniqueIdentifier) {
    onChange?.(
      setProperty(value, id, "collapsed", (value) => {
        return !value;
      }) as TreeItems<T>
    );
  }

  function getMovementAnnouncement(
    eventName: string,
    activeId: UniqueIdentifier,
    overId?: UniqueIdentifier
  ) {
    if (overId && projected) {
      if (eventName !== "onDragEnd") {
        if (
          currentPosition &&
          projected.parentId === currentPosition.parentId &&
          overId === currentPosition.overId
        ) {
          return;
        } else {
          setCurrentPosition({
            parentId: projected.parentId,
            overId,
          });
        }
      }

      const clonedItems: FlattenedItem<T>[] = JSON.parse(JSON.stringify(flattenTree(value)));
      const overIndex = clonedItems.findIndex(({ id }) => id === overId);
      const activeIndex = clonedItems.findIndex(({ id }) => id === activeId);
      const sortedItems = arrayMove(clonedItems, activeIndex, overIndex);

      const previousItem = sortedItems[overIndex - 1];

      let announcement;
      const movedVerb = eventName === "onDragEnd" ? "dropped" : "moved";
      const nestedVerb = eventName === "onDragEnd" ? "dropped" : "nested";

      if (!previousItem) {
        const nextItem = sortedItems.length > 1 ? sortedItems[overIndex + 1] : undefined;
        announcement =
          nextItem !== undefined
            ? `${activeId} was ${movedVerb} before ${nextItem.id}.`
            : `Cannot move ${activeId}.`;
      } else {
        if (projected.depth > previousItem.depth) {
          announcement = `${activeId} was ${nestedVerb} under ${previousItem.id}.`;
        } else {
          let previousSibling: FlattenedItem<T> | undefined = previousItem;
          while (previousSibling && projected.depth < previousSibling.depth) {
            const parentId: UniqueIdentifier | null = previousSibling.parentId;
            previousSibling = sortedItems.find(({ id }) => id === parentId);
          }

          if (previousSibling) {
            announcement = `${activeId} was ${movedVerb} after ${previousSibling.id}.`;
          }
        }
      }

      return announcement;
    }

    return;
  }

  const adjustTranslate: Modifier = ({ transform }) => {
    return {
      ...transform,
      // Fix Y position to prevent the clone from jumping
      y: transform.y + adjustTranslateY,
    };
  };

  const renderSortableItem = (node: FlattenedItem<T>) => (
    <SortableTreeItem
      node={node}
      key={node.id}
      indicator={indicator}
      renderItem={renderItem}
      renderContent={renderItemContent}
      indentationWidth={indentationWidth}
      onRemove={removable ? () => handleRemove(node.id) : undefined}
      depth={node.id === activeNode?.id && projected ? projected.depth : node.depth}
      onCollapse={collapsible && node.children.length ? () => handleCollapse(node.id) : undefined}
    />
  );

  return (
    <DndContext
      sensors={sensors}
      measuring={measuring}
      onDragEnd={handleDragEnd}
      onDragMove={handleDragMove}
      onDragOver={handleDragOver}
      onDragStart={handleDragStart}
      onDragCancel={handleDragCancel}
      accessibility={{ announcements }}
      collisionDetection={closestCenter}
    >
      <SortableContext items={sortedIds} strategy={verticalListSortingStrategy}>
        {virtual ? (
          <VirtualList
            {...virtual}
            itemCount={flattenedItems.length}
            stickyIndices={
              activeNode ? [flattenedItems.findIndex(({ id }) => id === activeNode.id)] : undefined
            }
            onScroll={(_, e) => {
              // Fix Safari automatic scroll issue
              if (isSafari) {
                const el = e.target as HTMLDivElement;
                const displayOriginal = el.style.getPropertyValue("display");
                if (activeNode) {
                  el.style.setProperty("display", "none");
                  void el.offsetHeight;
                  el.style.setProperty("display", displayOriginal);
                } else {
                  el.style.setProperty("display", displayOriginal);
                }
              }
            }}
            renderItem={({ index, style }) => {
              const node = flattenedItems[index];
              if (!node) {
                return null;
              }
              return (
                <div key={index} style={{ ...style, position: "absolute" }}>
                  {renderSortableItem(node)}
                </div>
              );
            }}
          />
        ) : (
          flattenedItems.map((node) => renderSortableItem(node))
        )}
        {createPortal(
          <DragOverlay
            dropAnimation={dropAnimationConfig}
            modifiers={indicator ? [adjustTranslate] : undefined}
          >
            {activeNode?.id && activeNode ? (
              <SortableTreeItem
                clone
                depth={0}
                node={activeNode}
                renderItem={renderItem}
                indentationWidth={indentationWidth}
                childCount={getChildCount(value, activeNode?.id) + 1}
                renderItemContent={renderItemContent}
              />
            ) : null}
          </DragOverlay>,
          document.body
        )}
      </SortableContext>
    </DndContext>
  );
}
