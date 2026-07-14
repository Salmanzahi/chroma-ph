/** Validated sessionStorage helpers for transferring scan results. */

import type { PhAnalysisResult } from "@/src/features/ph-analysis/types";
import { STORAGE_KEY_RESULT, STORAGE_KEY_PREVIEW } from "@/src/lib/constants";

export function storeResult(result: PhAnalysisResult): boolean {
  if (typeof window === "undefined" || !isValidPhAnalysisResult(result)) {
    return false;
  }

  try {
    sessionStorage.setItem(STORAGE_KEY_RESULT, JSON.stringify(result));
    return true;
  } catch {
    return false;
  }
}

export function storePreview(dataUrl: string): boolean {
  if (
    typeof window === "undefined" ||
    !dataUrl.startsWith("data:image/") ||
    dataUrl.length > 300_000
  ) {
    return false;
  }

  try {
    sessionStorage.setItem(STORAGE_KEY_PREVIEW, dataUrl);
    return true;
  } catch {
    return false;
  }
}

export function getStoredResult(): PhAnalysisResult | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = sessionStorage.getItem(STORAGE_KEY_RESULT);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as unknown;
    if (isValidPhAnalysisResult(parsed)) return parsed;

    sessionStorage.removeItem(STORAGE_KEY_RESULT);
    return null;
  } catch {
    return null;
  }
}

export function getStoredPreview(): string | null {
  if (typeof window === "undefined") return null;

  try {
    const value = sessionStorage.getItem(STORAGE_KEY_PREVIEW);
    if (!value || !value.startsWith("data:image/") || value.length > 300_000) {
      if (value) sessionStorage.removeItem(STORAGE_KEY_PREVIEW);
      return null;
    }
    return value;
  } catch {
    return null;
  }
}

export function clearStoredResult(): void {
  if (typeof window === "undefined") return;

  try {
    sessionStorage.removeItem(STORAGE_KEY_RESULT);
    sessionStorage.removeItem(STORAGE_KEY_PREVIEW);
  } catch {
    // Storage can be unavailable in restricted/private browser modes.
  }
}

export function isValidPhAnalysisResult(
  value: unknown
): value is PhAnalysisResult {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;

  return (
    isFiniteNumberInRange(v.estimatedPh, 1, 14) &&
    isOneOf(v.category, ["acid", "neutral", "base"] as const) &&
    isOneOf(
      v.eligibilityStatus,
      ["eligible", "outside-range", "unknown"] as const
    ) &&
    isValidRgb(v.sampledRgb) &&
    isValidHsl(v.sampledHsl) &&
    v.calibrationIsTemporary === true
  );
}

function isOneOf<T extends string>(
  value: unknown,
  allowed: readonly T[]
): value is T {
  return typeof value === "string" && allowed.includes(value as T);
}

function isFiniteNumberInRange(
  value: unknown,
  min: number,
  max: number
): value is number {
  return (
    typeof value === "number" &&
    Number.isFinite(value) &&
    value >= min &&
    value <= max
  );
}

function isValidRgb(value: unknown): boolean {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return (
    isFiniteNumberInRange(v.r, 0, 255) &&
    isFiniteNumberInRange(v.g, 0, 255) &&
    isFiniteNumberInRange(v.b, 0, 255)
  );
}

function isValidHsl(value: unknown): boolean {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return (
    isFiniteNumberInRange(v.h, 0, 360) &&
    isFiniteNumberInRange(v.s, 0, 1) &&
    isFiniteNumberInRange(v.l, 0, 1)
  );
}
