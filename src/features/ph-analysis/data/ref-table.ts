/**
 * TEMPORARY pH reference calibration table.
 *
 * Provenance: preserved from the received legacy prototype. The received
 * project archive did not include a verifiable primary calibration source, so
 * the client/research team must confirm the origin and values before use.
 *
 * IMPORTANT: THIS DATA IS TEMPORARY AND HAS NOT BEEN SCIENTIFICALLY VALIDATED.
 * It must be replaced with the client's final calibrated 14-color
 * reference dataset before production use. The display hex values below were
 * visually aligned to the user-supplied reference image on 2026-07-14; this
 * does not constitute scientific calibration or validation.
 */

import type { PhReference } from "@/src/features/ph-analysis/types";

export const TEMPORARY_REF_TABLE: readonly PhReference[] = [
  { ph: 1,  hue: 362, label: "Merah (pH 1)",  hexColor: "#ff241f", category: "acid",    isTemporary: true },
  { ph: 2,  hue: 358, label: "Merah (pH 2)",  hexColor: "#ee4043", category: "acid",    isTemporary: true },
  { ph: 3,  hue: 279, label: "Ungu (pH 3)",   hexColor: "#8b12ca", category: "acid",    isTemporary: true },
  { ph: 4,  hue: 264, label: "Ungu (pH 4)",   hexColor: "#6810f4", category: "acid",    isTemporary: true },
  { ph: 5,  hue: 239, label: "Biru (pH 5)",   hexColor: "#171bcf", category: "acid",    isTemporary: true },
  { ph: 6,  hue: 237, label: "Biru (pH 6)",   hexColor: "#1d2cff", category: "acid",    isTemporary: true },
  { ph: 7,  hue: 196, label: "Sian (pH 7)",   hexColor: "#079dce", category: "neutral", isTemporary: true },
  { ph: 8,  hue: 183, label: "Toska (pH 8)",  hexColor: "#08b0b8", category: "base",    isTemporary: true },
  { ph: 9,  hue: 182, label: "Toska (pH 9)",  hexColor: "#02999f", category: "base",    isTemporary: true },
  { ph: 10, hue: 181, label: "Toska (pH 10)", hexColor: "#00818a", category: "base",    isTemporary: true },
  { ph: 11, hue: 180, label: "Toska (pH 11)", hexColor: "#00615f", category: "base",    isTemporary: true },
  { ph: 12, hue: 119, label: "Hijau (pH 12)", hexColor: "#005003", category: "base",    isTemporary: true },
  { ph: 13, hue: 50,  label: "Zaitun (pH 13)",hexColor: "#927400", category: "base",    isTemporary: true },
  { ph: 14, hue: 40,  label: "Kuning (pH 14)",hexColor: "#f9cb00", category: "base",    isTemporary: true },
] as const;

/**
 * Returns a human-readable pH category based on the pH value.
 */
export function getPhCategory(ph: number): "acid" | "neutral" | "base" {
  if (ph < 7) return "acid";
  if (ph === 7) return "neutral";
  return "base";
}
