import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";

type AutoResizedCanvasProps = {
  /**
   * Event handler called when the canvas is resized.
   * @param canvas Canvas element.
   */
  onResize?: (canvas: HTMLCanvasElement) => void;
};

/**
 * Canvas component whose size is streched to its parent rectangle.
 */
export const AutoResizedCanvas = forwardRef<
  HTMLCanvasElement,
  AutoResizedCanvasProps
>((props, ref) => {
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

      if (props.onResize) {
        props.onResize(canvas);
      }
    });
    observer.observe(container, { box: "device-pixel-content-box" });

    return () => {
      return observer.disconnect();
    };
  }, [props.onResize]);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: "100%",
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          display: "block",
        }}
      />
    </div>
  );
});
