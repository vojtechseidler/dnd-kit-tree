import clsx from "clsx";
import { useState } from "react";
import { twMerge } from "tailwind-merge";
import type { Meta, StoryObj } from "@storybook/react";

import { SortableTree } from "dnd-kit-tree";
import type { SortableTreeProps, TreeItems } from "dnd-kit-tree";

const meta: Meta<typeof SortableTree> = {
  component: SortableTree,
};

export default meta;

type Story = StoryObj<typeof SortableTree>;

type Data = {
  label: string;
};

const StoryHook = (props: SortableTreeProps<unknown>) => {
  const [value, setValue] = useState<TreeItems<Data>>([
    {
      id: "id-1",
      data: { label: "Root Item 1" },
      children: [
        {
          id: "id-2",
          data: { label: "Sub Item 2" },
          children: [
            {
              id: "id-3",
              children: [],
              data: { label: "Sub Item 3" },
            },
          ],
        },
      ],
    },
    {
      id: "id-4",
      children: [],
      data: { label: "Root Item 2" },
    },
    {
      id: "id-5",
      children: [],
      data: { label: "Root Item 3" },
    },
  ]);
  return (
    <SortableTree
      {...props}
      value={value}
      onChange={setValue}
      renderItemContent={(item) => (
        <div>
          <div>{item.data?.label}</div>
        </div>
      )}
    />
  );
};

export const Default: Story = {
  args: {
    removable: true,
    collapsible: true,
    maxDepth: 5,
    indentationWidth: 25,
  },
  render: (props) => <StoryHook {...props} />,
};

