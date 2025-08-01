import { ManyReasons } from './ManyReasons';

export function prettifyManyReasonsMapToStingMethod<
  T extends Record<string, ManyReasons>,
>(map: T) {
  return Object.assign(map, {
    toString() {
      return Object.entries(map)
        .filter(
          ([, reasons]) => reasons instanceof ManyReasons && reasons.hasAny()
        )
        .map(([key, reasons]) => `"${key}": ${reasons}`)
        .join('\n');
    },
  });
}
