import { describe, it, expect } from "vitest";
import { rgbToHsl } from "./rgb-to-hsl";

describe("rgbToHsl", () => {
  it("converts pure red (255, 0, 0) to hue 0", () => {
    const result = rgbToHsl(255, 0, 0);
    expect(result.h).toBe(0);
    expect(result.s).toBe(1);
    expect(result.l).toBeCloseTo(0.5, 1);
  });

  it("converts pure green (0, 255, 0) to hue 120", () => {
    const result = rgbToHsl(0, 255, 0);
    expect(result.h).toBe(120);
    expect(result.s).toBe(1);
    expect(result.l).toBeCloseTo(0.5, 1);
  });

  it("converts pure blue (0, 0, 255) to hue 240", () => {
    const result = rgbToHsl(0, 0, 255);
    expect(result.h).toBe(240);
    expect(result.s).toBe(1);
    expect(result.l).toBeCloseTo(0.5, 1);
  });

  it("converts white (255, 255, 255) to zero saturation", () => {
    const result = rgbToHsl(255, 255, 255);
    expect(result.s).toBe(0);
    expect(result.l).toBeCloseTo(1, 1);
  });

  it("converts black (0, 0, 0) to zero saturation", () => {
    const result = rgbToHsl(0, 0, 0);
    expect(result.s).toBe(0);
    expect(result.l).toBe(0);
  });

  it("converts a mid gray (128, 128, 128) to zero saturation", () => {
    const result = rgbToHsl(128, 128, 128);
    expect(result.s).toBe(0);
    expect(result.l).toBeCloseTo(0.502, 0);
  });

  it("produces hue between 0 and 360", () => {
    // Test many random inputs.
    const inputs = [
      [100, 150, 200],
      [200, 100, 50],
      [50, 200, 100],
      [10, 20, 30],
      [240, 10, 180],
    ];
    for (const [r, g, b] of inputs) {
      const result = rgbToHsl(r, g, b);
      expect(result.h).toBeGreaterThanOrEqual(0);
      expect(result.h).toBeLessThan(360);
      expect(result.s).toBeGreaterThanOrEqual(0);
      expect(result.s).toBeLessThanOrEqual(1);
      expect(result.l).toBeGreaterThanOrEqual(0);
      expect(result.l).toBeLessThanOrEqual(1);
    }
  });

  it("handles edge case where all channels are equal but non-zero", () => {
    const result = rgbToHsl(100, 100, 100);
    expect(result.h).toBe(0);
    expect(result.s).toBe(0);
    expect(result.l).toBeCloseTo(100 / 255, 2);
  });

  it("matches known legacy output for a sample color", () => {
    // A medium purple: sampled from the pH 3-4 range area
    const result = rgbToHsl(120, 20, 180);
    expect(result.h).toBeGreaterThan(270);
    expect(result.h).toBeLessThan(290);
    expect(result.s).toBeGreaterThan(0.5);
  });
});
