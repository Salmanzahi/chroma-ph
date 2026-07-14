import { describe, it, expect } from "vitest";
import { isValidPhAnalysisResult } from "./browser-storage";

const validResult = {
  estimatedPh: 6.5,
  category: "acid",
  eligibilityStatus: "eligible",
  sampledRgb: { r: 100, g: 150, b: 200 },
  sampledHsl: { h: 200, s: 0.5, l: 0.4 },
  calibrationIsTemporary: true,
} as const;

describe("isValidPhAnalysisResult", () => {
  it("accepts a complete valid result", () => {
    expect(isValidPhAnalysisResult(validResult)).toBe(true);
  });

  it("rejects missing fields", () => {
    const invalid = { ...validResult } as Record<string, unknown>;
    delete invalid.category;
    expect(isValidPhAnalysisResult(invalid)).toBe(false);
  });

  it("rejects unsupported enum values", () => {
    expect(
      isValidPhAnalysisResult({ ...validResult, category: "safe" })
    ).toBe(false);
    expect(
      isValidPhAnalysisResult({
        ...validResult,
        eligibilityStatus: "maybe",
      })
    ).toBe(false);
  });

  it("rejects NaN, Infinity, and out-of-range values", () => {
    expect(
      isValidPhAnalysisResult({ ...validResult, estimatedPh: Number.NaN })
    ).toBe(false);
    expect(
      isValidPhAnalysisResult({ ...validResult, estimatedPh: Infinity })
    ).toBe(false);
    expect(
      isValidPhAnalysisResult({
        ...validResult,
        sampledRgb: { r: 300, g: 0, b: 0 },
      })
    ).toBe(false);
    expect(
      isValidPhAnalysisResult({
        ...validResult,
        sampledHsl: { h: 20, s: 1.5, l: 0.5 },
      })
    ).toBe(false);
  });

  it("requires temporary calibration metadata", () => {
    expect(
      isValidPhAnalysisResult({
        ...validResult,
        calibrationIsTemporary: false,
      })
    ).toBe(false);
  });
});
