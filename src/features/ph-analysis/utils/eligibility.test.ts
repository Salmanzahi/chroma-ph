import { describe, it, expect } from "vitest";
import { getEligibilityStatus } from "./eligibility";

describe("getEligibilityStatus", () => {
  it("returns 'eligible' for pH 5.5 (lower bound)", () => {
    expect(getEligibilityStatus(5.5)).toBe("eligible");
  });

  it("returns 'eligible' for pH 7 (upper bound)", () => {
    expect(getEligibilityStatus(7.0)).toBe("eligible");
  });

  it("returns 'eligible' for pH 6 (mid-range)", () => {
    expect(getEligibilityStatus(6.0)).toBe("eligible");
  });

  it("returns 'outside-range' for pH 5.49 (just below)", () => {
    expect(getEligibilityStatus(5.49)).toBe("outside-range");
  });

  it("returns 'outside-range' for pH above 7", () => {
    expect(getEligibilityStatus(7.1)).toBe("outside-range");
  });

  it("returns 'outside-range' for very low pH", () => {
    expect(getEligibilityStatus(1)).toBe("outside-range");
  });

  it("returns 'outside-range' for very high pH", () => {
    expect(getEligibilityStatus(14)).toBe("outside-range");
  });

  it("returns 'unknown' for NaN", () => {
    expect(getEligibilityStatus(NaN)).toBe("unknown");
  });

  it("returns 'unknown' for Infinity", () => {
    expect(getEligibilityStatus(Infinity)).toBe("unknown");
  });

  it("returns 'unknown' for -Infinity", () => {
    expect(getEligibilityStatus(-Infinity)).toBe("unknown");
  });
});
