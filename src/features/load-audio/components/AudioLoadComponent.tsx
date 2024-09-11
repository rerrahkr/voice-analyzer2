import { Tooltip } from "@mui/material";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import React from "react";
import { useLoadAudio } from "../hooks";
import { FileInputButton } from "./FileInputButton";

export const AudioLoadComponent = React.memo((): React.JSX.Element => {
  const { fileName, handleFileChange } = useLoadAudio();

  return (
    <Stack direction="row" gap={1} alignItems="center" justifyContent="center">
      <Tooltip title="Open">
        <span>
          <FileInputButton
            id="fileInput"
            variant="contained"
            accept="audio/*"
            forceChange
            onChange={handleFileChange}
          />
        </span>
      </Tooltip>
      <Typography
        component="label"
        htmlFor="fileInput"
        sx={{
          width: "10rem",
          overflow: "hidden",
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
        }}
      >
        {fileName || "---"}
      </Typography>
    </Stack>
  );
});
