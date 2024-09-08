import { useAudio, useSetF0Info } from "@/hooks";
import type { F0Info } from "@/types";
import { useEffect, useRef } from "react";
import type { AudioSamples } from "./types";
import WorldWorker from "./world-worker?worker";

export function useAnalyzeAudio() {
  const workerRef = useRef<Worker>();

  const audio = useAudio();
  const setF0Info = useSetF0Info();

  // Initialize audio analyzing worker.
  useEffect(() => {
    if (workerRef.current) {
      return;
    }

    const worker = new WorldWorker();

    worker.onmessage = ({ data }: MessageEvent<F0Info>) => {
      setF0Info(data);
    };

    worker.onerror = (ev) => {
      window.alert("Failed to analyze audio...");
      console.error("[Error in Audio Analyzing]", ev);

      setF0Info(undefined);
    };

    workerRef.current = worker;

    return () => {
      workerRef.current?.terminate();
      workerRef.current = undefined;
    };
  }, [setF0Info]);

  // Request audio analysis to worker when audio state has been changed.
  useEffect(() => {
    if (!audio) {
      setF0Info(undefined);
      return;
    }

    workerRef.current?.postMessage({
      samples: audio.getChannelData(0),
      sampleRate: audio.sampleRate,
    } satisfies AudioSamples);
  }, [audio, setF0Info]);
}
