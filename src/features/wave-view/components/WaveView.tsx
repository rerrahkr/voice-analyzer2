import {
  ScrollableCanvas,
  type ScrollableCanvasElement,
} from "@/components/ScrollableCanvas";
import {
  useAudio,
  useEnableViewFollowPlayback,
  useTransportStateState,
  useViewShouldFollowPlayback,
} from "@/hooks";
import { clearCanvasContext, getCanvasContext2D } from "@/utils/canvas";
import React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  WIDTH_PIXEL_RATE,
  drawGrid,
  drawPlaybackPositionLayer,
  drawWave,
  isTimeWithinCanvasBounds,
  timeToCanvasX,
} from "../draw";

const LAYER_INDEX = {
  GRID: 0,
  PLAYBACK: 1,
  WAVE: 2,
} as const;

type WaveViewProps = {
  playingPositionGetter: () => number;
};

export const WaveView = React.memo(
  ({ playingPositionGetter: getPlayingPosition }: WaveViewProps) => {
    const canvasRef = useRef<ScrollableCanvasElement>(null);
    const audio = useAudio();

    const drawAllLayers = useCallback(() => {
      const { layers, scroller } = canvasRef.current || {};
      if (!layers || !scroller) {
        return;
      }

      const gridContext = getCanvasContext2D(layers[LAYER_INDEX.GRID]);
      if (gridContext) {
        clearCanvasContext(gridContext);
        drawGrid(gridContext, scroller.scrollLeft);
      }

      const playbackContext = getCanvasContext2D(layers[LAYER_INDEX.PLAYBACK]);
      if (playbackContext) {
        clearCanvasContext(playbackContext);

        const currentTime = getPlayingPosition();
        if (
          isTimeWithinCanvasBounds(
            currentTime,
            scroller.scrollLeft,
            playbackContext.canvas.getBoundingClientRect().width,
            playbackContext.canvas.width
          )
        ) {
          drawPlaybackPositionLayer(
            playbackContext,
            scroller.scrollLeft,
            currentTime
          );
        }
      }

      const waveContext = getCanvasContext2D(layers[LAYER_INDEX.WAVE]);
      if (waveContext) {
        clearCanvasContext(waveContext);
        if (audio) {
          drawWave(waveContext, audio, scroller.scrollLeft);
        }
      }
    }, [audio, getPlayingPosition]);

    // Draw all layers after loading audio.
    useEffect(() => {
      drawAllLayers();
    }, [drawAllLayers]);

    // Control playback animation.
    const { current: transportState } = useTransportStateState();
    const shouldFollowPlayback = useViewShouldFollowPlayback();
    const drawPositionLayer = useCallback(() => {
      const { layers, scroller } = canvasRef.current || {};
      const context = getCanvasContext2D(layers?.[LAYER_INDEX.PLAYBACK]);
      if (!context || !scroller) {
        return;
      }

      clearCanvasContext(context);

      const currentTime = getPlayingPosition();
      const styleWidth = context.canvas.getBoundingClientRect().width;
      if (
        !isTimeWithinCanvasBounds(
          currentTime,
          scroller.scrollLeft,
          styleWidth,
          context.canvas.width
        )
      ) {
        if (shouldFollowPlayback) {
          const left =
            (timeToCanvasX(currentTime) * styleWidth) / context.canvas.width;
          scroller.scrollTo({ left, behavior: "instant" });
        }
        return;
      }

      drawPlaybackPositionLayer(context, scroller.scrollLeft, currentTime);
    }, [getPlayingPosition, shouldFollowPlayback]);

    const requestIdRef = useRef<number>();

    const animate = useCallback(() => {
      requestIdRef.current = requestAnimationFrame(animate);
      drawPositionLayer();
    }, [drawPositionLayer]);

    useEffect(() => {
      switch (transportState) {
        case "playing":
          animate(); // Start animation.
          break;

        case "stopping":
          if (shouldFollowPlayback) {
            canvasRef.current?.scroller?.scrollTo({
              left: 0,
              behavior: "instant",
            });
          }
          break;

        default:
          break;
      }

      return () => {
        if (requestIdRef.current) {
          cancelAnimationFrame(requestIdRef.current);
          requestIdRef.current = undefined;
        }
      };
    }, [transportState, animate, shouldFollowPlayback]);

    // Resize view width after loading audio.
    const [scrollableCanvasStyleWidth, setScrollableCanvasStyleWidth] =
      useState<string>("100%");

    useEffect(() => {
      const { layers, scroller } = canvasRef.current || {};
      if (!layers || !scroller) {
        return;
      }

      const canvasWidth = layers[LAYER_INDEX.GRID].width;
      const canvasStyleWidth =
        layers[LAYER_INDEX.GRID].getBoundingClientRect().width;

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

    // Turn off following playback.
    const enableFollowPlayback = useEnableViewFollowPlayback();
    const turnOffFollowingPlayback = useCallback(() => {
      enableFollowPlayback(false);
    }, [enableFollowPlayback]);

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
        layers={3}
        onResize={drawAllLayers}
        onScroll={drawAllLayers}
        onPointerDown={turnOffFollowingPlayback}
      />
    );
  }
);
