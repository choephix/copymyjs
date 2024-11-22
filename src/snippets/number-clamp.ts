/**
 * Clamps a number between min and max values
 * @param num Number to clamp
 * @param min Minimum value
 * @param max Maximum value
 * @returns Clamped number
 */
export function clamp(num: number, min: number, max: number): number {
  return Math.min(Math.max(num, min), max);
}
