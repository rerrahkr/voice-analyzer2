import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import type { F0Info } from "./types";

// State for Audio data.
export type AudioState = {
  audio?: AudioBuffer;
  setAudio: (audio: AudioBuffer | undefined) => void;

  audioIsLoading: boolean;
  setAudioIsLoading: (loading: boolean) => void;
};

export const useAudioStore = create<AudioState>()(
  immer((set) => ({
    setAudio: (audio: AudioBuffer | undefined) => {
      set((state) => {
        state.audio = audio;
      });
    },

    audioIsLoading: false,

    setAudioIsLoading: (loading: boolean) => {
      set((draft) => {
        draft.audioIsLoading = loading;
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

// State for synchronized views.
export type SyncViewsState = {
  shouldFollowPlayback: boolean;
  enableFollowPlayback: (enabled: boolean) => void;
};

export const useSyncViewsState = create<SyncViewsState>()(
  immer((set) => ({
    shouldFollowPlayback: true,

    enableFollowPlayback: (enabled: boolean) => {
      set((state) => {
        state.shouldFollowPlayback = enabled;
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
