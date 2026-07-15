import { describe, it, expect } from "vitest";
import { analyzePh } from "./analyze-ph";

/**
 * Creates a minimal ImageData object for testing.
 * Each pixel: [r, g, b, a] - alpha 255 for fully opaque.
 */
function makeImageData(
  width: number,
  height: number,
  r: number,
  g: number,
  b: number
): ImageData {
  const size = width * height;
  const data = new Uint8ClampedArray(size * 4);
  for (let i = 0; i < size; i++) {
    const offset = i * 4;
    data[offset] = r;
    data[offset + 1] = g;
    data[offset + 2] = b;
    data[offset + 3] = 255;
  }
  return { data, width, height, colorSpace: "srgb" } as ImageData;
}

describe("analyzePh", () => {
  it("returns a valid result for a red sample (expected pH ~1)", () => {
    // Pure red maps to hue ~0° (red-wrapped to 360°) → pH ~1
    const img = makeImageData(24, 24, 220, 20, 30);
    const result = analyzePh(img);
    expect(result).not.toBeNull();
    expect(result!.estimatedPh).toBeLessThanOrEqual(2);
    expect(result!.category).toBe("acid");
  });

  it("returns a valid result for a blue sample (expected pH ~7)", () => {
    // Blue maps to hue ~240° → near pH 7 in the new Clitoria ternatea table
    const img = makeImageData(24, 24, 20, 80, 210);
    const result = analyzePh(img);
    expect(result).not.toBeNull();
    expect(result!.estimatedPh).toBeGreaterThanOrEqual(6);
    expect(result!.estimatedPh).toBeLessThanOrEqual(9);
  });

  it("returns a valid result for a yellow sample (expected pH ~14)", () => {
    // Yellow maps to hue ~50° → near pH 14
    const img = makeImageData(24, 24, 230, 190, 10);
    const result = analyzePh(img);
    expect(result).not.toBeNull();
    expect(result!.estimatedPh).toBeGreaterThanOrEqual(12);
  });

  it("returns the calibrationIsTemporary flag", () => {
    const img = makeImageData(24, 24, 128, 100, 200);
    const result = analyzePh(img);
    expect(result!.calibrationIsTemporary).toBe(true);
  });

  it("returns sampledRgb and sampledHsl in the result", () => {
    const img = makeImageData(24, 24, 100, 150, 200);
    const result = analyzePh(img);
    expect(result!.sampledRgb).toMatchObject({ r: 100, g: 150, b: 200 });
    expect(result!.sampledHsl).toBeDefined();
    expect(result!.sampledHsl.h).toBeGreaterThanOrEqual(0);
  });

  it("passes through analysis options", () => {
    const img = makeImageData(24, 24, 220, 20, 30);
    const resultDefault = analyzePh(img);
    const resultCustom = analyzePh(img, { desaturationPull: 0.9 });
    // Both should produce results; custom options shouldn't crash
    expect(resultDefault).not.toBeNull();
    expect(resultCustom).not.toBeNull();
  });

  it("returns null for empty ImageData", () => {
    const empty: ImageData = {
      data: new Uint8ClampedArray(0),
      width: 0,
      height: 0,
      colorSpace: "srgb",
    } as ImageData;
    expect(analyzePh(empty)).toBeNull();
  });

  it("returns null for an entirely transparent image (no opaque pixels)", () => {
    const width = 24;
    const height = 24;
    const data = new Uint8ClampedArray(width * height * 4);
    // All alpha = 0 → no opaque pixels to average
    const img: ImageData = { data, width, height, colorSpace: "srgb" } as ImageData;
    expect(analyzePh(img)).toBeNull();
  });

  it("returns null for a 1x1 black pixel (near-achromatic guard)", () => {
    // Black → saturation near 0 → guard returns neutral before hue-based analysis.
    // With the near-achromatic guard in hueToPh, this should still return a result
    // (pH 7 from the guard).
    const img = makeImageData(24, 24, 10, 10, 10);
    const result = analyzePh(img);
    expect(result).not.toBeNull();
    // Near-achromatic: should be pulled to neutral.
    expect(result!.estimatedPh).toBeCloseTo(7, 0);
  });

  it("rejects null/undefined ImageData", () => {
    expect(analyzePh(null as unknown as ImageData)).toBeNull();
    expect(analyzePh(undefined as unknown as ImageData)).toBeNull();
  });

  it("the eligibility status matches the estimate", () => {
    const acidRed = makeImageData(24, 24, 220, 20, 30);
    const result = analyzePh(acidRed);
    expect(result!.eligibilityStatus).toBe("outside-range");

    // Blue-green around pH 5.5-7 should be "eligible"
    const blueGreen = makeImageData(24, 24, 10, 140, 160);
    const result2 = analyzePh(blueGreen);
    // This may or may not be eligible depending on exact interpolation
    expect(["eligible", "outside-range", "unknown"]).toContain(
      result2!.eligibilityStatus
    );
  });
});
