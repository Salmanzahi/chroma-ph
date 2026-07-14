/**
 * Hue → pH estimation via linear interpolation of the REF table.
 * Preserved from the legacy implementation (index.html:540–558).
 *
 * Key behaviors:
 * - Red-wrap: hue < 30 → add 360 to make reds continuous with the high-hue acid range.
 * - Descending scan: REF is ordered high-hue → low-hue (362 → 40).
 * - Desaturation penalty: if sat < threshold, pH is pulled toward neutral (7).
 * - Clamping: hue is clamped to REF bounds [40, 362].
 *
 * All magic numbers are configurable via options.
 */

import { TEMPORARY_REF_TABLE } from "@/src/features/ph-analysis/data/ref-table";
import {
  DEFAULT_RED_WRAP_THRESHOLD,
  DEFAULT_DESATURATION_THRESHOLD,
  DEFAULT_DESATURATION_PULL,
  NEUTRAL_PH,
} from "@/src/lib/constants";
import type { AnalysisOptions } from "@/src/features/ph-analysis/types";

export function hueToPh(
  hue: number,
  saturation: number,
  options?: AnalysisOptions
): number {
  const redWrap = options?.redWrapThreshold ?? DEFAULT_RED_WRAP_THRESHOLD;
  const desatThreshold =
    options?.desaturationThreshold ?? DEFAULT_DESATURATION_THRESHOLD;
  const desatPull = options?.desaturationPull ?? DEFAULT_DESATURATION_PULL;

  let h = hue;

  // Red-wrap: treat near-zero reds as continuous with the high-hue acid range.
  if (h < redWrap) {
    h += 360;
  }

  const ref = TEMPORARY_REF_TABLE;
  const minHue = ref[ref.length - 1].hue; // 40
  const maxHue = ref[0].hue; // 362

  const clamped = Math.min(Math.max(h, minHue), maxHue);

  // Descending scan: REF is ordered high-hue → low-hue.
  for (let i = 0; i < ref.length - 1; i++) {
    const a = ref[i];
    const b = ref[i + 1];

    if (clamped <= a.hue && clamped >= b.hue) {
      const t = (a.hue - clamped) / (a.hue - b.hue);
      let ph = a.ph + t * (b.ph - a.ph);

      // Desaturation penalty: near-gray samples are unreliable.
      // Pull mildly toward neutral rather than reporting a confident false reading.
      if (saturation < desatThreshold) {
        ph = ph + (NEUTRAL_PH - ph) * desatPull;
      }

      return Math.round(ph * 10) / 10;
    }
  }

  // Fallback: no matching segment found.
  return NEUTRAL_PH;
}
