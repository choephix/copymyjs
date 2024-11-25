type Resolver<T> = (value: T | PromiseLike<T>) => void;
type Rejecter = (reason?: any) => void;
type Executor<T> = (resolve: Resolver<T>, reject: Rejecter) => void;
type ThenCallback<T, TResult> =
  | ((value: T) => TResult | PromiseLike<TResult>)
  | null
  | undefined;
type CatchCallback<TResult> =
  | ((reason: any) => TResult | PromiseLike<TResult>)
  | null
  | undefined;
type FinallyCallback = (() => void) | null | undefined;

export class CustomThenable<T> {
  private state: 'pending' | 'fulfilled' | 'rejected' = 'pending';
  private value?: T;
  private error?: any;
  private thenQueue: Array<{
    onFulfilled: ThenCallback<T, any>;
    onRejected: CatchCallback<any>;
    resolve: Resolver<any>;
    reject: Rejecter;
  }> = [];

  constructor(executor: Executor<T>) {
    try {
      executor(
        value => this.resolve(value),
        reason => this.reject(reason)
      );
    } catch (error) {
      this.reject(error);
    }
  }

  private resolve(value: T | PromiseLike<T>): void {
    // Handle promise-like values (unwrapping)
    if (this.isPromiseLike(value)) {
      value.then(
        v => this.resolveValue(v),
        reason => this.reject(reason)
      );
      return;
    }

    this.resolveValue(value as T);
  }

  private resolveValue(value: T): void {
    if (this.state !== 'pending') return;

    this.state = 'fulfilled';
    this.value = value;
    this.processThenQueue();
  }

  private reject(reason?: any): void {
    if (this.state !== 'pending') return;

    this.state = 'rejected';
    this.error = reason;
    this.processThenQueue();
  }

  private processThenQueue(): void {
    queueMicrotask(() => {
      const currentQueue = [...this.thenQueue]; 
      this.thenQueue = [];
      
      for (const handler of currentQueue) {
        const { onFulfilled, onRejected, resolve, reject } = handler;

        try {
          if (this.state === 'fulfilled') {
            if (typeof onFulfilled === 'function') {
              const result = onFulfilled(this.value!);
              resolve(result);
            } else {
              resolve(this.value!);
            }
          } else if (this.state === 'rejected') {
            if (typeof onRejected === 'function') {
              const result = onRejected(this.error);
              resolve(result);
            } else {
              reject(this.error);
            }
          }
        } catch (error) {
          reject(error);
        }
      }
    });
  }

  then<TResult1 = T, TResult2 = never>(
    onFulfilled?: ThenCallback<T, TResult1>,
    onRejected?: CatchCallback<TResult2>
  ): CustomThenable<TResult1 | TResult2> {
    return new CustomThenable((resolve, reject) => {
      this.thenQueue.push({
        onFulfilled,
        onRejected,
        resolve,
        reject,
      });

      if (this.state !== 'pending') {
        this.processThenQueue();
      }
    });
  }

  catch<TResult = never>(
    onRejected?: CatchCallback<TResult>
  ): CustomThenable<T | TResult> {
    return this.then(undefined, onRejected);
  }

  finally(onFinally?: FinallyCallback): CustomThenable<T> {
    return this.then(
      value => {
        onFinally?.();
        return value;
      },
      reason => {
        onFinally?.();
        throw reason;
      }
    );
  }

  // Helper method to check if something is promise-like
  private isPromiseLike(value: any): value is PromiseLike<any> {
    return (
      value && typeof value === 'object' && typeof value.then === 'function'
    );
  }
}
