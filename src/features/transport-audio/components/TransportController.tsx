import {
  useAudio,
  usePauseAudio,
  usePlayAudio,
  useStopAudio,
  useTransportStateState,
} from "@/hooks";
import PauseIcon from "@mui/icons-material/Pause";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import StopIcon from "@mui/icons-material/Stop";
import ButtonGroup from "@mui/material/ButtonGroup";
import IconButton from "@mui/material/IconButton";
import type React from "react";
import { useCallback } from "react";
import { TransportMeter } from "./TransportMeter";

type TransportControllerProps = {
  audioContextRef: React.MutableRefObject<AudioContext | undefined>;
};

export function TransportController({
  audioContextRef,
}: TransportControllerProps): React.JSX.Element {
  const { current: transportState } = useTransportStateState();
  const play = usePlayAudio();
  const pause = usePauseAudio();
  const stop = useStopAudio();
  const audio = useAudio();

  const handlePlayPauseButtonClick = useCallback(() => {
    if (transportState === "playing") {
      pause(audioContextRef.current?.currentTime);
    } else {
      play(audioContextRef.current?.currentTime);
    }
  }, [transportState, play, pause, audioContextRef]);

  const disabled = audio === undefined;

  return (
    <>
      <ButtonGroup>
        <IconButton
          onClick={handlePlayPauseButtonClick}
          aria-label="playOrPause"
          disabled={disabled}
        >
          {transportState === "playing" ? <PauseIcon /> : <PlayArrowIcon />}
        </IconButton>
        <IconButton onClick={stop} aria-label="stop" disabled={disabled}>
          <StopIcon />
        </IconButton>
      </ButtonGroup>
      <TransportMeter audioContextRef={audioContextRef} />
    </>
  );
}
