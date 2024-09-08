import { useTransportStateState } from "@/hooks";
import Box, { type BoxProps } from "@mui/material/Box";
import React from "react";
import { useCallback, useEffect, useRef, useState } from "react";

type TransportMeterProps = BoxProps & {
  playingPositionGetter: () => number;
};

function formatTime(msecTime: number): string {
  const msec = (msecTime % 1000).toString().padStart(3, "0");
  const secTime = Math.floor(msecTime / 1000);
  const sec = (secTime % 60).toString().padStart(2, "0");
  const min = Math.floor(secTime / 60)
    .toString()
    .padStart(2, "0");
  return `${min}:${sec}.${msec}`;
}

export const TransportMeter = React.memo((props: TransportMeterProps) => {
  const { playingPositionGetter: getPlayingPosition, ...boxProps } = props;

  const { current: transportState } = useTransportStateState();

  const requestIdRef = useRef<number>();
  const [msec, setTime] = useState<number>(0);

  const setMsecTime = useCallback(() => {
    setTime(Math.round(getPlayingPosition() * 1000));
  }, [getPlayingPosition]);

  const animate = useCallback(() => {
    requestIdRef.current = requestAnimationFrame(animate);
    setMsecTime();
  }, [setMsecTime]);

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
        // Only update text.
        setMsecTime();
      }
    }

    return () => {
      if (requestIdRef.current) {
        cancelAnimationFrame(requestIdRef.current);
        requestIdRef.current = undefined;
      }
    };
  }, [transportState, animate, setMsecTime]);

  return <Box {...boxProps}>{formatTime(msec)}</Box>;
});
