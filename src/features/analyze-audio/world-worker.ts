import createWorldModule from "@lib/worldts/WorldJS";

import type { F0Info } from "@/types";
import type { AudioSamples } from "./types";

const FRAME_PERIOD_MSEC = 5;

createWorldModule().then((module) => {
  async function handleMessage({ data }: MessageEvent<AudioSamples>) {
    const result = module.WorldJS.Harvest(
      new Float64Array(data.samples),
      data.sampleRate,
      FRAME_PERIOD_MSEC
    );
    postMessage({
      time: result.time_axis,
      f0: result.f0,
    } satisfies F0Info);
  }

  addEventListener("message", handleMessage);
});
