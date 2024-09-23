import createWorldModule from "@lib/worldts/WorldJS";

import type { PitchInfo } from "@/types";
import type { AudioSamples } from "./types";

const FRAME_PERIOD_MSEC = 5;

createWorldModule().then((module) => {
  async function handleMessage({ data }: MessageEvent<AudioSamples>) {
    const result = module.WorldJS.Harvest(
      new Float64Array(data.samples),
      data.sampleRate,
      FRAME_PERIOD_MSEC
    );

    const cent = module.WorldJS.F0ToCent(result.f0);

    postMessage({
      time: result.time_axis,
      data: cent,
    } satisfies PitchInfo);
  }

  addEventListener("message", handleMessage);
});
