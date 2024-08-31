import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import type React from "react";
import { useAnalyzeAudio } from "./features/analyze-audio";
import { ViewsController } from "./features/control-views";
import { AudioLoadComponent } from "./features/load-audio";
import {
  TransportController,
  TransportMeter,
  useTransportAudio,
} from "./features/transport-audio";
import { WaveView } from "./features/wave-view";

function App(): React.JSX.Element {
  const { getPlayingPosition, getAudioContextCurrentTime } =
    useTransportAudio();
  useAnalyzeAudio();

  return (
    <Stack
      direction="column"
      sx={{
        width: 1,
        height: "100vh",
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
          backgroundColor: "#ffffea",
          boxShadow: 2,
          zIndex: 100,
        }}
      >
        <AudioLoadComponent />
        <Divider orientation="vertical" flexItem />
        <TransportController
          audioContextCurrentTimeGetter={getAudioContextCurrentTime}
        />
        <TransportMeter playingPositionGetter={getPlayingPosition} />
        <Divider orientation="vertical" flexItem />
        <ViewsController />
      </Stack>

      <WaveView playingPositionGetter={getPlayingPosition} />
    </Stack>
  );
}

export default App;
