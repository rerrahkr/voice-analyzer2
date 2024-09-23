import {
  useEnableViewFollowPlayback,
  usePitchViewIsVisible,
  useSetPitchViewVisibility,
  useViewShouldFollowPlayback,
} from "@/hooks";
import KeyboardTabIcon from "@mui/icons-material/KeyboardTab";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import { Tooltip } from "@mui/material";
import ButtonGroup from "@mui/material/ButtonGroup";
import ToggleButton from "@mui/material/ToggleButton";
import React from "react";
import { useHidePitchView } from "../hooks";

export const ViewsController = React.memo((): React.JSX.Element => {
  const { canTogglePitchViewVisibility } = useHidePitchView();

  const enableFollowPlayback = useEnableViewFollowPlayback();
  const shouldFollowPlayback = useViewShouldFollowPlayback();
  const pitchViewIsVisible = usePitchViewIsVisible();
  const setPitchViewVisibility = useSetPitchViewVisibility();

  return (
    <ButtonGroup>
      <Tooltip title="Follow Playback">
        <ToggleButton
          value="followPlayback"
          aria-label="followPlayback"
          selected={shouldFollowPlayback}
          size="small"
          onClick={() => {
            enableFollowPlayback(!shouldFollowPlayback);
          }}
        >
          <KeyboardTabIcon />
        </ToggleButton>
      </Tooltip>
      <Tooltip title="Show Pitch View">
        <span>
          <ToggleButton
            value="showPitchView"
            aria-label="showPitchView"
            selected={pitchViewIsVisible}
            disabled={!canTogglePitchViewVisibility}
            size="small"
            onClick={() => {
              setPitchViewVisibility(!pitchViewIsVisible);
            }}
          >
            <ShowChartIcon />
          </ToggleButton>
        </span>
      </Tooltip>
    </ButtonGroup>
  );
});
