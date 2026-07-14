/** Canvas utility functions for the scanner. */

import { MAX_ANALYSIS_DIMENSION } from "@/src/lib/constants";

function getScaledDimensions(
  width: number,
  height: number,
  maxDimension: number = MAX_ANALYSIS_DIMENSION
): { width: number; height: number } | null {
  if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) {
    return null;
  }

  const scale = Math.min(1, maxDimension / Math.max(width, height));
  return {
    width: Math.max(1, Math.round(width * scale)),
    height: Math.max(1, Math.round(height * scale)),
  };
}

/** Draw a video frame onto a memory-bounded canvas. */
export function drawVideoFrameToCanvas(
  video: HTMLVideoElement,
  canvas: HTMLCanvasElement
): CanvasRenderingContext2D | null {
  const dimensions = getScaledDimensions(video.videoWidth, video.videoHeight);
  if (!dimensions) return null;

  canvas.width = dimensions.width;
  canvas.height = dimensions.height;

  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return null;

  ctx.drawImage(video, 0, 0, dimensions.width, dimensions.height);
  return ctx;
}

/** Draw an uploaded image onto a memory-bounded canvas. */
export function drawImageToCanvas(
  img: HTMLImageElement,
  canvas: HTMLCanvasElement
): CanvasRenderingContext2D | null {
  const dimensions = getScaledDimensions(img.naturalWidth, img.naturalHeight);
  if (!dimensions) return null;

  canvas.width = dimensions.width;
  canvas.height = dimensions.height;

  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return null;

  ctx.drawImage(img, 0, 0, dimensions.width, dimensions.height);
  return ctx;
}

/** Extract ImageData from a square sampling region. */
export function getSampledImageData(
  ctx: CanvasRenderingContext2D,
  sx: number,
  sy: number,
  size: number
): ImageData | null {
  if (
    !Number.isFinite(sx) ||
    !Number.isFinite(sy) ||
    !Number.isFinite(size) ||
    sx < 0 ||
    sy < 0 ||
    size <= 0
  ) {
    return null;
  }

  try {
    return ctx.getImageData(sx, sy, size, size);
  } catch {
    return null;
  }
}

/** Convert a canvas to a JPEG data URL for on-screen review. */
export function canvasToDataUrl(
  canvas: HTMLCanvasElement,
  quality: number = 0.9
): string {
  return canvas.toDataURL("image/jpeg", Math.min(1, Math.max(0, quality)));
}

/** Create a smaller JPEG preview suitable for sessionStorage. */
export function canvasToPreviewDataUrl(
  source: HTMLCanvasElement,
  maxDimension: number = 520,
  quality: number = 0.72
): string | null {
  const dimensions = getScaledDimensions(
    source.width,
    source.height,
    maxDimension
  );
  if (!dimensions) return null;

  const previewCanvas = document.createElement("canvas");
  previewCanvas.width = dimensions.width;
  previewCanvas.height = dimensions.height;

  const ctx = previewCanvas.getContext("2d");
  if (!ctx) return null;
  ctx.drawImage(source, 0, 0, dimensions.width, dimensions.height);

  return previewCanvas.toDataURL(
    "image/jpeg",
    Math.min(1, Math.max(0, quality))
  );
}
