import {
  ScrollableCanvas,
  type ScrollableCanvasElement,
} from "@/components/ScrollableCanvas";
import { useAudio, useTransportStateState } from "@/hooks";
import React from "react";
import { useCallback, useEffect, useRef, useState } from "react";

const WIDTH_PIXEL_RATE = 1000;
const MAX_HEIGHT_PIXEL = 400;

function drawPlaybackPositionLayer(
  canvas: HTMLCanvasElement,
  scrollOffset: number,
  transportTime: number
) {
  const context = canvas.getContext("2d");
  if (!context) {
    return;
  }

  // Clear canvas.
  context.clearRect(0, 0, canvas.width, canvas.height);

  // Draw transport line.
  const resolutionStyleRate =
    canvas.width / canvas.getBoundingClientRect().width;
  const multiplier = resolutionStyleRate / WIDTH_PIXEL_RATE;
  const timeLeft = scrollOffset * multiplier;
  const timeRight = (scrollOffset + canvas.width) * multiplier;

  if (timeLeft <= transportTime && transportTime <= timeRight) {
    context.strokeStyle = "black";

    context.beginPath();
    const x = (transportTime - timeLeft) * WIDTH_PIXEL_RATE;
    context.moveTo(x, 0);
    context.lineTo(x, canvas.height);
    context.stroke();
  }
}

function drawWaveLayer(
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

type WaveViewProps = {
  playingPositionGetter: () => number;
};

export const WaveView = React.memo(
  ({ playingPositionGetter: getPlayingPosition }: WaveViewProps) => {
    const canvasRef = useRef<ScrollableCanvasElement>(null);

    const audio = useAudio();

    const [scrollableCanvasStyleWidth, setScrollableCanvasStyleWidth] =
      useState<string>("100%");

    const drawAllLayers = useCallback(() => {
      const { layers, scroller } = canvasRef.current || {};
      if (layers && scroller) {
        drawPlaybackPositionLayer(
          layers[0],
          scroller.scrollLeft,
          getPlayingPosition()
        );

        drawWaveLayer(layers[1], audio, scroller.scrollLeft);
      }
    }, [audio, getPlayingPosition]);

    const drawPositionLayer = useCallback(() => {
      const { layers, scroller } = canvasRef.current || {};
      if (layers && scroller) {
        drawPlaybackPositionLayer(
          layers[0],
          scroller.scrollLeft,
          getPlayingPosition()
        );
      }
    }, [getPlayingPosition]);

    useEffect(() => {
      drawAllLayers();
    }, [drawAllLayers]);

    const requestIdRef = useRef<number>();

    const { current: transportState } = useTransportStateState();

    const animate = useCallback(() => {
      requestIdRef.current = requestAnimationFrame(animate);
      drawPositionLayer();
    }, [drawPositionLayer]);

    useEffect(() => {
      if (transportState === "playing") {
        // Start animation.
        animate();
      } else {
        if (requestIdRef.current) {
          // Stop animation.
          cancelAnimationFrame(requestIdRef.current);
          requestIdRef.current = undefined;
        } else {
          drawPositionLayer();
        }
      }

      return () => {
        if (requestIdRef.current) {
          cancelAnimationFrame(requestIdRef.current);
          requestIdRef.current = undefined;
        }
      };
    }, [transportState, animate, drawPositionLayer]);

    useEffect(() => {
      // Resize view width.
      const { layers, scroller } = canvasRef.current || {};
      if (!layers || !scroller) {
        return;
      }

      const canvasWidth = layers[0].width;
      const canvasStyleWidth = layers[0].getBoundingClientRect().width;

      if (audio) {
        const maxCanvasWidth =
          (WIDTH_PIXEL_RATE * audio.length) / audio.sampleRate;
        const scrollableWidth =
          (maxCanvasWidth * canvasStyleWidth) / canvasWidth;
        setScrollableCanvasStyleWidth(`${scrollableWidth}px`);
      } else {
        setScrollableCanvasStyleWidth("100%");
      }

      scroller.scrollLeft = 0;
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
        layers={2}
        onResize={drawAllLayers}
        onScroll={drawAllLayers}
      />
    );
  }
);
