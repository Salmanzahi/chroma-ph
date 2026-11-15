import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  doc,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { firestoreDb, FIRESTORE_COLLECTION_PH } from "@/src/lib/firebase";
import type { PhRecord, PhRecordInput } from "../types";

export function rgbToHex(r: number, g: number, b: number): string {
  const clamp = (val: number) => Math.max(0, Math.min(255, Math.round(val)));
  const toHex = (n: number) => clamp(n).toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const cleanHex = hex.replace(/^#/, "").trim();
  if (cleanHex.length === 3) {
    const r = parseInt(cleanHex[0] + cleanHex[0], 16);
    const g = parseInt(cleanHex[1] + cleanHex[1], 16);
    const b = parseInt(cleanHex[2] + cleanHex[2], 16);
    return isNaN(r) || isNaN(g) || isNaN(b) ? null : { r, g, b };
  }
  if (cleanHex.length === 6) {
    const r = parseInt(cleanHex.substring(0, 2), 16);
    const g = parseInt(cleanHex.substring(2, 4), 16);
    const b = parseInt(cleanHex.substring(4, 6), 16);
    return isNaN(r) || isNaN(g) || isNaN(b) ? null : { r, g, b };
  }
  return null;
}

export function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  const normH = ((h % 360) + 360) % 360;
  const sNorm = s > 1 ? Math.min(1, Math.max(0, s / 100)) : Math.min(1, Math.max(0, s));
  const lNorm = l > 1 ? Math.min(1, Math.max(0, l / 100)) : Math.min(1, Math.max(0, l));

  const c = (1 - Math.abs(2 * lNorm - 1)) * sNorm;
  const x = c * (1 - Math.abs(((normH / 60) % 2) - 1));
  const m = lNorm - c / 2;

  let rPrime = 0;
  let gPrime = 0;
  let bPrime = 0;

  if (0 <= normH && normH < 60) {
    rPrime = c; gPrime = x; bPrime = 0;
  } else if (60 <= normH && normH < 120) {
    rPrime = x; gPrime = c; bPrime = 0;
  } else if (120 <= normH && normH < 180) {
    rPrime = 0; gPrime = c; bPrime = x;
  } else if (180 <= normH && normH < 240) {
    rPrime = 0; gPrime = x; bPrime = c;
  } else if (240 <= normH && normH < 300) {
    rPrime = x; gPrime = 0; bPrime = c;
  } else {
    rPrime = c; gPrime = 0; bPrime = x;
  }

  return {
    r: Math.round((rPrime + m) * 255),
    g: Math.round((gPrime + m) * 255),
    b: Math.round((bPrime + m) * 255),
  };
}

const LOCAL_STORAGE_CACHE_KEY = "phdetector_history_cache";

function getLocalCache(): PhRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_CACHE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function setLocalCache(data: PhRecord[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LOCAL_STORAGE_CACHE_KEY, JSON.stringify(data));
  } catch {
    // Ignore storage quota errors
  }
}

export const SAMPLE_PRESETS: PhRecordInput[] = [
  {
    bahanUji: "Air Shampoo",
    ph: 6.2,
    kategoriKualitatif: "Asam lemah",
    rgb: { r: 171, g: 164, b: 198 },
    hsl: { h: 252, s: 23, l: 71 },
    warna: "#aba4c6",
    volumeSolven: 150,
    volumeSolut: null,
    satuanSolut: "mL",
    catatan: "Larutan shampoo rambut",
  },
  {
    bahanUji: "Air Lemon",
    ph: 3.2,
    kategoriKualitatif: "Asam lemah",
    rgb: { r: 216, g: 118, b: 180 },
    hsl: { h: 322, s: 56, l: 65 },
    warna: "#d876b4",
    volumeSolven: 150,
    volumeSolut: null,
    satuanSolut: "mL",
    catatan: "Perasan lemon murni dalam air suling",
  },
  {
    bahanUji: "Air Keran",
    ph: 7.4,
    kategoriKualitatif: "Basa lemah",
    rgb: { r: 135, g: 145, b: 167 },
    hsl: { h: 221, s: 15, l: 59 },
    warna: "#8791a7",
    volumeSolven: 150,
    volumeSolut: null,
    satuanSolut: "mL",
    catatan: "Air keran laboratorium",
  },
  {
    bahanUji: "Air Gula",
    ph: 7.5,
    kategoriKualitatif: "Basa lemah",
    rgb: { r: 75, g: 92, b: 120 },
    hsl: { h: 217, s: 23, l: 38 },
    warna: "#4b5c78",
    volumeSolven: 150,
    volumeSolut: null,
    satuanSolut: "gr",
    catatan: "Larutan gula pasir murni",
  },
  {
    bahanUji: "Pembersih Lantai (Vixal)",
    ph: 5.4,
    kategoriKualitatif: "Asam lemah",
    rgb: { r: 23, g: 3, b: 50 },
    hsl: { h: 266, s: 89, l: 10 },
    warna: "#170332",
    volumeSolven: null,
    volumeSolut: 150,
    satuanSolut: "mL",
    catatan: "Larutan pembersih lantai vixal",
  },
  {
    bahanUji: "Soda (Sprite)",
    ph: 3.6,
    kategoriKualitatif: "Asam lemah",
    rgb: { r: 171, g: 81, b: 60 },
    hsl: { h: 307, s: 36, l: 49 },
    warna: "#ab513c",
    volumeSolven: 150,
    volumeSolut: null,
    satuanSolut: "mL",
    catatan: "Minuman berkarbonasi soda",
  },
  {
    bahanUji: "Sunlight",
    ph: 3.4,
    kategoriKualitatif: "Asam lemah",
    rgb: { r: 82, g: 41, b: 71 },
    hsl: { h: 317, s: 32, l: 24 },
    warna: "#522947",
    volumeSolven: null,
    volumeSolut: 150,
    satuanSolut: "mL",
    catatan: "Larutan sabun pencuci piring Sunlight",
  },
  {
    bahanUji: "Soda Kue",
    ph: 8.1,
    kategoriKualitatif: "Basa lemah",
    rgb: { r: 54, g: 93, b: 105 },
    hsl: { h: 194, s: 32, l: 31 },
    warna: "#365d69",
    volumeSolven: 150,
    volumeSolut: null,
    satuanSolut: "gr",
    catatan: "Larutan natrium bikarbonat",
  },
];

