/**
 * Creates a proxy object that syncs with URL parameters
 * @param defaults Default values for parameters
 * @param windowRef Window reference (useful for testing)
 * @returns Proxy object that reads/writes to URL parameters
 */
export function createUrlParamsProxy<T extends { [key: string]: any; [key: symbol]: never }>(
  defaults: T,
  windowRef = window
) {
  const queryString = windowRef.location.search;
  const urlParamsObject = new URLSearchParams(queryString);

  const urlParams = new Proxy(defaults, {
    get: (target, prop: keyof typeof defaults) => {
      const value = urlParamsObject.get(prop.toString());

      if (value === null) {
        return target[prop];
      }

      if (value === '') {
        return true;
      }

      try {
        return JSON.parse(value);
      } catch (e) {
        return value;
      }
    },

    set: (_, prop: keyof typeof defaults, value) => {
      if (value === '') {
        urlParamsObject.delete(prop.toString());
      } else if (typeof value === 'object') {
        urlParamsObject.set(prop.toString(), JSON.stringify(value));
      } else {
        urlParamsObject.set(prop.toString(), String(value));
      }

      const { protocol, host, pathname } = windowRef.location;
      const newUrl = protocol + '//' + host + pathname + '?' + urlParamsObject.toString();
      windowRef.history.replaceState({ path: newUrl }, '', newUrl);

      return true;
    },

    deleteProperty(target, p) {
      urlParamsObject.delete(String(p));

      const { protocol, host, pathname } = windowRef.location;
      const newUrl = protocol + '//' + host + pathname + '?' + urlParamsObject.toString();
      windowRef.history.replaceState({ path: newUrl }, '', newUrl);

      delete (target as any)[p];

      return true;
    },
  });

  return urlParams;
}