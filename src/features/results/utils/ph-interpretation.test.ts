import { describe, expect, it } from "vitest";
import { getPhInterpretation } from "./ph-interpretation";

describe("getPhInterpretation", () => {
  it.each([
    [1, "Asam kuat", "pH 1-2"],
    [2.4, "Asam kuat", "pH 1-2"],
    [2.5, "Asam lemah", "pH 3-6"],
    [6.4, "Asam lemah", "pH 3-6"],
    [6.5, "Netral", "pH 7"],
    [7.4, "Netral", "pH 7"],
    [7.5, "Basa lemah", "pH 8-11"],
    [11.4, "Basa lemah", "pH 8-11"],
    [11.5, "Basa kuat", "pH 12-14"],
    [14, "Basa kuat", "pH 12-14"],
  ])("maps %s to %s", (ph, label, rangeLabel) => {
    expect(getPhInterpretation(ph)).toMatchObject({ label, rangeLabel });
  });

  it("returns null for an invalid pH value", () => {
    expect(getPhInterpretation(Number.NaN)).toBeNull();
    expect(getPhInterpretation(Number.POSITIVE_INFINITY)).toBeNull();
  });

  it("clamps finite values to the configured pH 1-14 scale", () => {
    expect(getPhInterpretation(-2)?.label).toBe("Asam kuat");
    expect(getPhInterpretation(20)?.label).toBe("Basa kuat");
  });
});
