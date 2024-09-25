type DeepMergeTwo<T, U> = T extends Array<any> ? U extends Array<any> ? U : U extends undefined ? T : U : T extends object ? U extends object ? {
    [K in keyof T | keyof U]: K extends keyof T ? K extends keyof U ? DeepMergeTwo<T[K], U[K]> : T[K] : K extends keyof U ? U[K] : never;
} : U : U;
type DeepMergeAll<T extends object[]> = T extends [infer First, ...infer Rest] ? Rest extends object[] ? DeepMergeTwo<First, DeepMergeAll<Rest>> : First : {};
export declare function isObject(item: unknown): item is Record<string, unknown>;
export declare function deepMerge<T extends object, U extends object[]>(target: T, ...sources: U): DeepMergeAll<[T, ...U]>;
export {};
