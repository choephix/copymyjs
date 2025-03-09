/**
 * Creates a promise that resolves after a specified delay in seconds
 * @param seconds Delay in seconds
 * @returns Promise that resolves after the delay
 */
export function delaySeconds(seconds: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, seconds * 1000));
}
