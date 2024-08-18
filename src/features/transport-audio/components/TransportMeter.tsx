import { useElapsedTime, useTransportStateState } from "@/hooks";
import Box, { type BoxProps } from "@mui/material/Box";
import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";

type TransportMeterProps = BoxProps & {
  audioContextRef: React.MutableRefObject<AudioContext | undefined>;
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

export function TransportMeter(props: TransportMeterProps): React.JSX.Element {
  const { audioContextRef, ...boxProps } = props;

  const elapsed = useElapsedTime();
  const { current: transportState } = useTransportStateState();

  const requestIdRef = useRef<number>();
  const [msec, setTime] = useState<number>(0);

  const setMsecTime = useCallback(() => {
    const timeDiff = audioContextRef.current
      ? audioContextRef.current.currentTime - elapsed.lastStamp
      : 0;
    const time = elapsed.time + timeDiff;
    setTime(Math.round(time * 1000));
  }, [audioContextRef.current, elapsed]);

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
        if (transportState === "stopping") {
          // Force reset here not leave old position,
          // because transport state is changed before audio context is killed.
          setTime(0);
        } else {
          setMsecTime();
        }
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
}
