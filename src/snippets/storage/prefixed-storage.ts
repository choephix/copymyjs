/**
 * Creates a proxy that stores individual values in storage with prefixed keys
 * @param prefix Prefix for storage keys
 * @param defaults Default values for properties
 * @param storage Storage implementation (defaults to localStorage)
 * @returns Proxy object that reads/writes to storage
 */
export function createPrefixedStorageProxy<
  T extends Record<string, any> = any,
  TDefaults extends Partial<T> = {}
>(
  prefix: string,
  defaults: TDefaults = {} as TDefaults,
  storage: Pick<Storage, "getItem" | "setItem" | "removeItem"> = localStorage
) {
  const getStorageKey = (key: string | symbol) => `${prefix}${String(key)}`;

  return new Proxy({ ...defaults } as Partial<T> & TDefaults, {
    set: (_, prop, value) => {
      const storageKey = getStorageKey(prop);
      try {
        storage.setItem(storageKey, JSON.stringify(value));
        return true;
      } catch (error) {
        console.error('Storage error:', error);
        return false;
      }
    },

    get: (_, prop) => {
      const storageKey = getStorageKey(prop);
      const value = storage.getItem(storageKey);
      
      if (value === null) {
        return defaults[prop as keyof TDefaults];
      }

      try {
        return JSON.parse(value);
      } catch {
        return value;
      }
    },

    deleteProperty: (_, prop) => {
      const storageKey = getStorageKey(prop);
      storage.removeItem(storageKey);
      return true;
    }
  });
} 
