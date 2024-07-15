import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type React from "react";
import { useLoadAudio } from "../hooks";
import { FileInputButton } from "./FileInputButton";

export function AudioLoadComponent(): React.JSX.Element {
  const { fileName, handleFileChange } = useLoadAudio();

  return (
    <Stack direction="row" gap={1} alignItems="center" justifyContent="center">
      <FileInputButton
        id="fileInput"
        variant="contained"
        accept=".wav"
        forceChange
        onChange={handleFileChange}
      >
        Open
      </FileInputButton>
      <Typography
        component="label"
        htmlFor="fileInput"
        overflow="hidden"
        whiteSpace="nowrap"
        textOverflow="ellipsis"
        sx={{
          width: 100,
        }}
      >
        {fileName || "---"}
      </Typography>
    </Stack>
  );
}
