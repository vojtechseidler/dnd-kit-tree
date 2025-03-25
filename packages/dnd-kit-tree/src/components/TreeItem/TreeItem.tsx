import clsx from "clsx";
import styled from "styled-components";
import { forwardRef, HTMLAttributes, ReactNode } from "react";

import { FlattenedItem } from "../../types";
import type { ActionProps } from "./components";
import { Action, Remove, Handle } from "./components";

export interface Props<T> extends Omit<HTMLAttributes<HTMLDivElement>, "id"> {
  depth: number;
  clone?: boolean;
  ghost?: boolean;
  indicator?: boolean;
  childCount?: number;
  node: FlattenedItem<T>;
  indentationWidth: number;
  handleProps?: ActionProps;
  disableSelection?: boolean;
  disableInteraction?: boolean;
  onRemove?(): void;
  onCollapse?(): void;
  wrapperRef?(node: HTMLDivElement): void;
  renderContent?(node: FlattenedItem<T>): ReactNode;
}

export const TreeItem = forwardRef<HTMLDivElement, Props<unknown>>(
  (
    {
      node,
      ghost,
      clone,
      depth,
      style,
      indicator,
      childCount,
      handleProps,
      disableSelection,
      indentationWidth,
      disableInteraction,
      onRemove,
      onCollapse,
      wrapperRef,
      renderContent,
      ...props
    },
    ref
  ) => {
    return (
      <Wrapper
        $depth={depth}
        ref={wrapperRef}
        $indentationWidth={indentationWidth}
        {...props}
        className={clsx([
          "dnd-tree-item-wrapper",
          {
            "dnd-tree-item-ghost": ghost,
            "dnd-tree-item-clone": clone,
            "dnd-tree-item-indicator": indicator,
            "dnd-tree-item-disable-selection": disableSelection,
            "dnd-tree-item-disable-interaction": disableInteraction,
          },
          props.className,
        ])}
      >
        <Item className="dnd-tree-item" ref={ref} style={style}>
          <ItemActions className="dnd-tree-item-actions">
            <Handle className="dnd-tree-item-handle" {...handleProps} />
            {onCollapse && (
              <Action
                onClick={onCollapse}
                className={clsx([
                  "dnd-tree-item-collapse",
                  { "dnd-tree-item-collapsed": node.collapsed && node.children.length > 0 },
                ])}
              >
                {collapseIcon}
              </Action>
            )}
          </ItemActions>
          <ItemContent className="dnd-tree-item-content">
            {renderContent ? renderContent(node) : node.id}
          </ItemContent>
          {!clone && onRemove && <Remove className="dnd-tree-item-remove" onClick={onRemove} />}
          {clone && childCount && childCount > 1 ? (
            <ChildrenCount className="dnd-tree-item-count">{childCount}</ChildrenCount>
          ) : null}
        </Item>
      </Wrapper>
    );
  }
);

const collapseIcon = (
  <svg width="10" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 70 41">
    <path d="M30.76 39.2402C31.885 40.3638 33.41 40.995 35 40.995C36.59 40.995 38.115 40.3638 39.24 39.2402L68.24 10.2402C69.2998 9.10284 69.8768 7.59846 69.8494 6.04406C69.822 4.48965 69.1923 3.00657 68.093 1.90726C66.9937 0.807959 65.5106 0.178263 63.9562 0.150837C62.4018 0.123411 60.8974 0.700397 59.76 1.76024L35 26.5102L10.24 1.76024C9.10259 0.700397 7.59822 0.123411 6.04381 0.150837C4.4894 0.178263 3.00632 0.807959 1.90702 1.90726C0.807714 3.00657 0.178019 4.48965 0.150593 6.04406C0.123167 7.59846 0.700153 9.10284 1.75999 10.2402L30.76 39.2402Z" />
  </svg>
);

TreeItem.displayName = "TreeItem";

const Wrapper = styled.div<{
  $depth: number;
  $indentationWidth: number;
}>`
  margin: 10px 0;
  list-style: none;
  box-sizing: border-box;
  padding-left: ${({ $depth, $indentationWidth }) => $depth * $indentationWidth}px;

  .dnd-tree-item-remove,
  .dnd-tree-item-collapse,
  .dnd-tree-item-handle {
    svg {
      fill: #777;
      transition: all 0.2s ease-in-out;
    }

    &:hover svg {
      fill: #000;
    }
  }

  &.dnd-tree-item-clone {
    display: inline-block;
    pointer-events: none;
    padding: 20px 0 0 25px;

    .dnd-tree-item {
      padding: 10px;
      border-radius: 5px;
      box-shadow: 0 15px 15px 0 rgba(34, 33, 81, 0.1);
    }
  }

  &.dnd-tree-item-ghost {
    &.dnd-tree-item-indicator {
      opacity: 1;
      position: relative;
      z-index: 1;
      margin-bottom: -1px;

      .dnd-tree-item {
        position: relative;
        padding: 0;
        height: 8px;
        border-color: #2389ff;
        background-color: #56a1f8;

        > * {
          height: 0;
          opacity: 0;
        }
      }
    }

    &:not(.dnd-tree-item-indicator) {
      opacity: 0.5;
      display: none;
    }

    .dnd-tree-item > * {
      box-shadow: none;
      background-color: transparent;
    }
  }

  &.dnd-tree-item-disable-interaction {
    pointer-events: none;
  }

  &.dnd-tree-item-cone,
  &.dnd-tree-item-disable-selection {
    .dnd-tree-item-text,
    .dnd-tree-item-count {
      user-select: none;
      -webkit-user-select: none;
    }
  }

  .dnd-tree-item-collapse {
    svg {
      transition: transform 250ms ease;
    }

    &.dnd-tree-item-collapsed svg {
      transform: rotate(-90deg);
    }
  }
`;

const Item = styled.div`
  display: flex;
  position: relative;
  align-items: center;
  box-sizing: border-box;
  justify-content: flex-start;

  padding: 10px;

  color: #222;
  background-color: #fff;

  border-radius: 5px;
  border: 1px solid #dedede;
`;

const ItemActions = styled.div`
  display: flex;
  align-items: center;
`;

const ChildrenCount = styled.span`
  position: absolute;
  top: -10px;
  right: -10px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: #2389ff;
  font-weight: 600;
  color: #fff;
  line-height: 1;
  font-size: 12px;
`;

const ItemContent = styled.span`
  flex-grow: 1;
  padding: 0 10px;
`;
