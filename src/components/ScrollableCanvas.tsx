import { type SerializedStyles, css } from "@emotion/react";
import type React from "react";
import { forwardRef, useImperativeHandle, useRef } from "react";
import { AutoResizedCanvas } from "./AutoResizedCanvas";

//----- Types.
type ScrollableCanvasProps = Partial<{
  staticCss: SerializedStyles | undefined;
  style: React.CSSProperties | undefined;
  displayScrollbar: boolean | undefined;
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

//----- Styles.
const expandedSizeCss = css`
  width: 100%;
  height: 100%;
`;

const zeroPositionCss = css`
  position: absolute;
  top: 0;
  left: 0;
`;

function scrollbarCss(shouldDisplay: boolean | undefined): SerializedStyles {
  return css`
    overflow: scroll;

    @supports not selector(::-webkit-scrollbar) {
      scrollbarWidth: ${shouldDisplay ? "auto" : "none"};
    }

    @supports selector(::-webkit-scrollbar) {
      ::-webkit-scrollbar {
        display: ${shouldDisplay ? undefined : "none"};
      }
    }
  `;
}

const componentCss = {
  container: css`
    position: relative;
  `,

  canvasWrapper: css`
    ${expandedSizeCss}
  `, // Also uses overflow css

  canvas: css`
    ${expandedSizeCss}
  `,

  scroller: css`
    ${zeroPositionCss}
    ${expandedSizeCss}
  `, // Also uses overflow css.

  scrollerContent: `
    ${zeroPositionCss}
  `,
};

//----- Component.
export const ScrollableCanvas = forwardRef<
  ScrollableCanvasElement,
  ScrollableCanvasProps
>((props, ref) => {
  const {
    displayScrollbar,
    scrollableCanvasStyleWidth,
    scrollableCanvasStyleHeight,
    onScroll,
    onResize,
    staticCss: containerCustomCss,
    style: containerCustomStyle,
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

  return (
    <div
      css={[containerCustomCss, componentCss.container]}
      style={containerCustomStyle}
    >
      <div css={[componentCss.canvasWrapper, scrollbarCss(displayScrollbar)]}>
        <AutoResizedCanvas
          ref={canvasRef}
          onResize={onResize}
          staticCss={componentCss.canvas}
        />
      </div>
      <div
        onScroll={onScroll}
        css={[componentCss.scroller, scrollbarCss(displayScrollbar)]}
        ref={scrollerRef}
      >
        <div
          css={componentCss.scrollerContent}
          style={{
            width: scrollableCanvasStyleWidth,
            height: scrollableCanvasStyleHeight,
          }}
        />
      </div>
    </div>
  );
});