/**
 * Menyimpan data pengukuran pH ke koleksi Firestore "phdetector".
 */
export async function savePhMeasurement(
  recordInput: PhRecordInput
): Promise<string> {
  const createdAtMs = recordInput.createdAt || Date.now();
  const hexColor =
    recordInput.warna ||
    rgbToHex(recordInput.rgb.r, recordInput.rgb.g, recordInput.rgb.b);

  const docPayload = {
    bahanUji: recordInput.bahanUji.trim(),
    ph: Number(recordInput.ph),
    rgb: {
      r: Math.round(recordInput.rgb.r),
      g: Math.round(recordInput.rgb.g),
      b: Math.round(recordInput.rgb.b),
    },
    hsl: {
      h: Math.round(recordInput.hsl.h),
      s: Math.round(recordInput.hsl.s),
      l: Math.round(recordInput.hsl.l),
    },
    warna: hexColor,
    kategoriKualitatif: recordInput.kategoriKualitatif.trim(),
    volumeSolven:
      recordInput.volumeSolven !== undefined && recordInput.volumeSolven !== null
        ? Number(recordInput.volumeSolven)
        : null,
    volumeSolut:
      recordInput.volumeSolut !== undefined && recordInput.volumeSolut !== null
        ? Number(recordInput.volumeSolut)
        : null,
    satuanSolut: recordInput.satuanSolut || "mL",
    catatan: recordInput.catatan?.trim() || "",
    createdAt: createdAtMs,
    serverTimestamp: serverTimestamp(),
  };

  try {
    const colRef = collection(firestoreDb, FIRESTORE_COLLECTION_PH);
    const docRef = await addDoc(colRef, docPayload);

    // Update local cache
    const current = getLocalCache();
    const newRecord: PhRecord = {
      ...docPayload,
      id: docRef.id,
      createdAt: createdAtMs,
    };
    setLocalCache([newRecord, ...current]);

    return docRef.id;
  } catch (error) {
    console.error("Gagal menyimpan ke Firestore, menyimpan ke cache lokal:", error);
    // Offline / fallback storage
    const localId = `local_${Date.now()}`;
    const newRecord: PhRecord = {
      ...docPayload,
      id: localId,
      createdAt: createdAtMs,
    };
    const current = getLocalCache();
    setLocalCache([newRecord, ...current]);
    return localId;
  }
}

/**
 * Mengambil semua riwayat pengukuran pH dari koleksi "phdetector" di Firestore.
 */
