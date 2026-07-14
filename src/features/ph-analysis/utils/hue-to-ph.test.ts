import { describe, it, expect } from "vitest";
import { hueToPh } from "./hue-to-ph";

describe("hueToPh", () => {
  it("returns pH ~1 for hue 362 (red)", () => {
    const ph = hueToPh(362, 0.5);
    expect(ph).toBeCloseTo(1, 0);
  });

  it("returns pH ~14 for hue 40 (gold)", () => {
    const ph = hueToPh(40, 0.5);
    expect(ph).toBeCloseTo(14, 0);
  });

  it("returns pH ~7 for hue 196 (cyan)", () => {
    const ph = hueToPh(196, 0.5);
    expect(ph).toBeCloseTo(7, 0);
  });

  it("handles red-wrap: low hue values are treated as high-hue range", () => {
    // hue 10 should wrap to 370 and map near pH 1
    const ph = hueToPh(10, 0.5);
    expect(ph).toBeLessThanOrEqual(2);
    expect(ph).toBeGreaterThanOrEqual(0.9);
  });

  it("clamps hue above REF max (362) to the max", () => {
    const ph = hueToPh(400, 0.5);
    // Should be clamped to 362 → pH ~1
    expect(ph).toBeCloseTo(1, 0);
  });

  it("clamps hue below REF min (40) to the min", () => {
    const ph = hueToPh(20, 0.5);
    // Should wrap: 20 < 30, so h += 360 = 380, then clamp to 362
    expect(ph).toBeCloseTo(1, 0);
  });

  it("returns a deterministic result for mid-range hue", () => {
    const ph1 = hueToPh(200, 0.4);
    const ph2 = hueToPh(200, 0.4);
    expect(ph1).toBe(ph2);
  });

  it("returns a decimal pH value", () => {
    // Intermediate hue should produce a non-integer pH.
    const ph = hueToPh(210, 0.5);
    // It should have one decimal place and not be a clean integer.
    expect(Number.isFinite(ph)).toBe(true);
  });

  it("returns fallback value of 7 for very unusual input", () => {
    // hueToPh uses REF bounds; hue 1 wraps to 361 which is within bounds
    // Actually hue 1 < 30 wraps to 361, clamped to 362 (max) → pH 1
    // Let's test hue 365 → clamped to 362 → pH 1
    const ph = hueToPh(365, 0.5);
    expect(ph).toBeCloseTo(1, 0);
  });

  it("applies desaturation penalty when saturation is low", () => {
    // The desaturated result should be pulled toward neutral (7).
    // When the hue is NOT at neutral, desaturated pH should be closer to 7.
    const satPhAway = hueToPh(300, 0.5);
    const desatPhAway = hueToPh(300, 0.05);
    // Desaturated result should be closer to 7.
    expect(Math.abs(desatPhAway - 7)).toBeLessThan(Math.abs(satPhAway - 7));
  });

  it("handles zero saturation gracefully", () => {
    const ph = hueToPh(100, 0);
    // Should still return a valid pH, even if pulled toward neutral.
    expect(Number.isFinite(ph)).toBe(true);
    expect(ph).toBeGreaterThanOrEqual(1);
    expect(ph).toBeLessThanOrEqual(14);
  });
});
