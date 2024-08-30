import {
  useToggleViewFollowPlayback,
  useViewShouldFollowPlayback,
} from "@/hooks";
import KeyboardTabIcon from "@mui/icons-material/KeyboardTab";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import React from "react";

const BUTTON_NAMES = {
  followPlayback: "follow",
} as const;

export const ViewsController = React.memo((): React.JSX.Element => {
  const toggleFollowPlayback = useToggleViewFollowPlayback();
  const shouldFollowPlayback = useViewShouldFollowPlayback();
  return (
    <ToggleButtonGroup
      value={[shouldFollowPlayback ? BUTTON_NAMES.followPlayback : undefined]}
      onChange={() => {
        toggleFollowPlayback();
      }}
    >
      <ToggleButton
        value={BUTTON_NAMES.followPlayback}
        aria-label="toggleFollowPlayback"
      >
        <KeyboardTabIcon />
      </ToggleButton>
    </ToggleButtonGroup>
  );
});
