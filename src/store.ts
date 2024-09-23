import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import type { PitchInfo } from "./types";

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

  pitchViewIsVisible: boolean;
  setPitchViewVisibility: (visible: boolean) => void;

  scrollLeft: number;
  setScrollLeft: (offset: number) => void;
};

export const useSyncViewsState = create<SyncViewsState>()(
  immer((set) => ({
    shouldFollowPlayback: true,

    enableFollowPlayback: (enabled: boolean) => {
      set((state) => {
        state.shouldFollowPlayback = enabled;
      });
    },

    pitchViewIsVisible: false,

    setPitchViewVisibility: (visible: boolean) => {
      set((state) => {
        state.pitchViewIsVisible = visible;
      });
    },

    scrollLeft: 0,

    setScrollLeft: (offset: number) => {
      set((state) => {
        state.scrollLeft = offset;
      });
    },
  }))
);

// State for pitch.
export type PitchState = {
  pitchInfo?: PitchInfo;
  setPitchInfo: (pitchInfo: PitchInfo | undefined) => void;
};

export const usePitchState = create<PitchState>()(
  immer((set) => ({
    setPitchInfo: (pitchInfo: PitchInfo | undefined) => {
      set((state) => {
        state.pitchInfo = pitchInfo;
      });
    },
  }))
);
