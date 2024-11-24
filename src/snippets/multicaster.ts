/**
 * Type for a subscriber with priority
 */
type MulticasterSubscriber = {
  callback: (...args: any[]) => unknown;
  priority: number;
};

/**
 * Creates a multicaster with priority-based subscription handling
 * @returns A multicaster function with sub/unsub methods
 */
export function createMulticaster() {
  const subscribers: MulticasterSubscriber[] = [];

  const multicaster = function __multicasterEmit(...args: any[]) {
    let result = undefined;
    const callMulticastHandler = ({ callback }: MulticasterSubscriber) =>
      (result = callback(...args));
    subscribers.forEach(callMulticastHandler);
    return result as any;
  };

  multicaster.sub = (
    callback: MulticasterSubscriber['callback'],
    priority = 0
  ) => {
    const insertIndex = subscribers.findIndex(sub => sub.priority < priority);
    const newSubscriber = { callback, priority };

    if (insertIndex === -1) {
      subscribers.push(newSubscriber);
    } else {
      subscribers.splice(insertIndex, 0, newSubscriber);
    }

    return () => multicaster.unsub(callback);
  };

  multicaster.unsub = (callback: MulticasterSubscriber['callback']) => {
    const index = subscribers.findIndex(sub => sub.callback === callback);
    if (index !== -1) {
      subscribers.splice(index, 1);
    }
  };

  multicaster.clear = () => {
    subscribers.length = 0;
  };

  return multicaster;
}
