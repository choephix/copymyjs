/**
 * Creates a new object with only the specified keys
 * @param obj Source object
 * @param keys Keys to pick
 * @returns New object with only picked keys
 */
export function pick<T extends object, K extends keyof T>(
  obj: T,
  keys: K[]
): Pick<T, K> {
  return keys.reduce(
    (acc, key) => {
      if (key in obj) {
        acc[key] = obj[key];
      }
      return acc;
    },
    {} as Pick<T, K>
  );
}
