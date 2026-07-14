import { describe, it, expect } from "vitest";
import { getSamplingRegion, getAverageRgb } from "./sample-center-region";

describe("getSamplingRegion", () => {
  it("returns a centered square region for a valid canvas size", () => {
    const region = getSamplingRegion(1000, 800, 0.3);
    expect(region).not.toBeNull();
    expect(region!.size).toBe(240); // 0.3 * min(1000, 800) = 240
    expect(region!.sx).toBe(380); // (1000 - 240) / 2
    expect(region!.sy).toBe(280); // (800 - 240) / 2
  });

  it("returns null for zero width", () => {
    expect(getSamplingRegion(0, 100)).toBeNull();
  });

  it("returns null for zero height", () => {
    expect(getSamplingRegion(100, 0)).toBeNull();
  });

  it("returns null for negative dimensions", () => {
    expect(getSamplingRegion(-100, 200)).toBeNull();
  });

  it("rejects invalid sampling fractions", () => {
    expect(getSamplingRegion(100, 100, 0)).toBeNull();
    expect(getSamplingRegion(100, 100, -0.2)).toBeNull();
    expect(getSamplingRegion(100, 100, 1.1)).toBeNull();
    expect(getSamplingRegion(100, 100, Number.NaN)).toBeNull();
  });
});

describe("getAverageRgb", () => {
  it("returns the average RGB for a uniform image", () => {
    // Create a 2x2 image where every pixel is R=100, G=150, B=200
    const data = new Uint8ClampedArray([
      100, 150, 200, 255, 100, 150, 200, 255,
      100, 150, 200, 255, 100, 150, 200, 255,
    ]);
    const imageData = new ImageData(data, 2, 2);
    const avg = getAverageRgb(imageData);
    expect(avg).not.toBeNull();
    expect(avg!.r).toBe(100);
    expect(avg!.g).toBe(150);
    expect(avg!.b).toBe(200);
  });

  it("returns the average for mixed pixels", () => {
    // Pixel 1: R=0, G=0, B=0; Pixel 2: R=100, G=100, B=100
    const data = new Uint8ClampedArray([
      0, 0, 0, 255, 100, 100, 100, 255,
    ]);
    const imageData = new ImageData(data, 2, 1);
    const avg = getAverageRgb(imageData);
    expect(avg).not.toBeNull();
    expect(avg!.r).toBe(50);
    expect(avg!.g).toBe(50);
    expect(avg!.b).toBe(50);
  });

  it("returns null for empty ImageData", () => {
    const imageData = new ImageData(0, 0);
    const avg = getAverageRgb(imageData);
    expect(avg).toBeNull();
  });

  it("ignores fully transparent pixels rather than treating them as black", () => {
    const data = new Uint8ClampedArray([
      0, 0, 0, 0,
      120, 80, 40, 255,
    ]);
    const avg = getAverageRgb(new ImageData(data, 2, 1));
    expect(avg).toEqual({ r: 120, g: 80, b: 40 });
  });

  it("returns null when a sample contains only transparent pixels", () => {
    const data = new Uint8ClampedArray([0, 0, 0, 0]);
    expect(getAverageRgb(new ImageData(data, 1, 1))).toBeNull();
  });

  it("excludes pixels outside a circular sample area", () => {
    const data = new Uint8ClampedArray(5 * 5 * 4);

    for (let y = 0; y < 5; y++) {
      for (let x = 0; x < 5; x++) {
        const offset = (y * 5 + x) * 4;
        const isCorner = (x === 0 || x === 4) && (y === 0 || y === 4);
        data[offset] = isCorner ? 255 : 0;
        data[offset + 1] = 0;
        data[offset + 2] = isCorner ? 0 : 255;
        data[offset + 3] = 255;
      }
    }

    expect(getAverageRgb(new ImageData(data, 5, 5), "circle")).toEqual({
      r: 0,
      g: 0,
      b: 255,
    });
  });
});
