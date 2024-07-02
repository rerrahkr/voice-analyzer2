/** Audio data type. */
export type AudioData = {
  /** Sample rate. */
  sampleRate: number;
  /** Channel list. */
  channels: {
    /** Sample sequence. */
    samples: Float32Array;
  }[];
};
