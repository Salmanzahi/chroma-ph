export type PhInterpretationTone = "acid" | "neutral" | "base";

export interface PhInterpretationBand {
  min: number;
  max: number;
  label: "Asam kuat" | "Asam lemah" | "Netral" | "Basa lemah" | "Basa kuat";
  rangeLabel: string;
  description: string;
  tone: PhInterpretationTone;
}

/**
 * Provisional display zones for the configured 14-point reference scale.
 * These labels simplify position on the pH scale; they do not identify a
 * compound, concentration, or degree of acid/base dissociation.
 *
 * Bands are continuous float ranges — no gaps between adjacent bands.
 * Fractional pH values are compared directly (not rounded), so e.g. 6.5
 * stays in "Asam lemah" rather than being rounded to 7 ("Netral").
 */
export const PH_INTERPRETATION_BANDS: readonly PhInterpretationBand[] = [
  {
    min: 1,
    max: 2.9,
    label: "Asam kuat",
    rangeLabel: "pH 1–3",
    description:
      "Hasil berada jauh di bawah titik netral dan masuk zona sangat asam pada skala tampilan.",
    tone: "acid",
  },
  {
    min: 3,
    max: 6.9,
    label: "Asam lemah",
    rangeLabel: "pH 3–7",
    description:
      "Hasil berada di bawah titik netral dan masuk zona asam pada skala tampilan.",
    tone: "acid",
  },
  {
    min: 7,
    max: 7,
    label: "Netral",
    rangeLabel: "pH 7",
    description:
      "Hasil berada di sekitar titik netral pH 7 pada skala tampilan.",
    tone: "neutral",
  },
  {
    min: 7.1,
    max: 11.9,
    label: "Basa lemah",
    rangeLabel: "pH 7–12",
    description:
      "Hasil berada di atas titik netral dan masuk zona basa pada skala tampilan.",
    tone: "base",
  },
  {
    min: 12,
    max: 14,
    label: "Basa kuat",
    rangeLabel: "pH 12–14",
    description:
      "Hasil berada jauh di atas titik netral dan masuk zona sangat basa pada skala tampilan.",
    tone: "base",
  },
] as const;

/**
 * Map a numeric pH to its interpretation band.
 * Uses the raw (fractional) pH value without rounding — preserves
 * the precision from the analysis pipeline.
 */
export function getPhInterpretation(ph: number): PhInterpretationBand | null {
  if (!Number.isFinite(ph)) return null;

  const clamped = Math.min(Math.max(ph, 1), 14);
  return (
    PH_INTERPRETATION_BANDS.find(
      (band) => clamped >= band.min && clamped <= band.max
    ) ?? null
  );
}
