/**
 * Creates a proxy that stores all values as a single JSON object in storage
 * @param key Storage key for the JSON object
 * @param defaults Default values for properties
 * @param storage Storage implementation (defaults to localStorage)
 * @returns Proxy object that reads/writes to storage
 */
export function createJsonStorageProxy<
  T extends Record<string, any> = any,
  TDefaults extends Partial<T> = {}
>(
  key: string,
  defaults: TDefaults = {} as TDefaults,
  storage: Pick<Storage, "getItem" | "setItem"> = localStorage
) {
  const getData = (): Record<string, any> => {
    try {
      const data = storage.getItem(key);
      return data ? JSON.parse(data) : { ...defaults };
    } catch {
      return { ...defaults };
    }
  };

  const setData = (data: Record<string, any>) => {
    try {
      storage.setItem(key, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error('Storage error:', error);
      return false;
    }
  };

  return new Proxy({ ...defaults } as Partial<T> & TDefaults, {
    set: (_, prop, value) => {
      const data = getData();
      data[prop as string] = value;
      return setData(data);
    },

    get: (_, prop) => {
      const data = getData();
      return prop in data ? data[prop as string] : defaults[prop as keyof TDefaults];
    },

    deleteProperty: (_, prop) => {
      const data = getData();
      delete data[prop as string];
      return setData(data);
    }
  });
} 
