import Stack from "@mui/material/Stack";
import type React from "react";
import { useAnalyzeAudio } from "./features/analyze-audio";
import { AudioLoadComponent } from "./features/load-audio";
import {
  TransportController,
  useTransportAudio,
} from "./features/transport-audio";
import { WaveView } from "./features/wave-view";

function App(): React.JSX.Element {
  const { audioContextRef } = useTransportAudio();
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
        <TransportController audioContextRef={audioContextRef} />
      </Stack>
      <WaveView audioContextRef={audioContextRef} />
    </Stack>
  );
}

export default App;
