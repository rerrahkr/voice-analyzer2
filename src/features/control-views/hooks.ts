import { usePitchInfo, useSetPitchViewVisibility } from "@/hooks";
import { useEffect } from "react";

export function useHidePitchView() {
  const pitchInfo = usePitchInfo();
  const setPitchViewVisibility = useSetPitchViewVisibility();

  useEffect(() => {
    if (!pitchInfo) {
      setPitchViewVisibility(false);
    }
  });

  return {
    canTogglePitchViewVisibility: pitchInfo !== undefined,
  };
}
