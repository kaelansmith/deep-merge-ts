import { deepMerge } from "../src/index";

// Utility function for compile-time type checking
function assertType<T>(value: T): void {}

describe("deepMerge", () => {
  // Basic merge
  test("merges two simple objects", () => {
    const a = { a: 1, b: 2 };
    const b = { b: 3, c: 4 };
    const result = deepMerge(a, b);
    expect(result).toEqual({ a: 1, b: 3, c: 4 });

    // Compile-time type assertion
    type ExpectedType = { a: number; b: number; c: number };
    assertType<ExpectedType>(result);

    // Runtime type assertions
    expect(Object.keys(result).sort()).toEqual(["a", "b", "c"]);
    expect(typeof result.a).toBe("number");
    expect(typeof result.b).toBe("number");
    expect(typeof result.c).toBe("number");
  });

  // Deep merge
  test("deeply merges nested objects", () => {
    const a = { a: 1, b: { x: 1, y: 2 } };
    const b = { b: { y: 3, z: 4 }, c: 5 };
    const result = deepMerge(a, b);
    expect(result).toEqual({ a: 1, b: { x: 1, y: 3, z: 4 }, c: 5 });

    // Compile-time type assertion
    type ExpectedType = {
      a: number;
      b: { x: number; y: number; z: number };
      c: number;
    };
    assertType<ExpectedType>(result);

    // Runtime type assertions
    expect(typeof result.a).toBe("number");
    expect(typeof result.b).toBe("object");
    expect(typeof result.b.x).toBe("number");
    expect(typeof result.b.y).toBe("number");
    expect(typeof result.b.z).toBe("number");
    expect(typeof result.c).toBe("number");
  });

  // Multiple objects merge
  test("merges multiple objects", () => {
    const a = { a: 1, b: 2 };
    const b = { b: 3, c: 4 };
    const c = { c: 5, d: 6 };
    const result = deepMerge(a, b, c);
    expect(result).toEqual({ a: 1, b: 3, c: 5, d: 6 });

    // Compile-time type assertion
    type ExpectedType = { a: number; b: number; c: number; d: number };
    assertType<ExpectedType>(result);

    // Runtime type assertions
    expect(Object.keys(result).sort()).toEqual(["a", "b", "c", "d"]);
    expect(typeof result.a).toBe("number");
    expect(typeof result.b).toBe("number");
    expect(typeof result.c).toBe("number");
    expect(typeof result.d).toBe("number");
  });

  // Array handling
  test("replaces arrays instead of merging them", () => {
    const a = { arr: [1, 2, 3] };
    const b = { arr: [4, 5] };
    const result = deepMerge(a, b);
    expect(result).toEqual({ arr: [4, 5] });

    // Compile-time type assertion
    type ExpectedType = { arr: number[] };
    assertType<ExpectedType>(result);

    // Runtime type assertions
    expect(Array.isArray(result.arr)).toBe(true);
    expect(result.arr).toEqual([4, 5]);
    expect(result.arr.every((item) => typeof item === "number")).toBe(true);
  });

  // Undefined handling
  test("handles undefined values", () => {
    const a = { a: 1, b: 2 };
    const b = { b: undefined as undefined | number, c: 3 };
    const result = deepMerge(a, b);
    expect(result).toEqual({ a: 1, b: undefined, c: 3 });

    // Compile-time type assertion
    type ExpectedType = { a: number; b: number | undefined; c: number };
    assertType<ExpectedType>(result);

    // Runtime type assertions
    expect(typeof result.a).toBe("number");
    expect(result.b).toBeUndefined();
    expect(typeof result.c).toBe("number");
  });

  // Complex nested structure
  test("correctly merges complex nested structures", () => {
    const a = {
      a: 1,
      b: {
        x: 1,
        y: { deep: "value" },
        z: [1, 2, 3],
      },
      c: "string",
    };
    const b = {
      b: {
        y: { deeper: "newValue" },
        z: [4, 5],
      },
      d: true,
    };
    const result = deepMerge(a, b);
    expect(result).toEqual({
      a: 1,
      b: {
        x: 1,
        y: { deep: "value", deeper: "newValue" },
        z: [4, 5],
      },
      c: "string",
      d: true,
    });

    // Compile-time type assertion
    type ExpectedType = {
      a: number;
      b: {
        x: number;
        y: { deep: string; deeper: string };
        z: number[];
      };
      c: string;
      d: boolean;
    };
    assertType<ExpectedType>(result);

    // Runtime type assertions
    expect(typeof result.a).toBe("number");
    expect(typeof result.b).toBe("object");
    expect(typeof result.b.x).toBe("number");
    expect(typeof result.b.y).toBe("object");
    expect(typeof result.b.y.deep).toBe("string");
    expect(typeof result.b.y.deeper).toBe("string");
    expect(Array.isArray(result.b.z)).toBe(true);
    expect(result.b.z.every((item) => typeof item === "number")).toBe(true);
    expect(typeof result.c).toBe("string");
    expect(typeof result.d).toBe("boolean");
  });
});
