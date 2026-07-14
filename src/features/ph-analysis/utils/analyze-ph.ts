/** Complete pH analysis for an already-cropped sampling region. */

import { rgbToHsl } from "@/src/features/ph-analysis/utils/rgb-to-hsl";
import { hueToPh } from "@/src/features/ph-analysis/utils/hue-to-ph";
import { getAverageRgb } from "@/src/features/ph-analysis/utils/sample-center-region";
import { getPhCategory } from "@/src/features/ph-analysis/data/ref-table";
import { getEligibilityStatus } from "@/src/features/ph-analysis/utils/eligibility";
import type {
  PhAnalysisResult,
  AnalysisOptions,
} from "@/src/features/ph-analysis/types";

/**
 * Analyze ImageData that has already been cropped to the configured sampling
 * region. Region selection remains a separate canvas concern so this module
 * stays deterministic and independent from the DOM.
 */
export function analyzePh(
  sampledImageData: ImageData,
  options?: AnalysisOptions
): PhAnalysisResult | null {
  if (
    !sampledImageData ||
    sampledImageData.width <= 0 ||
    sampledImageData.height <= 0 ||
    sampledImageData.data.length === 0
  ) {
    return null;
  }

  const avgRgb = getAverageRgb(sampledImageData, "circle");
  if (!avgRgb) return null;

  const hsl = rgbToHsl(avgRgb.r, avgRgb.g, avgRgb.b);
  const estimatedPh = hueToPh(hsl.h, hsl.s, options);

  if (!Number.isFinite(estimatedPh)) return null;

  return {
    estimatedPh,
    category: getPhCategory(estimatedPh),
    eligibilityStatus: getEligibilityStatus(estimatedPh),
    sampledRgb: avgRgb,
    sampledHsl: hsl,
    calibrationIsTemporary: true,
  };
}
