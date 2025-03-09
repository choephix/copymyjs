/**
 * Creates a cached version of a promise-returning function with cache invalidation
 * @param fn Function that returns a promise
 * @returns Object with cached function and methods to control caching
 */
export function createResettableCachedPromise<T>(fn: () => Promise<T>) {
  let cachedPromise: Promise<T> | null = null;

  const execute = () => {
    if (!cachedPromise) {
      cachedPromise = fn();
    }
    return cachedPromise;
  };

  return {
    execute,
    reset: () => {
      cachedPromise = null;
    },
  };
}
