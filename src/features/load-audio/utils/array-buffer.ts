/**
 * Convert given ArrayBuffer to string.
 * @param buffer Array buffer.
 * @param [byteOffset] Byte offset.
 * @param [length] Length.
 * @returns String.
 */
export function arrayBufferToString(
  buffer: ArrayBuffer,
  byteOffset?: number,
  length?: number
): string {
  const uint8s = new Uint8Array(buffer, byteOffset, length);
  return String.fromCharCode(...uint8s);
}

/**
 * Read array buffer element as Uint16.
 * @param buffer Raw array buffer.
 * @param [byteOffset] Offset to the first byte of element.
 * @returns Uint16 value.
 * @throws Will throw range error if given array is not long enough.
 */
export function readArrayBufferElementAsUInt16(
  buffer: ArrayBuffer,
  byteOffset?: number
): number {
  return new Uint16Array(buffer, byteOffset, 1)[0];
}

/**
 * Read array buffer element as Uint32.
 * @param buffer Raw array buffer.
 * @param [byteOffset] Offset to the first byte of element.
 * @returns Uint32 value.
 * @throws Will throw range error if given array is not long enough.
 */
export function readArrayBufferElementAsUint32(
  buffer: ArrayBuffer,
  byteOffset?: number
): number {
  return new Uint32Array(buffer, byteOffset, 1)[0];
}
