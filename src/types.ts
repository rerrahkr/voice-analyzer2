import type { SerializedStyles } from "@emotion/react";
import type React from "react";

/**
 * Pitch information.
 */
export type PitchInfo = {
  /** Second. */
  time: Float64Array;
  /** Cent. */
  data: Float64Array;
};

/**
 * Props type which is used in custom component to append style props.
 */
export type CustomComponentStyleProps = {
  /**
   * Static style for container element.
   */
  staticCss?: SerializedStyles | undefined;

  /**
   * Dynamic style for container element.
   */
  style?: React.CSSProperties | undefined;
};
