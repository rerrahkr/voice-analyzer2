import type React from "react";
import { forwardRef, useImperativeHandle, useRef } from "react";
import { AutoResizedCanvas } from "./AutoResizedCanvas";

type ScrollableCanvasProps = Partial<{
  style: React.CSSProperties | undefined;
  displayVericalBar: boolean | undefined;
  displayHorizontalBar: boolean | undefined;
  scrollableCanvasStyleWidth: React.CSSProperties["width"] | undefined;
  scrollableCanvasStyleHeight: React.CSSProperties["height"] | undefined;
  onScroll: React.UIEventHandler<HTMLDivElement> | undefined;
  onHorizontalBarChange: ((offset: number) => void) | undefined;
  onResize: ((canvas: HTMLCanvasElement) => void) | undefined;
}>;

export type ScrollableCanvasElement = {
  readonly canvas: HTMLCanvasElement | null;
  readonly scroller: HTMLDivElement | null;
};

export const ScrollableCanvas = forwardRef<
  ScrollableCanvasElement,
  ScrollableCanvasProps
>((props, ref) => {
  const {
    displayVericalBar,
    displayHorizontalBar,
    scrollableCanvasStyleWidth,
    scrollableCanvasStyleHeight,
    onScroll,
    onResize,
    style,
  } = props;

  // Modify external refs.
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(
    ref,
    () =>
      ({
        get canvas() {
          return canvasRef.current;
        },
        get scroller() {
          return scrollerRef.current;
        },
      }) satisfies ScrollableCanvasElement
  );

  const overflowStyle = {
    overflowX: displayHorizontalBar ? "scroll" : "hidden",
    overflowY: displayVericalBar ? "scroll" : "hidden",
  } satisfies React.CSSProperties;

  return (
    <div
      style={{
        ...style,
        position: "relative",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          ...overflowStyle,
        }}
      >
        <AutoResizedCanvas
          ref={canvasRef}
          onResize={onResize}
          style={{
            width: "100%",
            height: "100%",
          }}
        />
      </div>
      <div
        onScroll={onScroll}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          ...overflowStyle,
        }}
        ref={scrollerRef}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: scrollableCanvasStyleWidth,
            height: scrollableCanvasStyleHeight,
          }}
        />
      </div>
    </div>
  );
});