export async function getPhMeasurements(): Promise<PhRecord[]> {
  try {
    const colRef = collection(firestoreDb, FIRESTORE_COLLECTION_PH);
    // Attempt sorted query
    const q = query(colRef, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);

    const records: PhRecord[] = [];
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      records.push({
        id: docSnap.id,
        bahanUji: data.bahanUji || "Sampel Tanpa Nama",
        ph: typeof data.ph === "number" ? data.ph : parseFloat(data.ph) || 7,
        rgb: data.rgb || { r: 128, g: 128, b: 128 },
        hsl: data.hsl || { h: 0, s: 0, l: 50 },
        warna: data.warna || rgbToHex(data.rgb?.r ?? 0, data.rgb?.g ?? 0, data.rgb?.b ?? 0),
        kategoriKualitatif: data.kategoriKualitatif || "Netral",
        volumeSolven: data.volumeSolven ?? null,
        volumeSolut: data.volumeSolut ?? null,
        satuanSolut: data.satuanSolut || "mL",
        catatan: data.catatan || "",
        createdAt:
          typeof data.createdAt === "number"
            ? data.createdAt
            : data.createdAt?.toMillis?.() || Date.now(),
      });
    });

    if (records.length > 0) {
      setLocalCache(records);
      return records;
    }

    // Fallback to cache if firestore empty or returned 0
    return getLocalCache();
  } catch (error) {
    console.error("Gagal mengambil data dari Firestore, memuat dari cache lokal:", error);
    return getLocalCache();
  }
}

/**
 * Memperbarui data komponen pengukuran pH di Firestore dan cache lokal.
 */
export async function updatePhMeasurement(
  id: string,
  updates: Partial<PhRecordInput>
): Promise<void> {
  // Update local cache
  const current = getLocalCache();
  const index = current.findIndex((item) => item.id === id);
  if (index !== -1) {
    const existing = current[index];
    const updatedRecord: PhRecord = {
      ...existing,
      ...updates,
      rgb: updates.rgb ? { ...existing.rgb, ...updates.rgb } : existing.rgb,
      hsl: updates.hsl ? { ...existing.hsl, ...updates.hsl } : existing.hsl,
    };
    current[index] = updatedRecord;
    setLocalCache([...current]);
  }

  if (id.startsWith("local_")) return;

  try {
    const docRef = doc(firestoreDb, FIRESTORE_COLLECTION_PH, id);
    const firestoreUpdates: Record<string, unknown> = {};

    if (updates.bahanUji !== undefined) {
      firestoreUpdates.bahanUji = updates.bahanUji.trim();
    }
    if (updates.ph !== undefined) {
      firestoreUpdates.ph = Number(updates.ph);
    }
    if (updates.kategoriKualitatif !== undefined) {
      firestoreUpdates.kategoriKualitatif = updates.kategoriKualitatif.trim();
    }
    if (updates.warna !== undefined) {
      firestoreUpdates.warna = updates.warna;
    }
    if (updates.rgb !== undefined) {
      firestoreUpdates.rgb = {
        r: Math.round(updates.rgb.r),
        g: Math.round(updates.rgb.g),
        b: Math.round(updates.rgb.b),
      };
    }
    if (updates.hsl !== undefined) {
      firestoreUpdates.hsl = {
        h: Math.round(updates.hsl.h),
        s: Math.round(updates.hsl.s),
        l: Math.round(updates.hsl.l),
      };
    }
    if (updates.volumeSolven !== undefined) {
      firestoreUpdates.volumeSolven =
        updates.volumeSolven !== null ? Number(updates.volumeSolven) : null;
    }
    if (updates.volumeSolut !== undefined) {
      firestoreUpdates.volumeSolut =
        updates.volumeSolut !== null ? Number(updates.volumeSolut) : null;
    }
    if (updates.satuanSolut !== undefined) {
      firestoreUpdates.satuanSolut = updates.satuanSolut;
    }
    if (updates.catatan !== undefined) {
      firestoreUpdates.catatan = updates.catatan.trim();
    }
    firestoreUpdates.updatedAt = serverTimestamp();

    await updateDoc(docRef, firestoreUpdates);
  } catch (error) {
    console.error("Gagal memperbarui dokumen di Firestore:", error);
  }
}

/**
 * Menghapus data pengukuran dari Firestore "phdetector".
 */
export async function deletePhMeasurement(id: string): Promise<void> {
  // Update local cache
  const current = getLocalCache();
  const updated = current.filter((item) => item.id !== id);
  setLocalCache(updated);

  if (id.startsWith("local_")) return;

  try {
    const docRef = doc(firestoreDb, FIRESTORE_COLLECTION_PH, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Gagal menghapus dokumen dari Firestore:", error);
  }
}

/**
 * Memasukkan atau memperbarui data sampel acuan (dari note.txt) ke Firestore.
 * Jika sampel dengan nama bahan uji yang sama sudah ada, data akan diperbarui.
 * Jika belum ada, data baru akan ditambahkan.
 */
export async function seedSampleData(): Promise<number> {
  const existingRecords = await getPhMeasurements();
  let count = 0;
  for (const preset of SAMPLE_PRESETS) {
    const existing = existingRecords.find(
      (r) =>
        r.bahanUji.trim().toLowerCase() === preset.bahanUji.trim().toLowerCase()
    );
    if (existing && existing.id) {
      await updatePhMeasurement(existing.id, preset);
    } else {
      await savePhMeasurement(preset);
    }
    count++;
  }
  return count;
}
