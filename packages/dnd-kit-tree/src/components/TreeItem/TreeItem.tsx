import clsx from "clsx";
import { CSSProperties, forwardRef, HTMLAttributes, ReactNode } from "react";

import { FlattenedItem } from "../../types";
import type { ActionProps } from "./components";
import { Action, Remove, Handle } from "./components";

import styles from "../../styles/DndKitTree.module.css";

export interface Props<T> extends Omit<HTMLAttributes<HTMLDivElement>, "id"> {
  depth: number;
  clone?: boolean;
  isSorting?: boolean;
  indicator?: boolean;
  childCount?: number;
  isDragging?: boolean;
  node: FlattenedItem<T>;
  indentationWidth: number;
  handleProps?: ActionProps;
  disableSelection?: boolean;

  onRemove?(): void;

  onCollapse?(): void;

  wrapperRef?(node: HTMLDivElement): void;

  renderContent?(node: FlattenedItem<T>): ReactNode;
}

export const TreeItem = forwardRef<HTMLDivElement, Props<unknown>>(
  (
    {
      node,
      clone,
      depth,
      style,
      isSorting,
      indicator,
      childCount,
      isDragging,
      handleProps,
      disableSelection,
      indentationWidth,
      onRemove,
      onCollapse,
      wrapperRef,
      renderContent,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={wrapperRef}
        {...props}
        style={{ "--padding": `${depth * indentationWidth}px` } as CSSProperties}
        className={clsx([
          styles.item,
          indicator && styles.itemIndicator,
          isDragging && styles.itemDragging,
          isDragging && indicator && styles.itemDraggingIndicator,
          isDragging && isSorting && styles.itemGhostSorting,
          disableSelection && styles.itemDisableSelection,
          clone && styles.itemClone,
          props.className,
        ])}
      >
        <div
          ref={ref}
          style={style}
          className={clsx(
            styles.itemContainer,
            isDragging && indicator && styles.itemContainerGhostIndicator,
            clone && styles.itemContainerClone
          )}
        >
          <div className={styles.itemActions}>
            <Handle className="dnd-tree-item-handle" {...handleProps} />
            {onCollapse && (
              <Action
                onClick={onCollapse}
                className={clsx([
                  styles.itemActionCollapse,
                  node.collapsed && node.children.length > 0 && styles.itemActionCollapsed,
                ])}
              >
                {collapseIcon}
              </Action>
            )}
          </div>
          <div className={styles.itemContent}>{renderContent ? renderContent(node) : node.id}</div>
          {!clone && onRemove && <Remove onClick={onRemove} />}
          {clone && childCount && childCount > 1 ? (
            <div className={styles.itemChildrenCount}>{childCount}</div>
          ) : null}
        </div>
      </div>
    );
  }
);

const collapseIcon = (
  <svg width="10" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 70 41">
    <path d="M30.76 39.2402C31.885 40.3638 33.41 40.995 35 40.995C36.59 40.995 38.115 40.3638 39.24 39.2402L68.24 10.2402C69.2998 9.10284 69.8768 7.59846 69.8494 6.04406C69.822 4.48965 69.1923 3.00657 68.093 1.90726C66.9937 0.807959 65.5106 0.178263 63.9562 0.150837C62.4018 0.123411 60.8974 0.700397 59.76 1.76024L35 26.5102L10.24 1.76024C9.10259 0.700397 7.59822 0.123411 6.04381 0.150837C4.4894 0.178263 3.00632 0.807959 1.90702 1.90726C0.807714 3.00657 0.178019 4.48965 0.150593 6.04406C0.123167 7.59846 0.700153 9.10284 1.75999 10.2402L30.76 39.2402Z" />
  </svg>
);

TreeItem.displayName = "TreeItem";
