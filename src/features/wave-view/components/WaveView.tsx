import {
  ScrollableCanvas,
  type ScrollableCanvasElement,
} from "@/components/ScrollableCanvas";
import { useAudio } from "@/hooks";
import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";

const WIDTH_PIXEL_RATE = 1000;
const MAX_HEIGHT_PIXEL = 400;

function draw(
  canvas: HTMLCanvasElement,
  audio: AudioBuffer | undefined,
  scrollOffset: number
) {
  const context = canvas.getContext("2d");
  if (!context) {
    return;
  }

  // Clear canvas.
  context.clearRect(0, 0, canvas.width, canvas.height);

  const centerY = canvas.height / 2;

  // Draw zero-line.
  context.strokeStyle = "lightgrey";

  context.beginPath();
  context.moveTo(0, centerY);
  context.lineTo(canvas.width, centerY);
  context.stroke();

  // Draw samples.
  if (!audio) {
    return;
  }

  const samples = audio.getChannelData(0);

  const maxDrawableHeight = Math.min(canvas.height, MAX_HEIGHT_PIXEL);

  context.strokeStyle = "red";

  context.beginPath();

  if (WIDTH_PIXEL_RATE < audio.sampleRate) {
    // Selection drawing.
    const xOffset = Math.round(
      (scrollOffset * canvas.width) / canvas.getBoundingClientRect().width
    );
    context.moveTo(
      0,
      centerY -
        maxDrawableHeight *
          samples[Math.round((audio.sampleRate * xOffset) / WIDTH_PIXEL_RATE)]
    );

    for (let x = 0; x < canvas.width; x++) {
      context.lineTo(
        x,
        centerY -
          maxDrawableHeight *
            samples[
              Math.round((audio.sampleRate * (xOffset + x)) / WIDTH_PIXEL_RATE)
            ]
      );
    }
  } else {
    // Draw all samples.
    const canvasOffset =
      (scrollOffset * canvas.width) / canvas.getBoundingClientRect().width;
    const firstDrawableIndex = (() => {
      const timeOffset = canvasOffset / WIDTH_PIXEL_RATE;
      return Math.floor(timeOffset * audio.sampleRate);
    })();
    const lastDrawableIndex = (() => {
      const canvasRight =
        ((scrollOffset + canvas.getBoundingClientRect().width) * canvas.width) /
        canvas.getBoundingClientRect().width;
      const timeRight = canvasRight / WIDTH_PIXEL_RATE;
      return Math.min(
        Math.ceil(timeRight * audio.sampleRate),
        audio.length - 1
      );
    })();

    context.moveTo(
      (WIDTH_PIXEL_RATE * firstDrawableIndex) / audio.sampleRate,
      centerY - maxDrawableHeight * samples[firstDrawableIndex]
    );

    for (let i = firstDrawableIndex; i <= lastDrawableIndex; i++) {
      context.lineTo(
        (WIDTH_PIXEL_RATE * i) / audio.sampleRate,
        centerY - maxDrawableHeight * samples[i]
      );
    }
  }

  context.stroke();
}

export function WaveView(): React.JSX.Element {
  const canvasRef = useRef<ScrollableCanvasElement>(null);

  const audio = useAudio();

  const [scrollableCanvasStyleWidth, setScrillableCanvasStyleWidth] =
    useState<string>("100%");

  const handleCanvasResize = useCallback(
    (canvas: HTMLCanvasElement) => {
      if (canvasRef.current?.scroller) {
        draw(canvas, audio, canvasRef.current.scroller.scrollLeft);
      }
    },
    [audio]
  );

  const handleScroll = useCallback(
    (ev: React.UIEvent<HTMLDivElement>) => {
      if (canvasRef.current?.canvas) {
        draw(canvasRef.current.canvas, audio, ev.currentTarget.scrollLeft);
      }
    },
    [audio]
  );

  useEffect(() => {
    // Resize view width.
    const canvas = canvasRef.current?.canvas;
    const scroller = canvasRef.current?.scroller;
    if (!canvas || !scroller) {
      return;
    }

    const canvasWidth = canvas.width;
    const canvasStyleWidth = canvas.getBoundingClientRect().width;

    if (audio) {
      const maxCanvasWidth =
        (WIDTH_PIXEL_RATE * audio.length) / audio.sampleRate;
      const scrollableWidth = (maxCanvasWidth * canvasStyleWidth) / canvasWidth;
      setScrillableCanvasStyleWidth(`${scrollableWidth}px`);
    } else {
      setScrillableCanvasStyleWidth("100%");
    }

    scroller.scrollLeft = 0;
  }, [audio]);

  useEffect(() => {
    // Draw canvas when audio is loaded.
    const canvas = canvasRef.current?.canvas;
    const scroller = canvasRef.current?.scroller;
    if (canvas && scroller) {
      draw(canvas, audio, scroller.scrollLeft);
    }
  }, [audio]);

  return (
    <ScrollableCanvas
      style={{
        width: "100%",
        height: "100%",
      }}
      ref={canvasRef}
      displayScrollbar
      scrollableCanvasStyleWidth={scrollableCanvasStyleWidth}
      scrollableCanvasStyleHeight="100%"
      onResize={handleCanvasResize}
      onScroll={handleScroll}
    />
  );
}
