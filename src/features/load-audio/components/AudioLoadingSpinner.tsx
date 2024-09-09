import { type SxProps, alpha } from "@mui/material";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import { grey } from "@mui/material/colors";
import type React from "react";

type AudioLoadingSpinnerProps = {
  sx?: SxProps | undefined;
};

export function AudioLoadingSpinner({
  sx,
}: AudioLoadingSpinnerProps): React.JSX.Element {
  return (
    <Box
      sx={{
        ...sx,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: alpha(grey[500], 0.4),
      }}
    >
      <CircularProgress size="6rem" />
    </Box>
  );
}
