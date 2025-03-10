/**
 * Creates a reusable async function with caching and persistence capabilities.
 * 
 * @param asyncFn - The async function to be wrapped
 * @param updateCallback - Callback invoked when data is available (from cache or fresh)
 * @param options - Configuration options
 * @returns A wrapped function that implements the caching behavior
 */
export function createCachedAsyncFunction<T, Args extends any[]>(
  asyncFn: (...args: Args) => Promise<T>,
  updateCallback: (data: T, fromCache: boolean) => void,
  options?: {
    expiryMs?: number;
    storageKeyPrefix?: string;
    generateKey?: (args: Args) => string;
    storage?: Storage;
  }
) {
  const {
    expiryMs = Infinity,
    storageKeyPrefix = "cached-fn",
    generateKey = (args) => JSON.stringify(args),
    storage = localStorage
  } = options || {};

  // In-memory cache for pending promises to prevent duplicate requests
  const promiseCache = new Map<string, Promise<T>>();

  return async (...args: Args): Promise<T> => {
    // Generate storage key
    const fnName = asyncFn.name || "anonymous";
    const argKey = generateKey(args);
    const storageKey = `${storageKeyPrefix}:${fnName}:${argKey}`;

    // Check if we have valid cached data
    try {
      const cachedItem = storage.getItem(storageKey);
      if (cachedItem) {
        const { data, timestamp } = JSON.parse(cachedItem) as {
          data: T;
          timestamp: number;
        };

        const isValid = Date.now() - timestamp < expiryMs;
        if (isValid) {
          // Use cached data and notify through callback
          updateCallback(data, true);
          return data;
        }
      }
    } catch (error) {
      console.warn("Error reading from storage:", error);
    }

    // Check if this call is already in progress
    if (promiseCache.has(storageKey)) {
      return promiseCache.get(storageKey)!;
    }

    // Make the actual async call and cache the promise
    const promise = asyncFn(...args).then((result) => {
      // Store result with timestamp
      try {
        storage.setItem(
          storageKey,
          JSON.stringify({
            data: result,
            timestamp: Date.now(),
          })
        );
      } catch (error) {
        console.warn("Error writing to storage:", error);
      }

      // Invoke callback with fresh data
      updateCallback(result, false);
      
      // Remove from promise cache once resolved
      promiseCache.delete(storageKey);
      
      return result;
    });

    // Store promise in memory cache
    promiseCache.set(storageKey, promise);
    
    return promise;
  };
}
