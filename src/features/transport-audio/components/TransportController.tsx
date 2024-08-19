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
import React from "react";
import { useCallback } from "react";

type TransportControllerProps = {
  audioContextCurrentTimeGetter: () => number | undefined;
};

export const TransportController = React.memo(
  ({
    audioContextCurrentTimeGetter: getCurrentTime,
  }: TransportControllerProps) => {
    const { current: transportState } = useTransportStateState();
    const play = usePlayAudio();
    const pause = usePauseAudio();
    const stop = useStopAudio();
    const audio = useAudio();

    const handlePlayPauseButtonClick = useCallback(() => {
      if (transportState === "playing") {
        pause(getCurrentTime());
      } else {
        play(getCurrentTime());
      }
    }, [transportState, play, pause, getCurrentTime]);

    const disabled = audio === undefined;

    return (
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
    );
  }
);
