import {
  type AudioState,
  type TransportState,
  useAudioStore,
  useTransportState,
} from "./store";

export function useAudio(): AudioState["audio"] {
  return useAudioStore((state) => state.audio);
}

export function useSetAudio(): AudioState["setAudio"] {
  return useAudioStore((state) => state.setAudio);
}

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
