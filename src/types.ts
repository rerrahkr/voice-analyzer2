import type { SerializedStyles } from "@emotion/react";
import type React from "react";

/**
 * F0 information.
 */
export type F0Info = {
  /** Second. */
  time: Float64Array;
  /** Hz. */
  f0: Float64Array;
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
