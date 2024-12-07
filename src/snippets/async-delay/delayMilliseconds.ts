/**
 * Creates a promise that resolves after a specified delay
 * @param ms Delay in milliseconds
 * @returns Promise that resolves after the delay
 */
export function delayMilliseconds(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
