import type { CustomComponentStyleProps } from "@/types";
import { range } from "@/utils/range";
import { css } from "@emotion/react";
import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";

export type AutoResizedCanvasBaseProps = {
  /**
   * Number of
   */
  layers?: number | undefined;

  /**
   * Event handler called when the canvas is resized.
   * @param canvas Canvas element.
   */
  onResize?: (() => void) | undefined;
};

type AutoResizedCanvasProps = AutoResizedCanvasBaseProps &
  CustomComponentStyleProps;

const componentCss = {
  container: css`
    position: relative;
  `,

  canvas: css`
    display: block;
    position: absolute;
    top: 0;
    left: 0;
  `,
};

/**
 * Canvas component whose size is stretched to its parent rectangle.
 */
export const AutoResizedCanvas = forwardRef<
  HTMLCanvasElement[],
  AutoResizedCanvasProps
>((props, ref) => {
  const {
    layers = 1,
    staticCss: containerCustomCss,
    style: containerCustomStyle,
    onResize,
  } = props;

  const canvasMapRef = useRef(new Map<number, HTMLCanvasElement>());
  useImperativeHandle(ref, () => [...canvasMapRef.current.values()], []);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    const observer = new ResizeObserver(([entry]) => {
      for (const [, canvas] of canvasMapRef.current) {
        const directionIsHorizontal =
          getComputedStyle(canvas).writingMode.startsWith("horizontal");

        {
          const size = entry.devicePixelContentBoxSize[0];
          canvas.height = directionIsHorizontal
            ? size.blockSize
            : size.inlineSize;
          canvas.width = directionIsHorizontal
            ? size.inlineSize
            : size.blockSize;
        }

        {
          const size = entry.contentBoxSize[0];
          canvas.style.height = `${directionIsHorizontal ? size.blockSize : size.inlineSize}px`;
          canvas.style.width = `${directionIsHorizontal ? size.inlineSize : size.blockSize}px`;
        }
      }

      onResize?.();
    });
    observer.observe(container, { box: "device-pixel-content-box" });

    return () => {
      return observer.disconnect();
    };
  }, [onResize]);

  return (
    <div
      ref={containerRef}
      css={[componentCss.container, containerCustomCss]}
      style={containerCustomStyle}
    >
      {[...range(0, Math.max(layers, 1))].map((i) => (
        <canvas
          key={i}
          ref={(node) => {
            if (node) {
              canvasMapRef.current.set(i, node);
            } else {
              canvasMapRef.current.delete(i);
            }
          }}
          css={componentCss.canvas}
        >
          Canvas is not supported in this browser.
        </canvas>
      ))}
    </div>
  );
});