const StoryHookCustom = (props: SortableTreeProps<unknown>) => {
  const [value, setValue] = useState<TreeItems<Data>>([
    {
      id: "id-1",
      data: { label: "Root Item 1" },
      children: [
        {
          id: "id-2",
          data: { label: "Sub Item 2" },
          children: [
            {
              id: "id-3",
              children: [],
              data: { label: "Sub Item 3" },
            },
          ],
        },
      ],
    },
    {
      id: "id-4",
      children: [],
      data: { label: "Root Item 2" },
    },
    {
      id: "id-5",
      children: [],
      data: { label: "Root Item 3" },
    },
  ]);

  return (
    <SortableTree
      {...props}
      value={value}
      onChange={setValue}
      adjustTranslateY={-20}
      renderItem={(itemProps) => (
        <div ref={itemProps.wrapperRef}>
          <div style={{
            zIndex: 1,
            padding: "5px 0",
            position: "relative",
            paddingLeft: itemProps.depth * (props.indentationWidth ?? 40),
          }}>
            <div
              ref={itemProps.containerRef}
              style={{
                ...(itemProps.isDragging ? {
                  height: 44,
                  padding: 10,
                  display: "flex",
                  borderRadius: 5,
                  position: "relative",
                  border: "1px dashed #000",
                  backgroundColor: "rgba(0,0,0,0.1)",
                } : {
                  gap: 10,
                  height: 44,
                  padding: 10,
                  borderRadius: 5,
                  position: "relative",
                  alignItems: "center",
                  backgroundColor: "white",
                  border: "1px solid #ccc",
                  display: itemProps.clone ? "inline-flex" : "flex",
                }),
                ...itemProps.containerStyle,
              }}
            >
              {!itemProps.isDragging && (
                <>
                  <div style={{
                    gap: 10,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}>
                    <button
                      {...itemProps.handleProps}
                      style={{
                        margin: 0,
                        padding: 5,
                        color: "#888",
                        cursor: "grab",
                        border: "none",
                        display: "flex",
                        appearance: "none",
                        background: "none",
                        userSelect: "none",
                        position: "relative",
                        transition: "color 0.2s",
                        justifyContent: "center",
                        ...itemProps.handleProps?.style,
                      }}
                    >
                      <svg viewBox="0 0 20 20" width="12">
                        <path
                          d="M7 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 2zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 14zm6-8a2 2 0 1 0-.001-4.001A2 2 0 0 0 13 6zm0 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 14z"></path>
                      </svg>
                    </button>
                    {itemProps.isCollapsible && (
                      <button
                        onClick={itemProps.onCollapse}
                        style={{
                          margin: 0,
                          padding: 5,
                          color: "#888",
                          border: "none",
                          display: "flex",
                          cursor: "pointer",
                          appearance: "none",
                          background: "none",
                          userSelect: "none",
                          position: "relative",
                          transition: "color 0.2s",
                          justifyContent: "center",
                        }}
                      >
                        <svg width="10" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 70 41" style={{
                          transition: "transform 0.2s",
                          transform: itemProps.node.collapsed ? "rotate(-90deg)" : "rotate(0deg)",
                        }}>
                          <path
                            d="M30.76 39.2402C31.885 40.3638 33.41 40.995 35 40.995C36.59 40.995 38.115 40.3638 39.24 39.2402L68.24 10.2402C69.2998 9.10284 69.8768 7.59846 69.8494 6.04406C69.822 4.48965 69.1923 3.00657 68.093 1.90726C66.9937 0.807959 65.5106 0.178263 63.9562 0.150837C62.4018 0.123411 60.8974 0.700397 59.76 1.76024L35 26.5102L10.24 1.76024C9.10259 0.700397 7.59822 0.123411 6.04381 0.150837C4.4894 0.178263 3.00632 0.807959 1.90702 1.90726C0.807714 3.00657 0.178019 4.48965 0.150593 6.04406C0.123167 7.59846 0.700153 9.10284 1.75999 10.2402L30.76 39.2402Z" />
                        </svg>
                      </button>
                    )}
                  </div>
                  <div style={{
                    flexGrow: 1,
                    height: 20,
                  }}>
                    {itemProps.node.data?.label}
                  </div>
                  {itemProps.isRemovable && (
                    <div>
                      <button
                        onClick={() => {
                          if (confirm("Are you sure you want to remove this item?")) {
                            itemProps.onRemove();
                          }
                        }}
                        style={{
                          margin: 0,
                          padding: 5,
                          color: "#888",
                          border: "none",
                          display: "flex",
                          cursor: "pointer",
                          appearance: "none",
                          background: "none",
                          userSelect: "none",
                          position: "relative",
                          transition: "color 0.2s",
                          justifyContent: "center",
                        }}
                      >
                        <svg width="8" viewBox="0 0 22 22" xmlns="http://www.w3.org/2000/svg">
                          <path
                            d="M2.99998 -0.000206962C2.7441 -0.000206962 2.48794 0.0972617 2.29294 0.292762L0.292945 2.29276C-0.0980552 2.68376 -0.0980552 3.31682 0.292945 3.70682L7.58591 10.9998L0.292945 18.2928C-0.0980552 18.6838 -0.0980552 19.3168 0.292945 19.7068L2.29294 21.7068C2.68394 22.0978 3.31701 22.0978 3.70701 21.7068L11 14.4139L18.2929 21.7068C18.6829 22.0978 19.317 22.0978 19.707 21.7068L21.707 19.7068C22.098 19.3158 22.098 18.6828 21.707 18.2928L14.414 10.9998L21.707 3.70682C22.098 3.31682 22.098 2.68276 21.707 2.29276L19.707 0.292762C19.316 -0.0982383 18.6829 -0.0982383 18.2929 0.292762L11 7.58573L3.70701 0.292762C3.51151 0.0972617 3.25585 -0.000206962 2.99998 -0.000206962Z" />
                        </svg>
                      </button>
                    </div>
                  )}
                  {itemProps.clone && itemProps.childCount > 0 && (
                    <div style={{
                      top: -12,
                      right: -12,
                      width: 25,
                      height: 25,
                      fontSize: 14,
                      color: "white",
                      display: "flex",
                      position: "absolute",
                      borderRadius: "100%",
                      alignItems: "center",
                      backgroundColor: "blue",
                      justifyContent: "center",
                    }}>
                      {itemProps.childCount}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    />
  );
};

export const Custom: Story = {
  args: {
    removable: true,
    collapsible: true,
    maxDepth: 2,
    indentationWidth: 25,
  },
  render: (props) => <StoryHookCustom {...props} />,
};

const StoryHookCustomTailwind = (props: SortableTreeProps<unknown>) => {
  const [value, setValue] = useState<TreeItems<Data>>([
    {
      id: "id-1",
      data: { label: "Root Item 1" },
      children: [
        {
          id: "id-2",
          data: { label: "Sub Item 2" },
          children: [
            {
              id: "id-3",
              children: [],
              data: { label: "Sub Item 3" },
            },
          ],
        },
      ],
    },
    {
      id: "id-4",
      children: [],
      data: { label: "Root Item 2" },
    },
    {
      id: "id-5",
      children: [],
      data: { label: "Root Item 3" },
    },
  ]);
  return (
    <SortableTree
      {...props}
      value={value}
      onChange={setValue}
      adjustTranslateY={-20}
      renderItem={(itemProps) => (
        <div ref={itemProps.wrapperRef}>
          <div
            className="z-5 my-2 relative"
            style={{
              paddingLeft: itemProps.depth * (props.indentationWidth ?? 40),
            }}
          >
            <div
              ref={itemProps.containerRef}
              style={itemProps.containerStyle}
              className={itemProps.isDragging ? twMerge(clsx([
                "relative h-[45px] border border-dashed rounded-md bg-gray-800/10",
              ])) : twMerge(clsx([
                "gap-3 p-3 relative rounded-md border border-gray-300 bg-white items-center",
                {
                  "flex": !itemProps.clone,
                  "inline-flex": itemProps.clone,
                },
              ]))}
            >
              {!itemProps.isDragging && (
                <>
                  <div className="flex items-center justify-center">
                    <button
                      {...itemProps.handleProps}
                      className="cursor-grab p-2"
                    >
                      <svg viewBox="0 0 20 20" width="12">
                        <path
                          d="M7 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 2zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 14zm6-8a2 2 0 1 0-.001-4.001A2 2 0 0 0 13 6zm0 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 14z"></path>
                      </svg>
                    </button>
                    {itemProps.isCollapsible && (
                      <button className="cursor-pointer p-1" onClick={itemProps.onCollapse}>
                        <svg width="10" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 70 41" style={{
                          transition: "transform 0.2s",
                          transform: itemProps.node.collapsed ? "rotate(-90deg)" : "rotate(0deg)",
                        }}>
                          <path
                            d="M30.76 39.2402C31.885 40.3638 33.41 40.995 35 40.995C36.59 40.995 38.115 40.3638 39.24 39.2402L68.24 10.2402C69.2998 9.10284 69.8768 7.59846 69.8494 6.04406C69.822 4.48965 69.1923 3.00657 68.093 1.90726C66.9937 0.807959 65.5106 0.178263 63.9562 0.150837C62.4018 0.123411 60.8974 0.700397 59.76 1.76024L35 26.5102L10.24 1.76024C9.10259 0.700397 7.59822 0.123411 6.04381 0.150837C4.4894 0.178263 3.00632 0.807959 1.90702 1.90726C0.807714 3.00657 0.178019 4.48965 0.150593 6.04406C0.123167 7.59846 0.700153 9.10284 1.75999 10.2402L30.76 39.2402Z" />
                        </svg>
                      </button>
                    )}
                  </div>
                  <div className="flex-grow-1">
                    {itemProps.node.data?.label}
                  </div>
                  {itemProps.isRemovable && (
                    <div>
                      <button
                        className="cursor-pointer"
                        onClick={() => {
                          if (confirm("Are you sure you want to remove this item?")) {
                            itemProps.onRemove();
                          }
                        }}
                      >
                        <svg width="8" viewBox="0 0 22 22" xmlns="http://www.w3.org/2000/svg">
                          <path
                            d="M2.99998 -0.000206962C2.7441 -0.000206962 2.48794 0.0972617 2.29294 0.292762L0.292945 2.29276C-0.0980552 2.68376 -0.0980552 3.31682 0.292945 3.70682L7.58591 10.9998L0.292945 18.2928C-0.0980552 18.6838 -0.0980552 19.3168 0.292945 19.7068L2.29294 21.7068C2.68394 22.0978 3.31701 22.0978 3.70701 21.7068L11 14.4139L18.2929 21.7068C18.6829 22.0978 19.317 22.0978 19.707 21.7068L21.707 19.7068C22.098 19.3158 22.098 18.6828 21.707 18.2928L14.414 10.9998L21.707 3.70682C22.098 3.31682 22.098 2.68276 21.707 2.29276L19.707 0.292762C19.316 -0.0982383 18.6829 -0.0982383 18.2929 0.292762L11 7.58573L3.70701 0.292762C3.51151 0.0972617 3.25585 -0.000206962 2.99998 -0.000206962Z" />
                        </svg>
                      </button>
                    </div>
                  )}
                  {itemProps.clone && itemProps.childCount > 0 && (
                    <div
                      className="flex absolute items-center justify-center rounded-full bg-blue-500 top-[-12px] right-[-12px] w-[25px] h-[25px] font-xs text-white"
                    >
                      {itemProps.childCount}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    />
  );
};

export const CustomTailwind: Story = {
  args: {
    removable: true,
    collapsible: true,
    maxDepth: 2,
    indentationWidth: 25,
  },
  render: (props) => <StoryHookCustomTailwind {...props} />,
};

const StoryVirtualization = (props: SortableTreeProps<unknown>) => {
  const [value, setValue] = useState<TreeItems<Data>>(
    Array.from({ length: 200 }, (_, i) => ({
      id: `id-${i + 1}`,
      data: { label: `Item ${i + 1}` },
      children:
        i % 2 === 0
          ? [
            {
              id: `id-${i + 1}-child`,
              data: { label: `Item ${i + 1} Child` },
              children: [],
            },
          ]
          : [],
    })),
  );

  return (
    <SortableTree
      {...props}
      value={value}
      onChange={setValue}
      adjustTranslateY={-20}
      virtual={{
        height: 500,
        itemSize: 64,
      }}
      renderItem={(itemProps) => (
        <div ref={itemProps.wrapperRef}>
          <div
            className="z-5 relative"
            style={{
              paddingLeft: itemProps.depth * (props.indentationWidth ?? 40),
            }}
          >
            <div
              ref={itemProps.containerRef}
              style={itemProps.containerStyle}
              className={itemProps.isDragging ? twMerge(clsx([
                "relative h-[55px] border border-dashed rounded-md bg-gray-800/10",
              ])) : twMerge(clsx([
                "gap-3 px-3 h-[55px] relative rounded-md border border-gray-300 bg-white items-center",
                {
                  "flex": !itemProps.clone,
                  "inline-flex": itemProps.clone,
                },
              ]))}
            >
              {!itemProps.isDragging && (
                <>
                  <div className="flex items-center justify-center">
                    <button
                      {...itemProps.handleProps}
                      className="cursor-grab p-2"
                    >
                      <svg viewBox="0 0 20 20" width="12">
                        <path
                          d="M7 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 2zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 14zm6-8a2 2 0 1 0-.001-4.001A2 2 0 0 0 13 6zm0 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 14z"></path>
                      </svg>
                    </button>
                    {itemProps.isCollapsible && (
                      <button className="cursor-pointer p-1" onClick={itemProps.onCollapse}>
                        <svg width="10" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 70 41" style={{
                          transition: "transform 0.2s",
                          transform: itemProps.node.collapsed ? "rotate(-90deg)" : "rotate(0deg)",
                        }}>
                          <path
                            d="M30.76 39.2402C31.885 40.3638 33.41 40.995 35 40.995C36.59 40.995 38.115 40.3638 39.24 39.2402L68.24 10.2402C69.2998 9.10284 69.8768 7.59846 69.8494 6.04406C69.822 4.48965 69.1923 3.00657 68.093 1.90726C66.9937 0.807959 65.5106 0.178263 63.9562 0.150837C62.4018 0.123411 60.8974 0.700397 59.76 1.76024L35 26.5102L10.24 1.76024C9.10259 0.700397 7.59822 0.123411 6.04381 0.150837C4.4894 0.178263 3.00632 0.807959 1.90702 1.90726C0.807714 3.00657 0.178019 4.48965 0.150593 6.04406C0.123167 7.59846 0.700153 9.10284 1.75999 10.2402L30.76 39.2402Z" />
                        </svg>
                      </button>
                    )}
                  </div>
                  <div className="flex-grow-1">
                    {itemProps.node.data?.label}
                  </div>
                  {itemProps.isRemovable && (
                    <div>
                      <button
                        className="cursor-pointer"
                        onClick={() => {
                          if (confirm("Are you sure you want to remove this item?")) {
                            itemProps.onRemove();
                          }
                        }}
                      >
                        <svg width="8" viewBox="0 0 22 22" xmlns="http://www.w3.org/2000/svg">
                          <path
                            d="M2.99998 -0.000206962C2.7441 -0.000206962 2.48794 0.0972617 2.29294 0.292762L0.292945 2.29276C-0.0980552 2.68376 -0.0980552 3.31682 0.292945 3.70682L7.58591 10.9998L0.292945 18.2928C-0.0980552 18.6838 -0.0980552 19.3168 0.292945 19.7068L2.29294 21.7068C2.68394 22.0978 3.31701 22.0978 3.70701 21.7068L11 14.4139L18.2929 21.7068C18.6829 22.0978 19.317 22.0978 19.707 21.7068L21.707 19.7068C22.098 19.3158 22.098 18.6828 21.707 18.2928L14.414 10.9998L21.707 3.70682C22.098 3.31682 22.098 2.68276 21.707 2.29276L19.707 0.292762C19.316 -0.0982383 18.6829 -0.0982383 18.2929 0.292762L11 7.58573L3.70701 0.292762C3.51151 0.0972617 3.25585 -0.000206962 2.99998 -0.000206962Z" />
                        </svg>
                      </button>
                    </div>
                  )}
                  {itemProps.clone && itemProps.childCount > 0 && (
                    <div
                      className="flex absolute items-center justify-center rounded-full bg-blue-500 top-[-12px] right-[-12px] w-[25px] h-[25px] font-xs text-white"
                    >
                      {itemProps.childCount}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    />
  );
};

export const Virtualization: Story = {
  args: {
    removable: true,
    collapsible: true,
    maxDepth: 2,
    indentationWidth: 25,
  },
  render: (props) => <StoryVirtualization {...props} />,
};
