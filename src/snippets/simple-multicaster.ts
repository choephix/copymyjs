/**
 * Creates a simple multicaster without priority handling
 * @returns A multicaster function with sub/unsub methods
 */
export function createSimpleMulticaster() {
  const subscribers: ((...args: any[]) => unknown)[] = [];

  const multicaster = function __multicasterEmit(...args: any[]) {
    let result = undefined;
    subscribers.forEach(callback => result = callback(...args));
    return result;
  };

  multicaster.sub = (callback: (...args: any[]) => unknown) => {
    subscribers.push(callback);
    return () => multicaster.unsub(callback);
  };

  multicaster.unsub = (callback: (...args: any[]) => unknown) => {
    const index = subscribers.indexOf(callback);
    if (index !== -1) {
      subscribers.splice(index, 1);
    }
  };

  multicaster.clear = () => {
    subscribers.length = 0;
  };

  return multicaster;
}