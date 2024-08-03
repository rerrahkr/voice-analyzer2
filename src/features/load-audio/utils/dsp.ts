/**
 * Convert AudioBuffer from multi channels to monaural asynchronously.
 * @param source Source AudioBuffer.
 * @returns 1-channel AudioBuffer.
 */
export async function makeAudioBufferMono(
  source: AudioBuffer
): Promise<AudioBuffer> {
  const newArray = new Float32Array(source.length);
  for (let i = 0; i < source.numberOfChannels; i++) {
    source.getChannelData(i).forEach((sample, j) => {
      newArray[j] += sample;
    });
  }

  const converted = new AudioBuffer({
    numberOfChannels: 1,
    sampleRate: source.sampleRate,
    length: source.length,
  });
  converted.copyToChannel(
    newArray.map((sample) => sample / source.numberOfChannels),
    0
  );

  return converted;
}
