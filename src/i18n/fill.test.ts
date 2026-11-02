import { describe, expect, it } from "vitest";

import { fill } from "./fill";

describe("fill", () => {
  it("replaces placeholders with values", () => {
    expect(fill("Visit {site}", { site: "example.com" })).toBe("Visit example.com");
    expect(fill("{a} and {a}, {n}", { a: "x", n: 3 })).toBe("x and x, 3");
  });

  it("leaves unknown placeholders visible", () => {
    expect(fill("Hello {name}", {})).toBe("Hello {name}");
  });
});
