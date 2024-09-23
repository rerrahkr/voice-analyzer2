import {
  type AudioState,
  type PitchState,
  type SyncViewsState,
  type TransportState,
  useAudioStore,
  usePitchState,
  useSyncViewsState,
  useTransportState,
} from "./store";

// Hooks for audio data.
export function useAudio(): AudioState["audio"] {
  return useAudioStore((state) => state.audio);
}

export function useSetAudio(): AudioState["setAudio"] {
  return useAudioStore((state) => state.setAudio);
}

export function useAudioIsLoading(): AudioState["audioIsLoading"] {
  return useAudioStore((state) => state.audioIsLoading);
}

export function useSetAudioIsLoading(): AudioState["setAudioIsLoading"] {
  return useAudioStore((state) => state.setAudioIsLoading);
}

// Hooks for audio transport.
export function useTransportStateState(): TransportState["state"] {
  return useTransportState((state) => state.state);
}

export function usePlayAudio(): TransportState["play"] {
  return useTransportState((state) => state.play);
}

export function usePauseAudio(): TransportState["pause"] {
  return useTransportState((state) => state.pause);
}

export function useStopAudio(): TransportState["stop"] {
  return useTransportState((state) => state.stop);
}

// Hooks for synchronized views.
export function useViewShouldFollowPlayback(): SyncViewsState["shouldFollowPlayback"] {
  return useSyncViewsState((state) => state.shouldFollowPlayback);
}

export function useEnableViewFollowPlayback(): SyncViewsState["enableFollowPlayback"] {
  return useSyncViewsState((state) => state.enableFollowPlayback);
}

export function usePitchViewIsVisible(): SyncViewsState["pitchViewIsVisible"] {
  return useSyncViewsState((state) => state.pitchViewIsVisible);
}

export function useSetPitchViewVisibility(): SyncViewsState["setPitchViewVisibility"] {
  return useSyncViewsState((state) => state.setPitchViewVisibility);
}

export function useViewScrollLeft(): SyncViewsState["scrollLeft"] {
  return useSyncViewsState((state) => state.scrollLeft);
}

export function useSetViewScrollLeft(): SyncViewsState["setScrollLeft"] {
  return useSyncViewsState((state) => state.setScrollLeft);
}

// Hooks for pitch.
export function usePitchInfo(): PitchState["pitchInfo"] {
  return usePitchState((state) => state.pitchInfo);
}

export function useSetPitchInfo(): PitchState["setPitchInfo"] {
  return usePitchState((state) => state.setPitchInfo);
}
