/**
 * Get ArrayBuffer from given file asynchronously.
 * @param file File to read.
 * @returns Promise of ArrayBuffer which contains file content.
 */
export function readFileAsArray(file: File) {
  return new Promise<ArrayBuffer>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result as ArrayBuffer);
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}
