import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import type { F0Info } from "./types";

// State for Audio data.
export type AudioState = {
  audio?: AudioBuffer;
  setAudio: (audio: AudioBuffer | undefined) => void;
};

export const useAudioStore = create<AudioState>()(
  immer((set) => ({
    setAudio: (audio: AudioBuffer | undefined) => {
      set((state) => {
        state.audio = audio;
      });
    },
  }))
);

// State for audio transport.
type TransportStateState = "playing" | "pausing" | "stopping";

export type TransportState = {
  state: {
    current: TransportStateState;
    previous: TransportStateState;
  };

  elapsed: {
    time: number;
    lastStamp: number;
  };

  play: (current: number | undefined) => void;
  pause: (current: number | undefined) => void;
  stop: () => void;
};

export const useTransportState = create<TransportState>()(
  immer((set) => ({
    state: {
      current: "stopping",
      previous: "stopping",
    },

    elapsed: {
      time: 0,
      lastStamp: 0,
    },

    play: (current: number | undefined) => {
      set((state) => {
        state.state = {
          current: "playing",
          previous: state.state.current,
        };
        if (current) {
          state.elapsed.lastStamp = current;
        } else {
          state.elapsed = {
            time: 0,
            lastStamp: 0,
          };
        }
      });
    },

    pause: (current: number | undefined) => {
      set((state) => {
        state.state = {
          current: "pausing",
          previous: state.state.current,
        };
        if (current) {
          state.elapsed.time += current - state.elapsed.lastStamp;
          state.elapsed.lastStamp = current;
        } else {
          state.elapsed = {
            time: 0,
            lastStamp: 0,
          };
        }
      });
    },

    stop: () => {
      set((state) => {
        state.state = {
          current: "stopping",
          previous: state.state.current,
        };
        state.elapsed = {
          time: 0,
          lastStamp: 0,
        };
      });
    },
  }))
);

// State for F0.
export type F0State = {
  f0Info?: F0Info;
  setF0Info: (f0Info: F0Info | undefined) => void;
};

export const useF0State = create<F0State>()(
  immer((set) => ({
    setF0Info: (f0Info: F0Info | undefined) => {
      set((state) => {
        state.f0Info = f0Info;
      });
    },
  }))
);
