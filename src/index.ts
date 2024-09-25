type DeepMergeTwo<T, U> = T extends Array<any>
  ? U extends Array<any>
    ? U
    : U extends undefined
    ? T
    : U
  : T extends object
  ? U extends object
    ? {
        [K in keyof T | keyof U]: K extends keyof T
          ? K extends keyof U
            ? DeepMergeTwo<T[K], U[K]>
            : T[K]
          : K extends keyof U
          ? U[K]
          : never;
      }
    : U
  : U;

type DeepMergeAll<T extends object[]> = T extends [infer First, ...infer Rest]
  ? Rest extends object[]
    ? DeepMergeTwo<First, DeepMergeAll<Rest>>
    : First
  : {};

export function isObject(item: unknown): item is Record<string, unknown> {
  return item && typeof item === "object" && !Array.isArray(item);
}

export function deepMerge<T extends object, U extends object[]>(
  target: T,
  ...sources: U
): DeepMergeAll<[T, ...U]> {
  return sources.reduce(
    (result, source) => {
      // Check if source is null or undefined
      if (source == null) return result;

      Object.keys(source).forEach((key) => {
        const sourceValue = source[key];
        if (sourceValue === undefined) {
          if (key in result) {
            delete result[key];
          }
        } else if (isObject(result[key]) && isObject(sourceValue)) {
          result[key] = deepMerge(
            result[key] as Record<string, unknown>,
            sourceValue
          );
        } else {
          result[key] = sourceValue;
        }
      });
      return result;
    },
    { ...target }
  ) as unknown as DeepMergeAll<[T, ...U]>;
}
