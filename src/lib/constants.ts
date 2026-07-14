/** Application-wide constants and configurable thresholds. */

// --- Camera ---
export const CAMERA_CONSTRAINTS: MediaStreamConstraints = {
  video: {
    facingMode: { ideal: "environment" },
  },
  audio: false,
};

// --- Image Upload ---
/** Maximum upload size in bytes (default: 20 MB). */
export const MAX_UPLOAD_SIZE_BYTES = 20 * 1024 * 1024;

/** Maximum width or height used for in-browser analysis to limit memory use. */
export const MAX_ANALYSIS_DIMENSION = 1600;

/** Accepted MIME types for image upload. */
export const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

// --- Canvas Sampling ---
/** Fraction of the shorter image dimension used for the circular center sample. */
export const DEFAULT_SAMPLE_REGION_FRACTION = 0.24;

// --- pH Analysis ---
/** Hue values below this are treated as continuous with the high-hue acid range (legacy: 30). */
export const DEFAULT_RED_WRAP_THRESHOLD = 30;

/** Saturation below this value triggers the desaturation penalty (legacy: 0.08). */
export const DEFAULT_DESATURATION_THRESHOLD = 0.08;

/** Pull factor toward neutral pH when saturation is below threshold (legacy: 0.3). */
export const DEFAULT_DESATURATION_PULL = 0.3;

/** Neutral pH target for desaturation penalty and fallback (legacy: 7). */
export const NEUTRAL_PH = 7;

// --- Eligibility ---
export const ELIGIBILITY_MIN_PH = 5.5;
export const ELIGIBILITY_MAX_PH = 7.0;

// --- Result Transfer ---
export const STORAGE_KEY_RESULT = "bioplastic_ph_result";
export const STORAGE_KEY_PREVIEW = "bioplastic_ph_preview";

// --- Routes ---
export const ROUTES = {
  home: "/",
  scan: "/scan",
  result: "/result",
  phScale: "/ph-scale",
  about: "/about",
} as const;
