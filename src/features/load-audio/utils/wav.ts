import {
  arrayBufferToString,
  readArrayBufferElementAsUInt16,
  readArrayBufferElementAsUint32,
} from "@/features/load-audio/utils/array-buffer";
import type { AudioData } from "@/types";

/** Error that occurs when a buffer cannot be successfully encoded. */
export type WavEncodeInvalidBufferError = Error & {
  name: "WavInvalidBufferError";
};

function WavEncodeInvalidBufferError(): WavEncodeInvalidBufferError {
  const error = new Error() as WavEncodeInvalidBufferError;
  error.name = "WavInvalidBufferError";
  return error;
}

/** Type guard for WavEncodeInvalidBufferError. */
export function isWavEncodeInvalidBufferError(
  error: Error
): error is WavEncodeInvalidBufferError {
  return error.name === "WavInvalidBufferError";
}

/** Error generated when encoding unsupported format. */
export type WavEncodeUnsupportedFormatError = Error & {
  name: "WavUnsupportedFormatError";
};

function WavEncodeUnsupportedFormatError(
  message?: string
): WavEncodeUnsupportedFormatError {
  const error = new Error(message) as WavEncodeUnsupportedFormatError;
  error.name = "WavUnsupportedFormatError";
  return error;
}

/** Type guard for WavEncodeUnsupportedFormatError. */
export function isWavEncodeUnsupportedFormatError(
  error: Error
): error is WavEncodeUnsupportedFormatError {
  return error.name === "WavUnsupportedFormatError";
}

/**
 * Decode array buffer of WAV to audio data.
 * @param buffer file buffer contained WAV data.
 * @returns WAV data.
 * @throws Will throw an error if it is failed to decode data.
 */
export async function decodeWav(buffer: ArrayBuffer): Promise<AudioData> {
  const CHUNK_HEADER_SIZE = 8;

  // Read RIFF chunk.
  if (buffer.byteLength < CHUNK_HEADER_SIZE) {
    throw WavEncodeInvalidBufferError();
  }

  const riffId = arrayBufferToString(buffer, 0, 4);
  if (riffId !== "RIFF") {
    throw WavEncodeInvalidBufferError();
  }

  const riffChuckSize = readArrayBufferElementAsUint32(buffer, 4);
  if (buffer.byteLength < CHUNK_HEADER_SIZE + riffChuckSize) {
    throw WavEncodeInvalidBufferError();
  }

  const riffFormat = arrayBufferToString(buffer, 8, 4);
  if (riffFormat !== "WAVE") {
    throw WavEncodeInvalidBufferError();
  }

  // Read sub-chunks.
  const subChunksBuffer = buffer.slice(12, 12 + riffChuckSize - 4);

  let formatInfo: FormatInfo | undefined;
  let rawSamples: ArrayBuffer | undefined;
  let pos = 0;

  while (pos < subChunksBuffer.byteLength) {
    const subChunkId = arrayBufferToString(subChunksBuffer, pos, 4);

    const subChunkSize = readArrayBufferElementAsUint32(
      subChunksBuffer,
      pos + 4
    );
    if (subChunksBuffer.byteLength < pos + CHUNK_HEADER_SIZE + subChunkSize) {
      throw WavEncodeInvalidBufferError();
    }

    const subChunkBuffer = subChunksBuffer.slice(
      pos + CHUNK_HEADER_SIZE,
      pos + CHUNK_HEADER_SIZE + subChunkSize
    );

    switch (subChunkId) {
      case "fmt ":
        formatInfo = decodeFmtChunk(subChunkBuffer);
        break;

      case "data":
        rawSamples = subChunkBuffer;
        break;

      default:
        break;
    }

    pos += CHUNK_HEADER_SIZE + subChunkSize;
  }

  if (
    !formatInfo ||
    !rawSamples ||
    rawSamples.byteLength % formatInfo.blockSize !== 0
  ) {
    throw WavEncodeInvalidBufferError();
  }

  const audioData = makeWaveObject(formatInfo, rawSamples);

  return audioData;
}

type FormatInfo = {
  format: "PCM" | "IEEE Float";
  nChannels: number;
  sampleRate: number;
  byteRate: number;
  blockSize: number;
  bitDepth: number;
};

function decodeFmtChunk(buffer: ArrayBuffer): FormatInfo {
  const formatId = readArrayBufferElementAsUInt16(buffer, 0);
  const nChannels = readArrayBufferElementAsUInt16(buffer, 2);
  const sampleRate = readArrayBufferElementAsUint32(buffer, 4);
  const byteRate = readArrayBufferElementAsUint32(buffer, 8);
  const blockSize = readArrayBufferElementAsUInt16(buffer, 12);
  const bitDepth = readArrayBufferElementAsUInt16(buffer, 14);

  const format = ((): FormatInfo["format"] => {
    switch (formatId) {
      case 1:
        return "PCM";

      case 3:
        return "IEEE Float";

      default:
        throw WavEncodeUnsupportedFormatError();
    }
  })();

  if (
    blockSize !== (nChannels * bitDepth) / 8 ||
    byteRate !== blockSize * sampleRate
  ) {
    throw WavEncodeInvalidBufferError();
  }

  return {
    format,
    nChannels,
    sampleRate,
    byteRate,
    blockSize,
    bitDepth,
  } satisfies FormatInfo;
}

function makeWaveObject(
  formatInfo: FormatInfo,
  rawSamples: ArrayBuffer
): AudioData {
  const { format, sampleRate, bitDepth, nChannels } = formatInfo;

  // Get normalized audio samples.
  const normalizedArray = (() => {
    switch (format) {
      case "PCM": {
        const intArray = (() => {
          switch (bitDepth) {
            case 8:
              return new Int8Array(rawSamples);

            case 16:
              return new Int16Array(rawSamples);

            default:
              throw WavEncodeUnsupportedFormatError();
          }
        })();

        // Convert float 32 array in [-1.0, 1.0].
        const float32Array = new Float32Array(intArray.length);

        const negativeDenom = 1 << (intArray.BYTES_PER_ELEMENT * 8 - 1);
        const positiveDenom = -negativeDenom - 1;
        const normalize = (value: number): number =>
          value < 0 ? value / negativeDenom : value / positiveDenom;

        float32Array.forEach((value, i) => {
          float32Array[i] = normalize(value);
        });
        return float32Array;
      }

      case "IEEE Float":
        switch (bitDepth) {
          case 32:
            return new Float32Array(rawSamples);

          default:
            throw WavEncodeUnsupportedFormatError();
        }
    }
  })();

  // Reshape 1-D array to (channel, sample) object.
  const nSamples = normalizedArray.length / nChannels;

  const channels = Array(nChannels).map((_, channel) => ({
    samples: new Float32Array(nSamples).map(
      (_, sample) => normalizedArray[nChannels * sample + channel]
    ),
  })) satisfies AudioData["channels"];

  return {
    sampleRate,
    channels,
  } satisfies AudioData;
}
