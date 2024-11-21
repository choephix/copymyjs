/**
 * Removes duplicate values from an array
 * @param arr Array with possible duplicates
 * @returns Array with unique values
 */
export function unique<T>(arr: T[]): T[] {
  return [...new Set(arr)]
}