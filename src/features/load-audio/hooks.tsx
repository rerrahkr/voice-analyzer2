import { useSetAudio, useStopAudio } from "@/hooks";
import type React from "react";
import { useCallback, useState } from "react";
import { makeAudioBufferMono } from "./utils/dsp";
import { readFileAsArray } from "./utils/file-read";

export function useLoadAudio() {
  const [fileName, setFileName] = useState<string>("");
  const setAudio = useSetAudio();
  const stopAudio = useStopAudio();

  const handleFileChange = useCallback(
    async (ev: React.ChangeEvent<HTMLInputElement>) => {
      stopAudio();

      const file = ev.target?.files?.item(0);
      if (!file) {
        return;
      }

      try {
        const buffer = await readFileAsArray(file);
        console.log(buffer);

        const audioContext = new AudioContext();
        const originalAudioBuffer = await audioContext.decodeAudioData(buffer);
        const audioBuffer = await makeAudioBufferMono(originalAudioBuffer);

        setAudio(audioBuffer);
        console.log(audioBuffer);

        setFileName(file.name);
      } catch (e) {
        console.log("[Error] Could not load file!");

        if (e instanceof Error) {
          console.log(`${e.name}\n${e.message}`);
        }

        ev.target.value = "";
        setFileName("");
      }
    },
    [stopAudio, setAudio]
  );

  return {
    fileName,
    handleFileChange,
  };
}
