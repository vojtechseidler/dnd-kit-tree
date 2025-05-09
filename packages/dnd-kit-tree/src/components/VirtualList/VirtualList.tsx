/* Forked from react-tiny-virtual-list */
import * as React from "react";
import SizeAndPositionManager, { ItemSize } from "./SizeAndPositionManager";
import {
  sizeProp,
  ALIGNMENT,
  DIRECTION,
  marginProp,
  scrollProp,
  positionProp,
  oppositeMarginProp,
  SCROLL_CHANGE_REASON,
} from "./constants";

type ScrollProp = "scrollTop" | "scrollLeft";

export type ItemPosition = "absolute" | "sticky";

export interface ItemStyle {
  position: ItemPosition;
  top?: number;
  left: number;
  width: string | number;
  height?: number;
  marginTop?: number;
  marginLeft?: number;
  marginRight?: number;
  marginBottom?: number;
  zIndex?: number;
}

interface StyleCache {
  [id: number]: ItemStyle;
}

export interface ItemInfo {
  index: number;
  style: ItemStyle;
}

export interface RenderedRows {
  startIndex: number;
  stopIndex: number;
}

export interface Props {
  className?: string;
  estimatedItemSize?: number;
  height: number | string;
  itemCount: number;
  itemSize: ItemSize;
  overscanCount?: number;
  scrollOffset?: number;
  scrollToIndex?: number;
  scrollToAlignment?: ALIGNMENT;
  scrollDirection?: DIRECTION;
  stickyIndices?: number[];
  style?: React.CSSProperties;
  width?: number | string;

  onItemsRendered?({ startIndex, stopIndex }: RenderedRows): void;

  onScroll?(offset: number, event: UIEvent): void;

  renderItem(itemInfo: ItemInfo): React.ReactNode;
}

export interface State {
  offset: number;
  scrollChangeReason: SCROLL_CHANGE_REASON;
}

const STYLE_WRAPPER: React.CSSProperties = {
  overflow: "auto",
  willChange: "transform",
  WebkitOverflowScrolling: "touch",
};

const STYLE_INNER: React.CSSProperties = {
  position: "relative",
  width: "100%",
  minHeight: "100%",
};

const STYLE_ITEM: {
  position: ItemStyle["position"];
  top: ItemStyle["top"];
  left: ItemStyle["left"];
  width: ItemStyle["width"];
} = {
  position: "absolute" as ItemPosition,
  top: 0,
  left: 0,
  width: "100%",
};

const STYLE_STICKY_ITEM = {
  ...STYLE_ITEM,
  position: "sticky" as ItemPosition,
};

export default class VirtualList extends React.PureComponent<Props, State> {
  static defaultProps = {
    overscanCount: 3,
    scrollDirection: DIRECTION.VERTICAL,
    width: "100%",
  };

  itemSizeGetter = (itemSize: Props["itemSize"]) => {
    return (index: number) => this.getSize(index, itemSize);
  };

  sizeAndPositionManager = new SizeAndPositionManager({
    itemCount: this.props.itemCount,
    itemSizeGetter: this.itemSizeGetter(this.props.itemSize),
    estimatedItemSize: this.getEstimatedItemSize(),
  });

  readonly state: State = {
    offset:
      this.props.scrollOffset ||
      (this.props.scrollToIndex != null && this.getOffsetForIndex(this.props.scrollToIndex)) ||
      0,
    scrollChangeReason: SCROLL_CHANGE_REASON.REQUESTED,
  };

  private rootNode: HTMLElement | undefined;

  private styleCache: StyleCache = {};

  componentDidMount() {
    const { scrollOffset, scrollToIndex } = this.props;
    this.rootNode?.addEventListener("scroll", this.handleScroll, {
      passive: true,
    });

    if (scrollOffset != null) {
      this.scrollTo(scrollOffset);
    } else if (scrollToIndex != null) {
      this.scrollTo(this.getOffsetForIndex(scrollToIndex));
    }
  }

  componentWillReceiveProps(nextProps: Props) {
    const {
      estimatedItemSize,
      itemCount,
      itemSize,
      scrollOffset,
      scrollToAlignment,
      scrollToIndex,
    } = this.props;
    const scrollPropsHaveChanged =
      nextProps.scrollToIndex !== scrollToIndex ||
      nextProps.scrollToAlignment !== scrollToAlignment;
    const itemPropsHaveChanged =
      nextProps.itemCount !== itemCount ||
      nextProps.itemSize !== itemSize ||
      nextProps.estimatedItemSize !== estimatedItemSize;

    if (nextProps.itemSize !== itemSize) {
      this.sizeAndPositionManager.updateConfig({
        itemSizeGetter: this.itemSizeGetter(nextProps.itemSize),
      });
    }

    if (nextProps.itemCount !== itemCount || nextProps.estimatedItemSize !== estimatedItemSize) {
      this.sizeAndPositionManager.updateConfig({
        itemCount: nextProps.itemCount,
        estimatedItemSize: this.getEstimatedItemSize(nextProps),
      });
    }

    if (itemPropsHaveChanged) {
      this.recomputeSizes();
    }

    if (nextProps.scrollOffset !== scrollOffset) {
      this.setState({
        offset: nextProps.scrollOffset || 0,
        scrollChangeReason: SCROLL_CHANGE_REASON.REQUESTED,
      });
    } else if (
      typeof nextProps.scrollToIndex === "number" &&
      (scrollPropsHaveChanged || itemPropsHaveChanged)
    ) {
      this.setState({
        offset: this.getOffsetForIndex(
          nextProps.scrollToIndex,
          nextProps.scrollToAlignment,
          nextProps.itemCount
        ),
        scrollChangeReason: SCROLL_CHANGE_REASON.REQUESTED,
      });
    }
  }

