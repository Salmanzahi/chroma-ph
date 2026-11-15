export interface PhRecordRgb {
  r: number;
  g: number;
  b: number;
}

export interface PhRecordHsl {
  h: number; // 0 - 360
  s: number; // 0 - 100 percentage or 0-1
  l: number; // 0 - 100 percentage or 0-1
}

export interface PhRecord {
  id?: string;
  bahanUji: string;
  ph: number;
  rgb: PhRecordRgb;
  hsl: PhRecordHsl;
  warna: string; // hex color e.g. #d876b4
  kategoriKualitatif: string; // e.g. "Asam lemah", "Basa lemah", "Netral", dll.
  volumeSolven?: number | null; // dalam mL, opsional
  volumeSolut?: number | null; // opsional
  satuanSolut?: "gr" | "mL"; // satuan bahan terlarut
  catatan?: string;
  createdAt: number; // epoch ms
}

export type PhRecordInput = Omit<PhRecord, "id" | "createdAt"> & {
  createdAt?: number;
};
