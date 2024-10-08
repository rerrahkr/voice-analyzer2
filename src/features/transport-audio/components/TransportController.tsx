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
import Tooltip from "@mui/material/Tooltip";
import React from "react";
import { useCallback } from "react";

export const TransportController = React.memo(() => {
  const { current: transportState } = useTransportStateState();
  const play = usePlayAudio();
  const pause = usePauseAudio();
  const stop = useStopAudio();
  const audio = useAudio();

  const handlePlayPauseButtonClick = useCallback(() => {
    if (transportState === "playing") {
      pause();
    } else {
      play();
    }
  }, [transportState, play, pause]);

  const disabled = audio === undefined;
  const shouldDisplayPause = transportState === "playing";

  return (
    <ButtonGroup>
      <Tooltip title={shouldDisplayPause ? "Pause" : "Play"}>
        <span>
          <IconButton
            onClick={handlePlayPauseButtonClick}
            aria-label="playOrPause"
            disabled={disabled}
          >
            {shouldDisplayPause ? <PauseIcon /> : <PlayArrowIcon />}
          </IconButton>
        </span>
      </Tooltip>
      <Tooltip title="Stop">
        <span>
          <IconButton onClick={stop} aria-label="stop" disabled={disabled}>
            <StopIcon />
          </IconButton>
        </span>
      </Tooltip>
    </ButtonGroup>
  );
});
