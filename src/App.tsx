import { Box } from "@mui/material";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import { yellow } from "@mui/material/colors";
import type React from "react";
import { useAnalyzeAudio } from "./features/analyze-audio";
import { ViewsController } from "./features/control-views";
import { AudioLoadComponent, AudioLoadingSpinner } from "./features/load-audio";
import {
  TransportController,
  TransportMeter,
  useTransportAudio,
} from "./features/transport-audio";
import { WaveView } from "./features/wave-view";
import { useAudioIsLoading } from "./hooks";

function App(): React.JSX.Element {
  const { getPlayingPosition, setPlayingPosition } = useTransportAudio();
  useAnalyzeAudio();
  const audioIsLoading = useAudioIsLoading();

  return (
    <Box
      sx={{
        position: "relative",
        width: 1,
        height: "100vh",
      }}
    >
      <Stack
        direction="column"
        sx={{
          width: 1,
          height: 1,
          alignItems: "stretch",
        }}
      >
        <Stack
          component="header"
          direction="row"
          sx={{
            p: 1,
            gap: 1,
            alignItems: "center",
            justifyContent: "left",
            flexWrap: "wrap",
            backgroundColor: yellow[50],
            boxShadow: 2,
            zIndex: 100,
          }}
        >
          <AudioLoadComponent />
          <Divider orientation="vertical" flexItem />
          <TransportController />
          <TransportMeter
            playingPositionGetter={getPlayingPosition}
            sx={{
              width: "5rem",
            }}
          />
          <Divider orientation="vertical" flexItem />
          <ViewsController />
        </Stack>

        <WaveView
          playingPositionGetter={getPlayingPosition}
          playingPositionSetter={setPlayingPosition}
        />
      </Stack>

      {audioIsLoading && (
        <AudioLoadingSpinner
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 1,
            height: 1,
            zIndex: 500,
          }}
        />
      )}
    </Box>
  );
}

export default App;
