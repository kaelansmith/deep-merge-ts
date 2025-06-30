type DeepMergeTwo<T, U> = T extends Function ? U extends Function ? U : U extends undefined ? T : U : T extends Array<any> ? U extends Array<any> ? U : U extends undefined ? T : U : T extends Record<string, any> ? U extends Record<string, any> ? {
    [K in keyof T | keyof U]: K extends keyof U ? U[K] : K extends keyof T ? T[K] : never;
} : U extends undefined ? T : U : U extends undefined ? T : U;
type DeepMergeAll<T extends object[]> = T extends [infer First, ...infer Rest] ? Rest extends object[] ? DeepMergeTwo<First, DeepMergeAll<Rest>> : First : {};
export declare function isObject(item: unknown): item is Record<string, unknown>;
type ExcludeOptions<T> = Omit<T, "__deepMergeOptions__">;
export declare function deepMerge<T extends object, U extends object[]>(target: T, ...sources: U): ExcludeOptions<DeepMergeAll<[T, ...U]>>;
export {};
