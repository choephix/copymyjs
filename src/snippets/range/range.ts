/**
 * Creates an array of numbers within a specified range
 * @param start Start of range (inclusive)
 * @param end End of range (exclusive)
 * @param step Step between numbers (default: 1)
 * @returns Array of numbers
 */
export function range(start: number, end?: number, step = 1): number[] {
  // Handle single argument case (treat as end, start from 0)
  if (end === undefined) {
    end = start;
    start = 0;
  }

  // Handle empty ranges
  if (start === end) return [];
  
  // Calculate length and create array
  const length = Math.max(Math.ceil((end - start) / step), 0);
  return Array.from({ length }, (_, i) => start + i * step);
} 