  componentDidUpdate(_: Props, prevState: State) {
    const { offset, scrollChangeReason } = this.state;

    if (prevState.offset !== offset && scrollChangeReason === SCROLL_CHANGE_REASON.REQUESTED) {
      this.scrollTo(offset);
    }
  }

  scrollTo(value: number) {
    const { scrollDirection = DIRECTION.VERTICAL } = this.props;

    if (this.rootNode) {
      (this.rootNode as Record<ScrollProp, number>)[scrollProp[scrollDirection] as ScrollProp] =
        value;
    }
  }

  getOffsetForIndex(
    index: number,
    scrollToAlignment = this.props.scrollToAlignment,
    itemCount: number = this.props.itemCount
  ): number {
    const { scrollDirection = DIRECTION.VERTICAL } = this.props;

    if (index < 0 || index >= itemCount) {
      index = 0;
    }

    return this.sizeAndPositionManager.getUpdatedOffsetForIndex({
      targetIndex: index,
      align: scrollToAlignment,
      currentOffset: (this.state && this.state.offset) || 0,
      containerSize: this.props[sizeProp[scrollDirection] as keyof Props] as number,
    });
  }

  recomputeSizes(startIndex = 0) {
    this.styleCache = {};
    this.sizeAndPositionManager.resetItem(startIndex);
  }

  render() {
    const {
      estimatedItemSize,
      height,
      overscanCount = 3,
      renderItem,
      itemCount,
      itemSize,
      onItemsRendered,
      onScroll,
      scrollDirection = DIRECTION.VERTICAL,
      scrollOffset,
      scrollToIndex,
      scrollToAlignment,
      stickyIndices,
      style,
      width,
      ...props
    } = this.props;
    const { offset } = this.state;
    const { start, stop } = this.sizeAndPositionManager.getVisibleRange({
      offset,
      overscanCount,
      containerSize: (this.props[sizeProp[scrollDirection] as keyof Props] as number) || 0,
    });
    const items: React.ReactNode[] = [];
    const wrapperStyle = { ...STYLE_WRAPPER, ...style, height, width };
    const innerStyle = {
      ...STYLE_INNER,
      [sizeProp[scrollDirection]]: this.sizeAndPositionManager.getTotalSize(),
    };

    if (stickyIndices != null && stickyIndices.length !== 0) {
      stickyIndices.forEach((index: number) =>
        items.push(
          renderItem({
            index,
            style: this.getStyle(index, true),
          })
        )
      );

      if (scrollDirection === DIRECTION.HORIZONTAL) {
        innerStyle.display = "flex";
      }
    }

    if (typeof start !== "undefined" && typeof stop !== "undefined") {
      for (let index = start; index <= stop; index++) {
        if (stickyIndices != null && stickyIndices.includes(index)) {
          continue;
        }

        items.push(
          renderItem({
            index,
            style: this.getStyle(index, false),
          })
        );
      }

      if (typeof onItemsRendered === "function") {
        onItemsRendered({
          startIndex: start,
          stopIndex: stop,
        });
      }
    }

    return (
      <div ref={this.getRef} {...props} style={wrapperStyle}>
        <div style={innerStyle}>{items}</div>
      </div>
    );
  }

  private getRef = (node: HTMLDivElement): void => {
    this.rootNode = node;
  };

  private handleScroll: EventListener = (e: Event) => {
    const event = e as UIEvent;
    const { onScroll } = this.props;
    const offset = this.getNodeOffset();

    if (offset < 0 || this.state.offset === offset || event.target !== this.rootNode) {
      return;
    }

    this.setState({
      offset,
      scrollChangeReason: SCROLL_CHANGE_REASON.OBSERVED,
    });

    if (typeof onScroll === "function") {
      onScroll(offset, event);
    }
  };

  private getNodeOffset() {
    const { scrollDirection = DIRECTION.VERTICAL } = this.props;
    return (this.rootNode as Record<ScrollProp, number>)[scrollProp[scrollDirection] as ScrollProp];
  }

  private getEstimatedItemSize(props = this.props) {
    return props.estimatedItemSize || (typeof props.itemSize === "number" && props.itemSize) || 50;
  }

  private getSize(index: number, itemSize: number | number[] | ((i: number) => number)) {
    if (typeof itemSize === "function") {
      return itemSize(index);
    }

    return Array.isArray(itemSize) ? itemSize[index] : itemSize;
  }

  private getStyle(index: number, sticky: boolean) {
    const style = this.styleCache[index];

    if (style) {
      return style;
    }

    const { scrollDirection = DIRECTION.VERTICAL } = this.props;
    const { size, offset } = this.sizeAndPositionManager.getSizeAndPositionForIndex(index);

    return (this.styleCache[index] = sticky
      ? {
          ...STYLE_STICKY_ITEM,
          [sizeProp[scrollDirection]]: size,
          [marginProp[scrollDirection]]: offset,
          [oppositeMarginProp[scrollDirection]]: -(offset + size),
          zIndex: 1,
        }
      : {
          ...STYLE_ITEM,
          [sizeProp[scrollDirection]]: size,
          [positionProp[scrollDirection]]: offset,
        });
  }
}
