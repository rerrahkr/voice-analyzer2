import { ScrollableCanvas } from "@/components/ScrollableCanvas";
import React from "react";
import { useHandlePitchView } from "../hooks";

export type PitchViewProps = {
  playingPositionGetter: () => number;
  playingPositionSetter: (time: number) => void;
};

export const PitchView = React.memo(
  (props: PitchViewProps): React.JSX.Element => {
    const {
      canvasRef,
      scrollableCanvasStyleWidth,
      handleResize,
      handleScroll,
      handlePointerDown,
      handleWheel,
    } = useHandlePitchView(props);

    return (
      <ScrollableCanvas
        style={{
          width: "100%",
          height: "100%",
        }}
        ref={canvasRef}
        displayScrollbar
        scrollableCanvasStyleWidth={scrollableCanvasStyleWidth}
        scrollableCanvasStyleHeight="100%" // TODO: Set height
        layers={3}
        onResize={handleResize}
        onScroll={handleScroll}
        onPointerDown={handlePointerDown}
        onWheel={handleWheel}
      />
    );
  }
);
