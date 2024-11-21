/**
 * Type for subscription position
 */
type Position = 'before' | 'after' | 'normal';

/**
 * Type for a subscriber with position
 */
type OrderedSubscriber = {
  callback: (...args: any[]) => unknown;
  position: Position;
};

/**
 * Creates a multicaster with before/after subscription ordering
 * @returns A multicaster function with subBefore/sub/subAfter methods
 */
export function createOrderedMulticaster() {
  const subscribers: OrderedSubscriber[] = [];

  const multicaster = function __multicasterEmit(...args: any[]) {
    let result = undefined;
    subscribers.forEach(({ callback }) => result = callback(...args));
    return result;
  };

  const addSubscriber = (callback: (...args: any[]) => unknown, position: Position) => {
    const newSubscriber = { callback, position };
    
    if (position === 'before') {
      subscribers.unshift(newSubscriber);
    } else if (position === 'after') {
      subscribers.push(newSubscriber);
    } else {
      const afterIndex = subscribers.findIndex(sub => sub.position === 'after');
      if (afterIndex === -1) {
        subscribers.push(newSubscriber);
      } else {
        subscribers.splice(afterIndex, 0, newSubscriber);
      }
    }

    return () => multicaster.unsub(callback);
  };

  multicaster.subBefore = (callback: (...args: any[]) => unknown) => 
    addSubscriber(callback, 'before');

  multicaster.sub = (callback: (...args: any[]) => unknown) => 
    addSubscriber(callback, 'normal');

  multicaster.subAfter = (callback: (...args: any[]) => unknown) => 
    addSubscriber(callback, 'after');

  multicaster.unsub = (callback: (...args: any[]) => unknown) => {
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