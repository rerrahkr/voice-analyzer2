import type React from "react";
import { useCallback, useState } from "react";
import { readFileAsArray } from "./utils/file-read";
import { decodeWav } from "./utils/wav";

export function useLoadAudio() {
  const [fileName, setFileName] = useState<string>("");

  const handleFileChange = useCallback(
    async (ev: React.ChangeEvent<HTMLInputElement>) => {
      const file = ev.target?.files?.item(0);
      if (!file) {
        return;
      }

      try {
        const buffer = await readFileAsArray(file);
        console.log(buffer);

        const audioData = await decodeWav(buffer);
        console.log(audioData);

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
    []
  );

  return {
    fileName,
    handleFileChange,
  };
}
