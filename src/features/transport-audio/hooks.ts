import { useAudio, useStopAudio, useTransportStateState } from "@/hooks";
import { useCallback, useEffect, useRef } from "react";
import { useImmer } from "use-immer";

type TimeLog = {
  logged: number; // Logged time.
  offset: number; // Time offset.
};

export function useTransportAudio() {
  const audio = useAudio();

  const audioContextRef = useRef<AudioContext>();
  const sourceNodeRef = useRef<AudioBufferSourceNode>();
  const transportState = useTransportStateState();
  const stopAudio = useStopAudio();
  const nextStartTimeRef = useRef<number>();

  const [timeLog, setTimeLog] = useImmer<TimeLog>({
    logged: 0,
    offset: 0,
  } satisfies TimeLog);

  // Control playback.
  useEffect(() => {
    async function controlTransport() {
      switch (transportState.current) {
        case "playing": {
          if (!audio) {
            break;
          }

          switch (transportState.previous) {
            case "stopping": {
              const context = new AudioContext();
              audioContextRef.current = context;

              const newNode = new AudioBufferSourceNode(context, {
                buffer: audio,
              });
              newNode.onended = stopAudio;
              newNode.connect(context.destination);
              newNode.start(0, nextStartTimeRef.current);
              sourceNodeRef.current = newNode;

              nextStartTimeRef.current = undefined;

              break;
            }

            case "pausing": {
              if (nextStartTimeRef.current === undefined) {
                // Restart context from current position.
                await audioContextRef.current?.resume();
                break;
              }

              // Recreate context before jumping position to avoid playing rest samples.
              if (sourceNodeRef.current) {
                sourceNodeRef.current.onended = null;
                sourceNodeRef.current.stop();
              }

              audioContextRef.current?.close();
              const context = new AudioContext();
              audioContextRef.current = context;

              const newNode = new AudioBufferSourceNode(context, {
                buffer: audio,
              });
              newNode.onended = stopAudio;
              newNode.connect(context.destination);
              newNode.start(0, nextStartTimeRef.current);

              sourceNodeRef.current = newNode;

              nextStartTimeRef.current = undefined;

              break;
            }

            default:
              break;
          }

          const context = audioContextRef.current;
          if (context) {
            setTimeLog((draft) => {
              draft.logged = context.currentTime;
            });
          }

          break;
        }

        case "pausing": {
          const context = audioContextRef.current;
          if (!context) {
            break;
          }

          await context.suspend();

          setTimeLog((draft) => {
            draft.offset += context.currentTime - draft.logged;
            draft.logged = context.currentTime;
          });

          break;
        }

        case "stopping": {
          const context = audioContextRef.current;
          if (!context) {
            break;
          }

          await context.close();

          setTimeLog({
            logged: context.currentTime,
            offset: 0,
          } satisfies TimeLog);

          audioContextRef.current = undefined;

          break;
        }
      }
    }

    controlTransport().catch((err) => {
      console.error("[Error in Audio Transport]", err);
    });
  }, [transportState, audio, stopAudio, setTimeLog]);

  // Get current playing position.
  const getPlayingPosition = useCallback(() => {
    const timeDiff = audioContextRef.current
      ? audioContextRef.current.currentTime - timeLog.logged
      : 0;
    return timeLog.offset + timeDiff;
  }, [timeLog]);

  // Set current playing position.
  const setPlayingPosition = useCallback(
    (time: number) => {
      if (transportState.current === "playing") {
        const context = audioContextRef.current;
        if (!context || !audio) {
          return;
        }

        const node = new AudioBufferSourceNode(context, { buffer: audio });
        node.onended = stopAudio;
        node.connect(context.destination);
        node.start(0, time);
        if (sourceNodeRef.current) {
          sourceNodeRef.current.onended = null;
          sourceNodeRef.current.stop();
        }
        sourceNodeRef.current = node;

        setTimeLog({
          logged: context.currentTime,
          offset: time,
        } satisfies TimeLog);
      } else {
        nextStartTimeRef.current = time;

        setTimeLog((draft) => {
          draft.offset = time;
        });
      }
    },
    [audio, stopAudio, transportState.current, setTimeLog]
  );

  return {
    getPlayingPosition,
    setPlayingPosition,
  };
}
