import { ScrollableCanvas } from "@/components/ScrollableCanvas";
import React from "react";
import { useHandleWaveView } from "../hooks";

export type WaveViewProps = {
  playingPositionGetter: () => number;
  playingPositionSetter: (time: number) => void;
};

export const WaveView = React.memo((props: WaveViewProps) => {
  const {
    canvasRef,
    scrollableCanvasStyleWidth,
    handleResize,
    handleScroll,
    handlePointerDown,
    handleWheel,
  } = useHandleWaveView(props);

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
      onResize={handleResize}
      onScroll={handleScroll}
      onPointerDown={handlePointerDown}
      onWheel={handleWheel}
    />
  );
});
