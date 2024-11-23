/**
 * Creates a custom awaitable (thenable) object that can be externally resolved or rejected
 * @returns An object with the awaitable promise and methods to resolve/reject it
 */
export function createCustomAwaitable<T>() {
  let resolve: (value: T | PromiseLike<T>) => void;
  let reject: (reason?: any) => void;
  
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });

  return {
    promise,
    resolve: (value: T) => resolve(value),
    reject: (reason?: any) => reject(reason),
    then: promise.then.bind(promise),
    catch: promise.catch.bind(promise),
    finally: promise.finally.bind(promise),
    [Symbol.toStringTag]: 'CustomAwaitable',
  };
} 
