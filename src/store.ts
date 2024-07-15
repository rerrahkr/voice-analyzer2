import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

export type AudioState = {
  audio?: AudioBuffer;
  setAudio: (file?: AudioBuffer) => void;
};

export const useAudioStore = create<AudioState>()(
  immer((set) => ({
    setAudio: (file?: AudioBuffer) => {
      set((state) => {
        state.audio = file;
      });
    },
  }))
);

type TransportStateState = "playing" | "pausing" | "stopping";

export type TransportState = {
  state: {
    current: TransportStateState;
    previous: TransportStateState;
  };
  play: () => void;
  pause: () => void;
  stop: () => void;
};

export const useTransportState = create<TransportState>()(
  immer((set) => ({
    state: {
      current: "stopping",
      previous: "stopping",
    },

    play: () => {
      set((state) => {
        state.state = {
          current: "playing",
          previous: state.state.current,
        };
      });
    },

    pause: () => {
      set((state) => {
        state.state = {
          current: "pausing",
          previous: state.state.current,
        };
      });
    },

    stop: () => {
      set((state) => {
        state.state = {
          current: "stopping",
          previous: state.state.current,
        };
      });
    },
  }))
);
