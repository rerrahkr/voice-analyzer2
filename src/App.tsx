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
    <Stack direction="column" alignItems="stretch" width="1" height="100vh">
      <Stack
        component="header"
        direction="row"
        gap={2}
        alignItems="center"
        justifyContent="left"
      >
        <AudioLoadComponent />
        <Divider orientation="vertical" />
        <TransportController
          audioContextCurrentTimeGetter={getAudioContextCurrentTime}
        />
        <TransportMeter playingPositionGetter={getPlayingPosition} />
        <Divider orientation="vertical" />
        <ViewsController />
      </Stack>
      <WaveView playingPositionGetter={getPlayingPosition} />
    </Stack>
  );
}

export default App;
