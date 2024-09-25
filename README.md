# Deep Merge TS

A tiny package for deeply/recursively merging 2 or more objects while producing a correctly typed result.

The goal of this package is to remain simple and tiny, perfect for use-cases where bundle size matters (i.e. frontend web apps).

There are other alternative packages that provide way more functionality, but that also have a much larger footprint; for example, [`deepmerge-ts`](https://github.com/RebeccaStevens/deepmerge-ts) is very popular, handles merging of things like Maps and Sets, and provides a ton of configuration options. But it may be overkill and potentially bloating your bundle size. They cover 100% of possible use-cases, whereas we take the 80/20 approach (take a glance at the source code for both and you'll understand).

# Installation

```bash
npm install @kaelan/deep-merge-ts
```

# Usage

```ts
import { deepMerge } from "@kaelan/deep-merge-ts";

const a = {
  a: "a",
  b: "b",
  c: {
    c1: "c1",
    c2: "c2",
    c3: {
      c3_1: "c3_1",
      c3_2: "c3_2",
    },
  },
};

const b = {
  b: "b!!",
  c: {
    c2: "c2!!",
    c3: {
      c3_1: "c3_1!!",
    },
    c4: "c4",
  },
  d: "d",
};

const merged = deepMerge(a, b);

console.log(merged);
/* 
output:
 {
   a: "a",
   b: "b!!",
   c: {
     c1: "c1",
     c2: "c2!!",
     c3: {  
       c3_1: "c3_1!!",
       c3_2: "c3_2",
     },
     c4: "c4",
   },
   d: "d",
 }
*/
```

# Issues

If you find any issues/bugs, please create an issue on GitHub. For feature requests, just keep in mind our 80/20 philosophy of keeping this package simple and tiny; if you have unique edge-case feature requests, feel free to create an issue, but also consider using an alternative package like [`deepmerge-ts`](https://github.com/RebeccaStevens/deepmerge-ts).
