import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";

type AutoResizedCanvasProps = {
  /**
   * CSS style for container element.
   */
  style?: React.CSSProperties | undefined;

  /**
   * Event handler called when the canvas is resized.
   * @param canvas Canvas element.
   */
  onResize?: ((canvas: HTMLCanvasElement) => void) | undefined;
};

/**
 * Canvas component whose size is streched to its parent rectangle.
 */
export const AutoResizedCanvas = forwardRef<
  HTMLCanvasElement,
  AutoResizedCanvasProps
>((props, ref) => {
  const { onResize, style: containerStyle } = props;

  const canvasRef = useRef<HTMLCanvasElement>(null);
  useImperativeHandle<HTMLCanvasElement | null, HTMLCanvasElement | null>(
    ref,
    () => canvasRef.current,
    []
  );

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    const observer = new ResizeObserver((entries) => {
      const canvas = canvasRef.current;
      const entry = entries[0];
      if (!entry || !canvas) {
        return;
      }

      const directionIsHorizontal =
        getComputedStyle(canvas).writingMode.startsWith("horizontal");

      {
        const size = entry.devicePixelContentBoxSize[0];
        canvas.height = directionIsHorizontal
          ? size.blockSize
          : size.inlineSize;
        canvas.width = directionIsHorizontal ? size.inlineSize : size.blockSize;
      }

      {
        const size = entry.contentBoxSize[0];
        canvas.style.height = `${directionIsHorizontal ? size.blockSize : size.inlineSize}px`;
        canvas.style.width = `${directionIsHorizontal ? size.inlineSize : size.blockSize}px`;
      }

      if (onResize) {
        onResize(canvas);
      }
    });
    observer.observe(container, { box: "device-pixel-content-box" });

    return () => {
      return observer.disconnect();
    };
  }, [onResize]);

  return (
    <div ref={containerRef} style={containerStyle}>
      <canvas
        ref={canvasRef}
        style={{
          display: "block",
        }}
      >
        Canvas is not supported in this browser.
      </canvas>
    </div>
  );
});
