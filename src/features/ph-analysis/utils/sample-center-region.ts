/**
 * Canvas center-region sampling utility.
 * Extracted and typed from legacy implementation (index.html:482–493).
 *
 * Crops a centered square region, then computes the simple arithmetic mean of
 * R, G, B across either the whole crop or its inscribed circle.
 *
 * Known limitation: center-only averaging with no outlier rejection
 * is vulnerable to shadows, glare, and off-center indicators.
 */

import type { RgbColor, SamplingRegion } from "@/src/features/ph-analysis/types";
import { DEFAULT_SAMPLE_REGION_FRACTION } from "@/src/lib/constants";

/**
 * Compute the sampling region dimensions for a given canvas size.
 */
export function getSamplingRegion(
  canvasWidth: number,
  canvasHeight: number,
  fraction: number = DEFAULT_SAMPLE_REGION_FRACTION
): SamplingRegion | null {
  if (
    !Number.isFinite(canvasWidth) ||
    !Number.isFinite(canvasHeight) ||
    !Number.isFinite(fraction) ||
    canvasWidth <= 0 ||
    canvasHeight <= 0 ||
    fraction <= 0 ||
    fraction > 1
  ) {
    return null;
  }

  const size = Math.floor(Math.min(canvasWidth, canvasHeight) * fraction);
  if (size <= 0) return null;

  const sx = Math.floor((canvasWidth - size) / 2);
  const sy = Math.floor((canvasHeight - size) / 2);

  return { sx, sy, size };
}

/**
 * Sample the center region of an ImageData object and return the average RGB.
 * Returns null if the ImageData is empty or invalid.
 */
export function getAverageRgb(
  imageData: ImageData,
  shape: "square" | "circle" = "square"
): RgbColor | null {
  if (!imageData || imageData.data.length === 0) return null;

  const { data } = imageData;
  const centerX = (imageData.width - 1) / 2;
  const centerY = (imageData.height - 1) / 2;
  const radius = Math.min(imageData.width, imageData.height) / 2;
  const radiusSquared = radius * radius;
  let r = 0;
  let g = 0;
  let b = 0;
  let n = 0;

  for (let i = 0; i < data.length; i += 4) {
    if (shape === "circle") {
      const pixelIndex = i / 4;
      const x = pixelIndex % imageData.width;
      const y = Math.floor(pixelIndex / imageData.width);
      const dx = x - centerX;
      const dy = y - centerY;
      if (dx * dx + dy * dy > radiusSquared) continue;
    }

    // Transparent pixels do not represent a visible indicator colour. Treating
    // them as black biases PNG uploads and can produce a false pH estimate.
    if (data[i + 3] === 0) continue;
    r += data[i];
    g += data[i + 1];
    b += data[i + 2];
    n++;
  }

  if (n === 0) return null;

  return {
    r: Math.round(r / n),
    g: Math.round(g / n),
    b: Math.round(b / n),
  };
}
