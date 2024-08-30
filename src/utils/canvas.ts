/**
 * Get 2D context from given canvas.
 * @param canvasOrNone Canvas element. This allow that element is null or undefined.
 * @returns 2D context or null.
 */
export function getCanvasContext2D(
  canvasOrNone: HTMLCanvasElement | null | undefined
): CanvasRenderingContext2D | null {
  return canvasOrNone?.getContext("2d") ?? null;
}

/**
 * Clear all contents in given context.
 * @param context Context object.
 */
export function clearCanvasContext(context: CanvasRenderingContext2D) {
  context.clearRect(0, 0, context.canvas.width, context.canvas.height);
}
