/**
 * Creates a cached version of a promise-returning function
 * @param fn Function that returns a promise
 * @returns Cached function that reuses the same promise for subsequent calls
 */
export function createCachedPromise<T>(fn: () => Promise<T>) {
  let cachedPromise: Promise<T> | null = null;

  return () => {
    if (!cachedPromise) {
      cachedPromise = fn();
    }
    return cachedPromise;
  };
}
