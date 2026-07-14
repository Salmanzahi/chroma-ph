/**
 * Standard RGB → HSL conversion.
 * Preserved from the legacy implementation (index.html:500–517).
 *
 * Inputs: r, g, b in [0, 255].
 * Output: { h: hue in degrees [0, 360), s: saturation [0, 1], l: lightness [0, 1] }.
 */

import type { HslColor } from "@/src/features/ph-analysis/types";

export function rgbToHsl(r: number, g: number, b: number): HslColor {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;

  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);

  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case rn:
        h = (gn - bn) / d + (gn < bn ? 6 : 0);
        break;
      case gn:
        h = (bn - rn) / d + 2;
        break;
      default:
        h = (rn - gn) / d + 4;
    }
    h *= 60;
  }

  return { h, s, l };
}
