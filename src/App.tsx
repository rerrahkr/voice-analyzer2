import Stack from "@mui/material/Stack";
import type React from "react";
import { AudioLoadComponent } from "./features/load-audio";
import { TransportController } from "./features/transport-audio";

function App(): React.JSX.Element {
  return (
    <Stack direction="row" gap={2} alignItems="center" justifyContent="left">
      <AudioLoadComponent />
      <TransportController />
    </Stack>
  );
}

export default App;
