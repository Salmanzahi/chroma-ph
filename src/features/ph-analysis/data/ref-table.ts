/**
 * TEMPORARY pH reference calibration table.
 *
 * Provenance: adapted from the legacy prototype and aligned with the typical
 * anthocyanin colour progression of Clitoria ternatea (butterfly pea flower)
 * extract as documented in the ARGON UNAIR research PDF:
 *   "SINTESIS BIOPLATIK DENGAN BAHAN PATI DARI JAGUNG DAN NANOSELULOSA
 *    DARI TANAMAN ALGA DENGAN TAMBAHAN GLISEROL DAN SORBITOL SEBAGAI
 *    PLASTICAZER"
 *
 * Hue values follow the established anthocyanin pH-colour sequence:
 *   pH 1-2 : deep red → pink-red    (hue ~360°–345°)
 *   pH 3-4 : magenta → violet       (hue ~335°–285°)
 *   pH 5-6 : purple → blue-purple   (hue ~275°–255°)
 *   pH 7   : blue                   (hue ~240°)
 *   pH 8   : blue-green / teal      (hue ~200°)
 *   pH 9   : teal → green           (hue ~175°)
 *   pH 10  : green                  (hue ~150°)
 *   pH 11  : yellow-green           (hue ~100°)
 *   pH 12  : olive                  (hue ~80°)
 *   pH 13  : golden                 (hue ~55°)
 *   pH 14  : yellow                 (hue ~45°)
 *
 * IMPORTANT: THIS DATA IS TEMPORARY AND HAS NOT BEEN SCIENTIFICALLY VALIDATED.
 * It must be replaced with the client's final calibrated 14-colour
 * reference dataset before production use. The hex values below were aligned
 * to the Clitoria ternatea anthocyanin literature; this does not constitute
 * scientific calibration or validation.
 */

import type { PhReference } from "@/src/features/ph-analysis/types";

export const TEMPORARY_REF_TABLE: readonly PhReference[] = [
  { ph: 1,  hue: 360, label: "Merah tua (pH 1)",    hexColor: "#d41020", category: "acid",    isTemporary: true },
  { ph: 2,  hue: 348, label: "Merah (pH 2)",         hexColor: "#e83048", category: "acid",    isTemporary: true },
  { ph: 3,  hue: 332, label: "Magenta (pH 3)",       hexColor: "#c83088", category: "acid",    isTemporary: true },
  { ph: 4,  hue: 290, label: "Ungu (pH 4)",          hexColor: "#8028c8", category: "acid",    isTemporary: true },
  { ph: 5,  hue: 272, label: "Ungu biru (pH 5)",     hexColor: "#5028e0", category: "acid",    isTemporary: true },
  { ph: 6,  hue: 256, label: "Biru ungu (pH 6)",     hexColor: "#2838f0", category: "acid",    isTemporary: true },
  { ph: 7,  hue: 238, label: "Biru (pH 7)",          hexColor: "#1058d0", category: "neutral", isTemporary: true },
  { ph: 8,  hue: 198, label: "Biru hijau (pH 8)",    hexColor: "#0890a8", category: "base",    isTemporary: true },
  { ph: 9,  hue: 172, label: "Toska (pH 9)",         hexColor: "#00a080", category: "base",    isTemporary: true },
  { ph: 10, hue: 148, label: "Hijau (pH 10)",        hexColor: "#10a030", category: "base",    isTemporary: true },
  { ph: 11, hue: 102, label: "Hijau kuning (pH 11)", hexColor: "#70a008", category: "base",    isTemporary: true },
  { ph: 12, hue: 78,  label: "Zaitun (pH 12)",       hexColor: "#908800", category: "base",    isTemporary: true },
  { ph: 13, hue: 56,  label: "Kuning emas (pH 13)",  hexColor: "#c89800", category: "base",    isTemporary: true },
  { ph: 14, hue: 46,  label: "Kuning (pH 14)",       hexColor: "#e8c000", category: "base",    isTemporary: true },
] as const;

/**
 * Returns a human-readable pH category based on the pH value.
 */
export function getPhCategory(ph: number): "acid" | "neutral" | "base" {
  if (ph < 7) return "acid";
  if (ph === 7) return "neutral";
  return "base";
}
