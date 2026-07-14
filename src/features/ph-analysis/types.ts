/** Type definitions for the pH color-analysis pipeline. */

export interface RgbColor {
  r: number;
  g: number;
  b: number;
}

export interface HslColor {
  h: number;
  s: number;
  l: number;
}

export interface PhReference {
  ph: number;
  hue: number;
  label: string;
  hexColor?: string;
  category: "acid" | "neutral" | "base";
  isTemporary: true;
}

export interface PhAnalysisResult {
  estimatedPh: number;
  category: "acid" | "neutral" | "base";
  eligibilityStatus: "eligible" | "outside-range" | "unknown";
  sampledRgb: RgbColor;
  sampledHsl: HslColor;
  calibrationIsTemporary: true;
}

export interface AnalysisOptions {
  /** Fraction of the shorter image dimension for center sampling. Default 0.24. */
  sampleRegionFraction?: number;
  /** Hue threshold below which reds are treated as continuous with high-hue range. Default 30. */
  redWrapThreshold?: number;
  /** Saturation below which the desaturation penalty is applied. Default 0.08. */
  desaturationThreshold?: number;
  /** Pull factor toward neutral pH when desaturation penalty triggers. Default 0.3. */
  desaturationPull?: number;
}

export interface SamplingRegion {
  sx: number;
  sy: number;
  size: number;
}
