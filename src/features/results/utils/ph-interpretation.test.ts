import { describe, expect, it } from "vitest";
import { getPhInterpretation } from "./ph-interpretation";

describe("getPhInterpretation", () => {
  it.each([
    // Fractional pH is compared directly — no more rounding.
    // Bands: Asam kuat [1–2.9], Asam lemah [3–6.9], Netral [7], Basa lemah [7.1–11.9], Basa kuat [12–14]
    [1, "Asam kuat", "pH 1–3"],
    [2.4, "Asam kuat", "pH 1–3"],
    [2.5, "Asam kuat", "pH 1–3"],
    [2.9, "Asam kuat", "pH 1–3"],
    [3.0, "Asam lemah", "pH 3–7"],
    [6.4, "Asam lemah", "pH 3–7"],
    [6.5, "Asam lemah", "pH 3–7"], // was incorrectly "Netral" due to rounding — now correct!
    [6.9, "Asam lemah", "pH 3–7"],
    [7.0, "Netral", "pH 7"],
    [7.1, "Basa lemah", "pH 7–12"],
    [7.5, "Basa lemah", "pH 7–12"],
    [11.4, "Basa lemah", "pH 7–12"],
    [11.5, "Basa lemah", "pH 7–12"],
    [11.9, "Basa lemah", "pH 7–12"],
    [12.0, "Basa kuat", "pH 12–14"],
    [14, "Basa kuat", "pH 12–14"],
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
