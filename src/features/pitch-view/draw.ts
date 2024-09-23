import { blue, grey } from "@mui/material/colors";

const WIDTH_PIXEL_RATE = 1000;

/**
 * Convert second to x-position on canvas.
 * @param time Second.
 * @returns X position.
 */
export function timeToCanvasX(time: number): number {
  return time * WIDTH_PIXEL_RATE;
}

/**
 * Convert x-position in canvas to second.
 * @param x X position.
 * @returns Second.
 */
export function canvasXToTime(x: number): number {
  return x / WIDTH_PIXEL_RATE;
}

/**
 * Validate position of time is within canvas bounds.
 * @param time Seconds.
 * @param scrollOffset Style-based x offset of canvas.
 * @param styleWidth Style-base canvas width.
 * @param canvasWidth Resolution-based canvas width.
 * @returns true when given time is displayed in canvas.
 */
export function isTimeWithinCanvasBounds(
  time: number,
  scrollOffset: number,
  styleWidth: number,
  canvasWidth: number
): boolean {
  const transportStyleX = (timeToCanvasX(time) * styleWidth) / canvasWidth;
  const transportViewportStyleX = transportStyleX - scrollOffset;
  return 0 <= transportViewportStyleX && transportViewportStyleX <= styleWidth;
}

/**
 * @param context
 * @param scrollOffset
 * @param transportTime
 * @returns true when position line is drawn in canvas.
 */
export function drawPlaybackPositionLayer(
  context: CanvasRenderingContext2D,
  scrollOffset: number,
  transportTime: number
) {
  const { width, height } = context.canvas;
  const styleWidth = context.canvas.getBoundingClientRect().width;
  const canvasOffset = (scrollOffset * width) / styleWidth;
  const canvasTime = timeToCanvasX(transportTime);
  const x = canvasTime - canvasOffset;

  context.strokeStyle = grey[900];

  context.beginPath();
  context.moveTo(x, 0);
  context.lineTo(x, height);
  context.stroke();
}

export function drawGrid(
  context: CanvasRenderingContext2D,
  scrollOffset: number
) {
  const { width, height } = context.canvas;

  // Draw time lines.
  const styleWidth = context.canvas.getBoundingClientRect().width;
  const canvasLeft = (scrollOffset * width) / styleWidth;
  const timeLeft = canvasXToTime(canvasLeft);

  const canvasRight = ((scrollOffset + styleWidth) * width) / styleWidth;
  const timeRight = canvasXToTime(canvasRight);

  context.textBaseline = "top";
  context.font = `1em ${getComputedStyle(context.canvas).fontFamily}`;
  context.fillStyle = grey[600];

  const GRID_TIME = 0.1;
  for (
    let count = Math.ceil(timeLeft / GRID_TIME), time = count * GRID_TIME;
    time <= timeRight;
    time = ++count * GRID_TIME
  ) {
    if (count % 10 === 0) {
      context.strokeStyle = grey[400];
    } else if (count % 5 === 0) {
      context.strokeStyle = grey[300];
    } else {
      context.strokeStyle = grey[200];
    }

    const x = Math.round((time - timeLeft) * WIDTH_PIXEL_RATE);
    context.fillText(time.toFixed(3), x + 6, 12);

    context.beginPath();
    context.moveTo(x, 0);
    context.lineTo(x, height);
    context.stroke();
  }

  // Draw zero-line.
  const centerY = height / 2;

  context.strokeStyle = grey[400];
  context.lineWidth = 1;

  context.beginPath();
  context.moveTo(0, centerY);
  context.lineTo(width, centerY);
  context.stroke();
}

export function drawWave(
  context: CanvasRenderingContext2D,
  audio: AudioBuffer,
  scrollOffset: number
) {
  const samples = audio.getChannelData(0);

  const { width, height } = context.canvas;
  const centerY = height / 2;
  const MAX_HEIGHT_PIXEL = 1000;
  const maxDrawableHeight = Math.min(height, MAX_HEIGHT_PIXEL);
  const styleWidth = context.canvas.getBoundingClientRect().width;

  context.strokeStyle = blue[500];

  context.beginPath();

  if (WIDTH_PIXEL_RATE < audio.sampleRate) {
    // Selection drawing.
    const xOffset = Math.round((scrollOffset * width) / styleWidth);
    context.moveTo(
      0,
      centerY -
        maxDrawableHeight *
          samples[Math.round(audio.sampleRate * canvasXToTime(xOffset))]
    );

    for (let x = 0; x < width; x++) {
      context.lineTo(
        x,
        centerY -
          maxDrawableHeight *
            samples[Math.round(audio.sampleRate * canvasXToTime(xOffset + x))]
      );
    }
  } else {
    // Draw all samples.
    const canvasOffset = (scrollOffset * width) / styleWidth;
    const firstDrawableIndex = (() => {
      const timeOffset = canvasXToTime(canvasOffset);
      return Math.floor(timeOffset * audio.sampleRate);
    })();
    const lastDrawableIndex = (() => {
      const canvasRight = ((scrollOffset + styleWidth) * width) / styleWidth;
      const timeRight = canvasXToTime(canvasRight);
      return Math.min(
        Math.ceil(timeRight * audio.sampleRate),
        audio.length - 1
      );
    })();

    context.moveTo(
      timeToCanvasX(firstDrawableIndex / audio.sampleRate),
      centerY - maxDrawableHeight * samples[firstDrawableIndex]
    );

    for (let i = firstDrawableIndex; i <= lastDrawableIndex; i++) {
      context.lineTo(
        timeToCanvasX(i / audio.sampleRate),
        centerY - maxDrawableHeight * samples[i]
      );
    }
  }

  context.stroke();
}
