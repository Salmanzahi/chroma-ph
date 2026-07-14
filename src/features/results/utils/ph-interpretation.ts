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
 */
export const PH_INTERPRETATION_BANDS: readonly PhInterpretationBand[] = [
  {
    min: 1,
    max: 2,
    label: "Asam kuat",
    rangeLabel: "pH 1-2",
    description: "Hasil berada jauh di bawah titik netral dan masuk zona sangat asam pada skala tampilan.",
    tone: "acid",
  },
  {
    min: 3,
    max: 6,
    label: "Asam lemah",
    rangeLabel: "pH 3-6",
    description: "Hasil berada di bawah titik netral dan masuk zona asam pada skala tampilan.",
    tone: "acid",
  },
  {
    min: 7,
    max: 7,
    label: "Netral",
    rangeLabel: "pH 7",
    description: "Hasil berada di sekitar titik netral pH 7 pada skala tampilan.",
    tone: "neutral",
  },
  {
    min: 8,
    max: 11,
    label: "Basa lemah",
    rangeLabel: "pH 8-11",
    description: "Hasil berada di atas titik netral dan masuk zona basa pada skala tampilan.",
    tone: "base",
  },
  {
    min: 12,
    max: 14,
    label: "Basa kuat",
    rangeLabel: "pH 12-14",
    description: "Hasil berada jauh di atas titik netral dan masuk zona sangat basa pada skala tampilan.",
    tone: "base",
  },
] as const;

export function getPhInterpretation(ph: number): PhInterpretationBand | null {
  if (!Number.isFinite(ph)) return null;

  const referencePh = Math.round(Math.min(Math.max(ph, 1), 14));
  return (
    PH_INTERPRETATION_BANDS.find(
      (band) => referencePh >= band.min && referencePh <= band.max
    ) ?? null
  );
}
