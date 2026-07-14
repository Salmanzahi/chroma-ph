# pH Color Analysis — Bioplastic pH Scanner

**Date:** 2026-07-14

---

## 1. Legacy Algorithm Preservation

The color-analysis pipeline was reconstructed from the received implementation records and preserved as typed, pure TypeScript modules. The exact legacy archive was not present in the supplied ZIP, so line-level provenance must be re-verified after the original legacy files are restored. Intentional changes are:

1. Magic numbers are now configurable via `AnalysisOptions`.
2. The eligibility function uses the client-confirmed pH range (5.5–7).
3. The reference table includes hex color values and category labels (additive only).

---

## 2. Extracted Modules

| Module                    | Legacy Lines | TypeScript File                                    |
| ------------------------- | ------------ | -------------------------------------------------- |
| REF table                 | 523–538      | `features/ph-analysis/data/ref-table.ts`           |
| `rgbToHsl(r, g, b)`      | 500–517      | `features/ph-analysis/utils/rgb-to-hsl.ts`         |
| `hueToPH(hue, sat)`      | 540–558      | `features/ph-analysis/utils/hue-to-ph.ts`          |
| Center sampling           | 482–493      | `features/ph-analysis/utils/sample-center-region.ts`|
| Pipeline composition      | 477–498      | `features/ph-analysis/utils/analyze-ph.ts`         |
| `verdictFor(ph)`          | 560–564      | `features/ph-analysis/utils/eligibility.ts`        |

---

## 3. Sampling Region

- **Strategy:** Centered circular sample inside a square crop measuring 24% of the shorter image dimension.
- **Calculation:** `size = Math.floor(Math.min(w, h) * 0.24)`; pixels outside the inscribed circle are excluded from averaging.
- **Position:** `sx = Math.floor((w - size) / 2)`, `sy = Math.floor((h - size) / 2)`.
- **Pixel iteration:** Simple loop, R, G, B accumulated; alpha ignored.
- **Averaging:** Arithmetic mean (`sum / count`).

### Limitations

- Assumes the bioplastic indicator fills the center of the frame.
- No edge detection, segmentation, or outlier rejection.
- Shadows, glare, or background objects in the center will skew results.
- No white-balance or color-correction reference.

---

## 4. RGB → HSL Conversion

Standard algorithm: normalize to [0, 1], compute max/min/delta, derive H, S, L.

- **Hue:** 0–360 degrees.
- **Saturation:** 0–1.
- **Lightness:** 0–1.
- Grayscale (R=G=B) → saturation 0, hue 0.

### Preservation Status

Algorithmically identical to the legacy implementation. Pure function with no side effects.

---

## 5. Hue → pH Interpolation

### Reference Table

14 temporary points, ordered descending by hue (362 → 40). Their original scientific provenance was not verifiable from the received ZIP and must be confirmed by the research team.

```
pH 1:  hue 362  (red)
pH 2:  hue 358  (red)
pH 3:  hue 279  (purple)
pH 4:  hue 264  (purple)
pH 5:  hue 239  (blue)
pH 6:  hue 237  (blue)
pH 7:  hue 196  (cyan)
pH 8:  hue 183  (teal)
pH 9:  hue 182  (teal)
pH 10: hue 181  (teal)
pH 11: hue 180  (teal)
pH 12: hue 119  (dark green)
pH 13: hue 50   (olive/gold)
pH 14: hue 40   (gold/yellow)
```

### Interpolation

1. **Red-wrap:** If `hue < 30`, add 360 to make reds continuous with high-hue range.
2. **Clamp:** Constrain hue to [40, 362] (REF bounds).
3. **Descending scan:** Find the segment where `clamped` falls between two adjacent REF entries.
4. **Linear interpolation:** `ph = a.ph + t * (b.ph - a.ph)` where `t = (a.hue - clamped) / (a.hue - b.hue)`.
5. **Desaturation penalty:** If `sat < 0.08`, pull pH toward neutral (7): `ph = ph + (7 - ph) * 0.3`.
6. **Round:** One decimal place (`Math.round(ph * 10) / 10`).
7. **Fallback:** Return 7 if no matching segment found.

### Configurable Parameters

| Parameter              | Default | Legacy Value | Config Key             |
| ---------------------- | ------- | ------------ | ---------------------- |
| Red-wrap threshold     | 30      | 30           | `redWrapThreshold`     |
| Desaturation threshold | 0.08    | 0.08         | `desaturationThreshold`|
| Desaturation pull      | 0.3     | 0.3          | `desaturationPull`     |
| Sample region fraction | 0.24    | 0.3          | `sampleRegionFraction` |

---

## 6. Eligibility

Separated from pH estimation as a pure function: `getEligibilityStatus(ph: number)`.

| pH Range       | Status           |
| -------------- | ---------------- |
| 5.5 ≤ pH ≤ 7.0 | `eligible`       |
| pH < 5.5       | `outside-range`  |
| pH > 7.0       | `outside-range`  |
| NaN / Infinity | `unknown`        |

**Change from legacy:** The legacy code used `pH ≤ 5` (acidic) / `5 < pH < 7.5` (safe) / `pH ≥ 7.5` (alkaline). The rebuild uses the client-confirmed range of 5.5–7 per `PROJECT_SCOPE.md §7.1`.

---

## 7. Result interpretation zones

The result page adds a provisional, display-only interpretation of the nearest whole-number reference point:

| Reference pH | Display label |
| ------------ | ------------- |
| 1-2          | Asam kuat     |
| 3-6          | Asam lemah    |
| 7            | Netral        |
| 8-11         | Basa lemah    |
| 12-14        | Basa kuat     |

These labels describe position on the configured pH scale only. They do not identify the compound, concentration, or degree of acid/base dissociation. The client-supplied bioplastic synthesis PDF describes materials and fabrication steps but contains no pH classification ranges; it was therefore not used as evidence for these boundaries.

## 8. Known Scientific Limitations

1. **pH 8–11 is unreliable:** 4 pH units mapped to only 3° of hue (180–183). Lighting noise alone exceeds this resolution. The legacy code itself acknowledged this.
2. **No white-balance correction:** Camera auto-WB shifts hues unpredictably. The same physical sample will produce different pH readings on different devices.
3. **Linear interpolation assumption:** The hue→pH relationship may not be linear for anthocyanin indicators across the full range.
4. **Center-only sampling** with simple averaging is vulnerable to shadows, glare, and off-center indicators.
5. **No JPEG round-trip in analysis:** RGB sampling reads raw canvas `ImageData`. JPEG encoding is used only for visual review and the reduced session preview.
6. **Desaturation penalty** (0.08 threshold, 0.3 pull factor) has no cited empirical justification.
7. **Red-wrap threshold** (30) is arbitrary — no justification in legacy comments.

---

## 8. What Must Be Replaced When Final Client Calibration Arrives

1. **`TEMPORARY_REF_TABLE`** in `features/ph-analysis/data/ref-table.ts` — replace the entire 14-point array with the client's validated dataset.
2. **`hexColor` values** — update to match the client's final reference colors.
3. **Configurable thresholds** — the client may provide empirically-determined values for desaturation threshold, pull factor, and red-wrap threshold.
4. **Eligibility bounds** — confirm that pH 5.5–7 is the final range.
5. **Disclaimer text** — replace placeholder disclaimers with client-approved regulatory/institutional language.
