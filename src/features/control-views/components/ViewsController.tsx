import {
  useEnableViewFollowPlayback,
  useViewShouldFollowPlayback,
} from "@/hooks";
import KeyboardTabIcon from "@mui/icons-material/KeyboardTab";
import { Tooltip } from "@mui/material";
import ButtonGroup from "@mui/material/ButtonGroup";
import ToggleButton from "@mui/material/ToggleButton";
import React from "react";

export const ViewsController = React.memo((): React.JSX.Element => {
  const enableFollowPlayback = useEnableViewFollowPlayback();
  const shouldFollowPlayback = useViewShouldFollowPlayback();

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
    </ButtonGroup>
  );
});
