import { describe, it, expect, beforeEach } from "vitest";
import {
  rgbToHex,
  hexToRgb,
  hslToRgb,
  SAMPLE_PRESETS,
  updatePhMeasurement,
} from "./history-service";

describe("history-service", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("converts RGB values correctly to Hex string", () => {
    expect(rgbToHex(216, 118, 180)).toBe("#d876b4");
    expect(rgbToHex(35, 0, 94)).toBe("#23005e");
    expect(rgbToHex(0, 0, 0)).toBe("#000000");
    expect(rgbToHex(255, 255, 255)).toBe("#ffffff");
  });

  it("converts Hex string correctly to RGB values", () => {
    expect(hexToRgb("#d876b4")).toEqual({ r: 216, g: 118, b: 180 });
    expect(hexToRgb("d876b4")).toEqual({ r: 216, g: 118, b: 180 });
    expect(hexToRgb("#fff")).toEqual({ r: 255, g: 255, b: 255 });
    expect(hexToRgb("invalid")).toBeNull();
  });

  it("converts HSL to RGB values", () => {
    // Pure Red: H=0, S=100, L=50
    expect(hslToRgb(0, 100, 50)).toEqual({ r: 255, g: 0, b: 0 });
    // Pure Green: H=120, S=100, L=50
    expect(hslToRgb(120, 100, 50)).toEqual({ r: 0, g: 255, b: 0 });
    // Pure Blue: H=240, S=100, L=50
    expect(hslToRgb(240, 100, 50)).toEqual({ r: 0, g: 0, b: 255 });
  });

  it("contains preset samples from note.txt", () => {
    expect(SAMPLE_PRESETS.length).toBe(8);
    const lemon = SAMPLE_PRESETS.find((p) => p.bahanUji === "Air Lemon");
    expect(lemon).toBeDefined();
    expect(lemon?.ph).toBe(3.2);
    expect(lemon?.rgb).toEqual({ r: 216, g: 118, b: 180 });
    expect(lemon?.hsl).toEqual({ h: 322, s: 56, l: 65 });

    const gula = SAMPLE_PRESETS.find((p) => p.bahanUji === "Air Gula");
    expect(gula).toBeDefined();
    expect(gula?.ph).toBe(7.5);
    expect(gula?.rgb).toEqual({ r: 75, g: 92, b: 120 });
    expect(gula?.hsl).toEqual({ h: 217, s: 23, l: 38 });
    expect(gula?.kategoriKualitatif).toBe("Basa lemah");

    const vixal = SAMPLE_PRESETS.find((p) => p.bahanUji === "Pembersih Lantai (Vixal)");
    expect(vixal).toBeDefined();
    expect(vixal?.ph).toBe(5.4);
    expect(vixal?.rgb).toEqual({ r: 23, g: 3, b: 50 });
    expect(vixal?.hsl).toEqual({ h: 266, s: 89, l: 10 });

    const sunlight = SAMPLE_PRESETS.find((p) => p.bahanUji === "Sunlight");
    expect(sunlight).toBeDefined();
    expect(sunlight?.ph).toBe(3.4);
    expect(sunlight?.rgb).toEqual({ r: 82, g: 41, b: 71 });
    expect(sunlight?.hsl).toEqual({ h: 317, s: 32, l: 24 });
  });

  it("updates local cache correctly on updatePhMeasurement", async () => {
    const mockRecord = {
      id: "local_123",
      bahanUji: "Sampel Awal",
      ph: 5.5,
      rgb: { r: 100, g: 100, b: 100 },
      hsl: { h: 0, s: 0, l: 39 },
      warna: "#646464",
      kategoriKualitatif: "Asam lemah",
      createdAt: Date.now(),
    };

    localStorage.setItem("phdetector_history_cache", JSON.stringify([mockRecord]));

    await updatePhMeasurement("local_123", {
      bahanUji: "Sampel Terupdate",
      ph: 7.0,
      kategoriKualitatif: "Netral",
      volumeSolven: 150,
      volumeSolut: 10,
      satuanSolut: "gr",
    });

    const cached = JSON.parse(localStorage.getItem("phdetector_history_cache") || "[]");
    expect(cached[0].bahanUji).toBe("Sampel Terupdate");
    expect(cached[0].ph).toBe(7.0);
    expect(cached[0].kategoriKualitatif).toBe("Netral");
    expect(cached[0].volumeSolven).toBe(150);
    expect(cached[0].volumeSolut).toBe(10);
    expect(cached[0].satuanSolut).toBe("gr");
  });
});
