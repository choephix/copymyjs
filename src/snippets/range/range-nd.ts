/**
 * Creates an N-dimensional array of coordinate tuples within specified ranges
 * @param ranges Array of [start, end) ranges for each dimension
 * @returns Array of coordinate tuples
 */
export function range(ranges: [number, number][]): number[][] {
  if (ranges.length === 0) return [[]];
  
  const [currentRange, ...remainingRanges] = ranges;
  const [start, end] = currentRange;
  
  // Base case: 1D range
  if (remainingRanges.length === 0) {
    return Array.from(
      { length: end - start },
      (_, i) => [start + i]
    );
  }
  
  // Recursive case: combine current dimension with remaining dimensions
  const result: number[][] = [];
  const subRanges = range(remainingRanges);
  
  for (let i = start; i < end; i++) {
    for (const subRange of subRanges) {
      result.push([i, ...subRange]);
    }
  }
  
  return result;
} 
