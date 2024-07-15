/**
 * Generate range iterators.
 * @param begin Begin number of range, that is inclusive.
 * @param end End number of range, that is exclusive.
 * @param step Step of iterators.
 * @yields Range iterator.
 */
export function* range(
  begin: number,
  end?: number | undefined,
  step?: number | undefined
): IterableIterator<number> {
  const endV = end ?? Number.POSITIVE_INFINITY;
  const stepV = step ?? 1;
  for (let i = begin; i < endV; i += stepV) {
    yield i;
  }
}
