type DeepMergeTwo<T, U> = T extends Function
  ? U extends Function
    ? U
    : U extends undefined
    ? T
    : U
  : T extends Array<any>
  ? U extends Array<any>
    ? U
    : U extends undefined
    ? T
    : U
  : T extends Record<string, any>
  ? U extends Record<string, any>
    ? {
        [K in keyof T | keyof U]: K extends keyof U
          ? U[K]
          : K extends keyof T
          ? T[K]
          : never;
      }
    : U extends undefined
    ? T
    : U
  : U extends undefined
  ? T
  : U;

type DeepMergeAll<T extends object[]> = T extends [infer First, ...infer Rest]
  ? Rest extends object[]
    ? DeepMergeTwo<First, DeepMergeAll<Rest>>
    : First
  : {};

export function isObject(item: unknown): item is Record<string, unknown> {
  return (
    item &&
    typeof item === "object" &&
    !Array.isArray(item) &&
    !(item instanceof Function)
  );
}

type DeepMergeOptions = {
  invalidValues?: unknown[];
};

// Define a type that excludes our special options property
type ExcludeOptions<T> = Omit<T, "__deepMergeOptions__">;

// Extend the object type to include our special options property
type ObjectWithOptions = Record<string, unknown> & {
  __deepMergeOptions__?: DeepMergeOptions;
};

export function deepMerge<T extends object, U extends object[]>(
  target: T,
  ...sources: U
): ExcludeOptions<DeepMergeAll<[T, ...U]>> {
  return sources?.reduce(
    (result, source) => {
      // Check if source is null or undefined
      if (source == null) return result;

      // Extract options if they exist
      const options = (source as ObjectWithOptions).__deepMergeOptions__;
      const invalidValues = options?.invalidValues || [];

      // Remove the options property before merging
      if ("__deepMergeOptions__" in source) {
        const sourceCopy = { ...source };
        delete (sourceCopy as ObjectWithOptions).__deepMergeOptions__;
        source = sourceCopy as typeof source;
      }

      Object.keys(source).forEach((key) => {
        const sourceValue = source[key];

        // Skip if sourceValue is in invalidValues
        if (invalidValues.some((value) => Object.is(value, sourceValue))) {
          return;
        }

        if (sourceValue === undefined) {
          if (key in result) {
            delete result[key];
          }
        } else if (isObject(result[key]) && isObject(sourceValue)) {
          // Pass options to nested objects by adding them to the sourceValue
          const nestedSource = { ...sourceValue };
          if (options) {
            (nestedSource as ObjectWithOptions).__deepMergeOptions__ = options;
          }

          result[key] = deepMerge(
            result[key] as Record<string, unknown>,
            nestedSource
          );
        } else {
          result[key] = sourceValue;
        }
      });
      return result;
    },
    { ...target }
  ) as unknown as ExcludeOptions<DeepMergeAll<[T, ...U]>>;
}
