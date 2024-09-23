import { useAudio, useSetPitchInfo } from "@/hooks";
import type { PitchInfo } from "@/types";
import { useEffect, useRef } from "react";
import type { AudioSamples } from "./types";
import WorldWorker from "./world-worker?worker";

export function useAnalyzeAudio() {
  const workerRef = useRef<Worker>();

  const audio = useAudio();
  const setPitchInfo = useSetPitchInfo();

  // Initialize audio analyzing worker.
  useEffect(() => {
    const worker = new WorldWorker();

    worker.onmessage = ({ data }: MessageEvent<PitchInfo>) => {
      setPitchInfo(data);
    };

    worker.onerror = (ev) => {
      window.alert("Failed to analyze audio...");
      console.error("[Error in Audio Analyzing]", ev);

      setPitchInfo(undefined);
    };

    workerRef.current = worker;

    return () => {
      workerRef.current?.terminate();
      workerRef.current = undefined;
    };
  }, [setPitchInfo]);

  // Request audio analysis to worker when audio state has been changed.
  useEffect(() => {
    setPitchInfo(undefined);

    if (!audio) {
      return;
    }

    workerRef.current?.postMessage({
      samples: audio.getChannelData(0),
      sampleRate: audio.sampleRate,
    } satisfies AudioSamples);
  }, [audio, setPitchInfo]);
}
