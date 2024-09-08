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

        const audioContext = new AudioContext();
        const originalAudioBuffer = await audioContext.decodeAudioData(buffer);
        const audioBuffer = await makeAudioBufferMono(originalAudioBuffer);

        setAudio(audioBuffer);
        setFileName(file.name);
      } catch (e) {
        window.alert("Failed to load file...");
        console.error("[Error in Loading Audio]", e);

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
