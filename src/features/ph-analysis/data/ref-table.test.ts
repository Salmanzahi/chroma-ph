import { describe, it, expect } from "vitest";
import { TEMPORARY_REF_TABLE } from "./ref-table";

describe("TEMPORARY_REF_TABLE", () => {
  it("contains exactly 14 entries", () => {
    expect(TEMPORARY_REF_TABLE).toHaveLength(14);
  });

  it("covers pH 1 through 14", () => {
    const phValues = TEMPORARY_REF_TABLE.map((r) => r.ph);
    for (let ph = 1; ph <= 14; ph++) {
      expect(phValues).toContain(ph);
    }
  });

  it("has every entry marked as temporary", () => {
    for (const ref of TEMPORARY_REF_TABLE) {
      expect(ref.isTemporary).toBe(true);
    }
  });

  it("is ordered descending by hue (high → low)", () => {
    for (let i = 0; i < TEMPORARY_REF_TABLE.length - 1; i++) {
      expect(TEMPORARY_REF_TABLE[i].hue).toBeGreaterThanOrEqual(
        TEMPORARY_REF_TABLE[i + 1].hue
      );
    }
  });

  it("has valid hexColor for every entry", () => {
    for (const ref of TEMPORARY_REF_TABLE) {
      expect(ref.hexColor).toBeDefined();
      expect(ref.hexColor).toMatch(/^#[0-9a-fA-F]{6}$/);
    }
  });

  it("has valid category for every entry", () => {
    const validCategories = ["acid", "neutral", "base"];
    for (const ref of TEMPORARY_REF_TABLE) {
      expect(validCategories).toContain(ref.category);
    }
  });

  it("uses neutral only for pH 7 and base for values above 7", () => {
    expect(TEMPORARY_REF_TABLE.find((ref) => ref.ph === 7)?.category).toBe(
      "neutral"
    );
    for (const ref of TEMPORARY_REF_TABLE.filter((item) => item.ph > 7)) {
      expect(ref.category).toBe("base");
    }
  });
});
