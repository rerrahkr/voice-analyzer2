import type { ScrollableCanvasElement } from "@/components/ScrollableCanvas";
import {
  useAudio,
  useEnableViewFollowPlayback,
  useSetViewScrollLeft,
  useTransportStateState,
  useViewScrollLeft,
  useViewShouldFollowPlayback,
} from "@/hooks";
import { clearCanvasContext, getCanvasContext2D } from "@/utils/canvas";
import { useCallback, useEffect, useRef, useState } from "react";
import type { PitchViewProps } from "./components/PitchView";
import {
  canvasXToTime,
  drawGrid,
  drawPlaybackPositionLayer,
  drawWave,
  isTimeWithinCanvasBounds,
  timeToCanvasX,
} from "./draw";

const LAYER_INDEX = {
  GRID: 0,
  PLAYBACK: 1,
  WAVE: 2,
} as const;

export function useHandlePitchView({
  playingPositionGetter: getPlayingPosition,
  playingPositionSetter: setPlayingPosition,
}: PitchViewProps) {
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
        // Draw all layers in scroll event.
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
    if (transportState === "playing") {
      animate();
    }

    return () => {
      if (requestIdRef.current) {
        cancelAnimationFrame(requestIdRef.current);
        requestIdRef.current = undefined;
      }
    };
  }, [transportState, animate]);

  // Go to head of audio when stopping.
  useEffect(() => {
    if (transportState === "stopping") {
      if (shouldFollowPlayback) {
        canvasRef.current?.scroller?.scrollTo({
          left: 0,
          behavior: "instant",
        });
      }
    }
  }, [transportState, shouldFollowPlayback]);

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
      const maxCanvasWidth = timeToCanvasX(audio.length / audio.sampleRate);
      const scrollableStyleWidth =
        (maxCanvasWidth * canvasStyleWidth) / canvasWidth;
      setScrollableCanvasStyleWidth(`${scrollableStyleWidth}px`);
    } else {
      setScrollableCanvasStyleWidth("100%");
    }
  }, [audio]);

  // Jump playback position.
  const enableFollowPlayback = useEnableViewFollowPlayback();
  const handlePointerDown = useCallback(
    (ev: React.PointerEvent<HTMLDivElement>) => {
      // Turn off following playback when playing audio.
      if (transportState === "playing") {
        enableFollowPlayback(false);
      }

      if (ev.target !== ev.currentTarget) {
        // Jump playback position in pointing content down in scroll area.
        // ev.target is content of scrollable area.
        const gridLayer = canvasRef.current?.layers[LAYER_INDEX.GRID];
        if (!gridLayer) {
          return;
        }

        const canvasWidth = gridLayer.width;
        const canvasStyleWidth = gridLayer.getBoundingClientRect().width;

        const canvasStyleX = ev.nativeEvent.offsetX;
        const canvasX = (canvasStyleX * canvasWidth) / canvasStyleWidth;
        setPlayingPosition(canvasXToTime(canvasX));
      }
    },
    [transportState, enableFollowPlayback, setPlayingPosition]
  );

  // Turn off following playback when executing scroll while playing audio.
  const handleWheel = useCallback(() => {
    if (transportState === "playing") {
      enableFollowPlayback(false);
    }
  }, [transportState, enableFollowPlayback]);

  // Scroll handler.
  const setScrollLeft = useSetViewScrollLeft();
  const handleScroll = useCallback(() => {
    if (canvasRef.current?.scroller) {
      setScrollLeft(canvasRef.current.scroller.scrollLeft);
    }

    drawAllLayers();
  }, [drawAllLayers, setScrollLeft]);

  // Restore and save horizontal scroll offset to synchronize it in other views.
  const viewScrollLeft = useViewScrollLeft();
  // biome-ignore lint/correctness/useExhaustiveDependencies: Invoke this in mounting/unmounting.
  useEffect(() => {
    canvasRef.current?.scroller?.scrollTo({
      left: viewScrollLeft,
      behavior: "instant",
    });
  }, [canvasRef.current]);

  return {
    canvasRef,
    scrollableCanvasStyleWidth,
    handleResize: drawAllLayers,
    handleScroll,
    handlePointerDown,
    handleWheel,
  };
}
