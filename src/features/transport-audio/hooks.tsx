import { useAudio, useStopAudio, useTransportStateState } from "@/hooks";
import { useEffect, useRef } from "react";

export function useTransportAudio() {
  const audio = useAudio();

  const audioContextRef = useRef<AudioContext | null>(null);
  const transportState = useTransportStateState();
  const stopAudio = useStopAudio();

  useEffect(() => {
    async function controlTransport() {
      switch (transportState.current) {
        case "playing":
          if (transportState.previous === "stopping" && audio) {
            const audioContext = new AudioContext();
            audioContextRef.current = audioContext;

            const sourceNode = new AudioBufferSourceNode(audioContext, {
              buffer: audio,
            });
            sourceNode.onended = () => {
              stopAudio();
            };
            sourceNode.connect(audioContext.destination);
            sourceNode.start();
          } else {
            await audioContextRef.current?.resume();
          }
          break;

        case "pausing":
          await audioContextRef.current?.suspend();
          break;

        case "stopping":
          await audioContextRef.current?.close();
          audioContextRef.current = null;
          break;
      }
    }

    controlTransport().catch((err) => {
      console.log(err);
    });
  }, [transportState, audio, stopAudio]);
}
