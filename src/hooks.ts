import {
  type AudioState,
  type F0State,
  type SyncViewsState,
  type TransportState,
  useAudioStore,
  useF0State,
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

// Hooks for F0.
export function useF0Info(): F0State["f0Info"] {
  return useF0State((state) => state.f0Info);
}

export function useSetF0Info(): F0State["setF0Info"] {
  return useF0State((state) => state.setF0Info);
}
