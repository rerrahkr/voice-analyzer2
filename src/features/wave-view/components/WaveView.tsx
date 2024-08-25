import {
  ScrollableCanvas,
  type ScrollableCanvasElement,
} from "@/components/ScrollableCanvas";
import { useAudio, useTransportStateState } from "@/hooks";
import React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  WIDTH_PIXEL_RATE,
  drawGrid,
  drawPlaybackPositionLayer,
  drawWaveLayer,
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
      if (layers && scroller) {
        drawGrid(layers[LAYER_INDEX.GRID], scroller.scrollLeft);

        drawPlaybackPositionLayer(
          layers[LAYER_INDEX.PLAYBACK],
          scroller.scrollLeft,
          getPlayingPosition()
        );

        drawWaveLayer(layers[LAYER_INDEX.WAVE], audio, scroller.scrollLeft);
      }
    }, [audio, getPlayingPosition]);

    // Draw all layers after loading audio.
    useEffect(() => {
      drawAllLayers();
    }, [drawAllLayers]);

    // Control playback animation.
    const { current: transportState } = useTransportStateState();
    const drawPositionLayer = useCallback(() => {
      const { layers, scroller } = canvasRef.current || {};
      if (layers && scroller) {
        drawPlaybackPositionLayer(
          layers[LAYER_INDEX.PLAYBACK],
          scroller.scrollLeft,
          getPlayingPosition()
        );
      }
    }, [getPlayingPosition]);

    const requestIdRef = useRef<number>();

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
      />
    );
  }
);
