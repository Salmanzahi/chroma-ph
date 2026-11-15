"use client";

import { useState, useEffect } from "react";
import type { PhRecord } from "../types";
import { rgbToHex, hexToRgb, hslToRgb } from "../services/history-service";
import { rgbToHsl } from "@/src/features/ph-analysis/utils/rgb-to-hsl";
import { getPhInterpretation } from "@/src/features/results/utils/ph-interpretation";
import { SaveIcon, CloseIcon, RefreshIcon } from "@/src/components/icons";

interface EditMeasurementModalProps {
  isOpen: boolean;
  record: PhRecord | null;
  onClose: () => void;
  onSave: (updatedRecord: Partial<PhRecord>) => Promise<void>;
}

export function EditMeasurementModal({
  isOpen,
  record,
  onClose,
  onSave,
}: EditMeasurementModalProps) {
  const [bahanUji, setBahanUji] = useState("");
  const [ph, setPh] = useState<number>(7);
  const [kategoriKualitatif, setKategoriKualitatif] = useState("");
  const [warna, setWarna] = useState("#8791a7");
  const [rgb, setRgb] = useState({ r: 135, g: 145, b: 167 });
  const [hsl, setHsl] = useState({ h: 221, s: 15, l: 59 });
  const [volumeSolven, setVolumeSolven] = useState<string>("");
  const [volumeSolut, setVolumeSolut] = useState<string>("");
  const [satuanSolut, setSatuanSolut] = useState<"gr" | "mL">("mL");
  const [catatan, setCatatan] = useState("");

  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Sync state whenever record prop changes
  useEffect(() => {
    if (record) {
      setBahanUji(record.bahanUji || "");
      setPh(record.ph ?? 7);
      setKategoriKualitatif(record.kategoriKualitatif || "Netral");
      setWarna(record.warna || rgbToHex(record.rgb?.r ?? 128, record.rgb?.g ?? 128, record.rgb?.b ?? 128));
      setRgb(record.rgb || { r: 128, g: 128, b: 128 });
      setHsl(record.hsl || { h: 0, s: 0, l: 50 });
      setVolumeSolven(
        record.volumeSolven !== null && record.volumeSolven !== undefined
          ? String(record.volumeSolven)
          : ""
      );
      setVolumeSolut(
        record.volumeSolut !== null && record.volumeSolut !== undefined
          ? String(record.volumeSolut)
          : ""
      );
      setSatuanSolut(record.satuanSolut || "mL");
      setCatatan(record.catatan || "");
      setErrorMsg(null);
    }
  }, [record]);

  if (!isOpen || !record) return null;

  // Handle Hex / Color Picker change -> sync RGB and HSL
  const handleHexChange = (newHex: string) => {
    setWarna(newHex);
    const parsedRgb = hexToRgb(newHex);
    if (parsedRgb) {
      setRgb(parsedRgb);
      const computedHsl = rgbToHsl(parsedRgb.r, parsedRgb.g, parsedRgb.b);
      setHsl({
        h: Math.round(computedHsl.h),
        s: Math.round(computedHsl.s * 100),
        l: Math.round(computedHsl.l * 100),
      });
    }
  };

  // Handle RGB individual changes -> sync Hex and HSL
  const handleRgbComponentChange = (channel: "r" | "g" | "b", val: number) => {
    const clampedVal = Math.max(0, Math.min(255, isNaN(val) ? 0 : Math.round(val)));
    const updatedRgb = { ...rgb, [channel]: clampedVal };
    setRgb(updatedRgb);
    const newHex = rgbToHex(updatedRgb.r, updatedRgb.g, updatedRgb.b);
    setWarna(newHex);
    const computedHsl = rgbToHsl(updatedRgb.r, updatedRgb.g, updatedRgb.b);
    setHsl({
      h: Math.round(computedHsl.h),
      s: Math.round(computedHsl.s * 100),
      l: Math.round(computedHsl.l * 100),
    });
  };

  // Handle HSL individual changes -> sync RGB and Hex
  const handleHslComponentChange = (channel: "h" | "s" | "l", val: number) => {
    let clampedVal = isNaN(val) ? 0 : Math.round(val);
    if (channel === "h") {
      clampedVal = Math.max(0, Math.min(360, clampedVal));
    } else {
      clampedVal = Math.max(0, Math.min(100, clampedVal));
    }
    const updatedHsl = { ...hsl, [channel]: clampedVal };
    setHsl(updatedHsl);
    const updatedRgb = hslToRgb(updatedHsl.h, updatedHsl.s, updatedHsl.l);
    setRgb(updatedRgb);
    setWarna(rgbToHex(updatedRgb.r, updatedRgb.g, updatedRgb.b));
  };

  // Sync category automatically from pH
  const handleSyncCategoryFromPh = (targetPh: number) => {
    const interp = getPhInterpretation(targetPh);
    if (interp?.label) {
      setKategoriKualitatif(interp.label);
    } else if (targetPh < 7) {
      setKategoriKualitatif("Asam lemah");
    } else if (targetPh > 7) {
      setKategoriKualitatif("Basa lemah");
    } else {
      setKategoriKualitatif("Netral");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!bahanUji.trim()) {
      setErrorMsg("Nama bahan uji tidak boleh kosong.");
      return;
    }

    if (isNaN(ph) || ph < 0 || ph > 14) {
      setErrorMsg("Kadar pH harus berada pada rentang skala 0 – 14.");
      return;
    }

    setIsSaving(true);
    setErrorMsg(null);

    try {
      const updatedPayload: Partial<PhRecord> = {
        bahanUji: bahanUji.trim(),
        ph: Number(ph.toFixed(1)),
        kategoriKualitatif: kategoriKualitatif.trim(),
        warna: warna.toLowerCase(),
        rgb: {
          r: Math.round(rgb.r),
          g: Math.round(rgb.g),
          b: Math.round(rgb.b),
        },
        hsl: {
          h: Math.round(hsl.h),
          s: Math.round(hsl.s),
          l: Math.round(hsl.l),
        },
        volumeSolven: volumeSolven !== "" ? parseFloat(volumeSolven) : null,
        volumeSolut: volumeSolut !== "" ? parseFloat(volumeSolut) : null,
        satuanSolut,
        catatan: catatan.trim(),
      };

      await onSave(updatedPayload);
      onClose();
    } catch (err: unknown) {
      console.error(err);
      setErrorMsg("Gagal menyimpan perubahan ke Firestore. Coba periksa koneksi.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
    >
      <div
        className="w-full max-w-2xl max-h-[92vh] overflow-y-auto bg-[var(--color-surface-white)] border border-[var(--ink)] p-6 sm:p-8 relative"
        style={{ boxShadow: "12px 12px 0 var(--color-surface-strong)" }}
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[var(--color-text-muted)] hover:text-[var(--ink)] transition-colors"
          aria-label="Tutup form edit"
        >
          <CloseIcon size={20} />
        </button>

        {/* Header */}
        <div className="mb-6 border-b border-[var(--color-surface-border)] pb-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="editorial-kicker text-xs font-semibold uppercase tracking-wider text-[var(--aubergine)]">
              Edit Komponen Bahan Uji
            </span>
            <span className="text-[11px] font-mono text-[var(--color-text-muted)]">
              ID: {record.id || "Lokal"}
            </span>
          </div>
          <h2 id="edit-modal-title" className="text-xl sm:text-2xl font-serif text-[var(--ink)] font-normal">
            Sunting Parameter &amp; Komponen Sampel
          </h2>
          <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] mt-1">
            Ubah nama bahan uji, kadar pH, kategori kualitatif, komponen warna (Hex, RGB, HSL), formulasi pelarut/terlarut, serta catatan pengujian.
          </p>
        </div>

        {errorMsg && (
          <div className="mb-5 p-3 bg-[var(--color-semantic-red-bg)] text-[var(--color-semantic-red)] text-sm border border-[var(--color-semantic-red)]/30">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ── Section 1: Identifikasi Bahan Uji & Karakteristik pH ── */}
          <div className="space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-wider text-[var(--color-text-muted)] border-b border-[var(--color-surface-border)] pb-1">
              1. Identifikasi Bahan Uji &amp; pH
            </h3>

            <div>
              <label htmlFor="edit-bahan-uji" className="block text-xs font-bold uppercase tracking-wider text-[var(--ink)] mb-1">
                Nama Bahan Uji <span className="text-[var(--color-semantic-red)]">*</span>
              </label>
              <input
                id="edit-bahan-uji"
                type="text"
                required
                value={bahanUji}
                onChange={(e) => setBahanUji(e.target.value)}
                placeholder="Contoh: Air Shampoo, Air Lemon, Soda Kue"
                className="w-full px-3 py-2 border border-[var(--color-surface-border)] bg-[var(--color-surface-white)] text-sm text-[var(--ink)] focus:outline-none focus:border-[var(--aubergine)]"
              />
              <span className="text-[11px] text-[var(--color-text-muted)] mt-1 block">
                Nama bahan uji digunakan pada sumbu grafik diskrit dan tabel riwayat.
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Kadar pH */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor="edit-ph" className="text-xs font-bold uppercase tracking-wider text-[var(--ink)]">
                    Kadar pH (0 – 14) <span className="text-[var(--color-semantic-red)]">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => handleSyncCategoryFromPh(ph)}
                    className="text-[11px] text-[var(--aubergine)] hover:underline inline-flex items-center gap-1 font-mono"
                    title="Otomatis sesuaikan kategori berdasarkan nilai pH saat ini"
                  >
                    <RefreshIcon size={12} /> Auto Kategori
                  </button>
                </div>
                <input
                  id="edit-ph"
                  type="number"
                  step="0.1"
                  min="0"
                  max="14"
                  required
                  value={isNaN(ph) ? "" : ph}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    setPh(val);
                  }}
                  className="w-full px-3 py-2 border border-[var(--color-surface-border)] bg-[var(--color-surface-white)] text-sm text-[var(--ink)] font-mono focus:outline-none focus:border-[var(--aubergine)]"
                />
              </div>

              {/* Kategori Kualitatif */}
              <div>
                <label htmlFor="edit-kategori" className="block text-xs font-bold uppercase tracking-wider text-[var(--ink)] mb-1">
                  Kategori Kualitatif
                </label>
                <select
                  id="edit-kategori"
                  value={kategoriKualitatif}
                  onChange={(e) => setKategoriKualitatif(e.target.value)}
                  className="w-full px-3 py-2 border border-[var(--color-surface-border)] bg-[var(--color-surface-white)] text-sm text-[var(--ink)] focus:outline-none focus:border-[var(--aubergine)]"
                >
                  <option value="Asam kuat">Asam kuat (pH 1 – 3)</option>
                  <option value="Asam lemah">Asam lemah (pH 3 – 7)</option>
                  <option value="Netral">Netral (pH 7)</option>
                  <option value="Basa lemah">Basa lemah (pH 7 – 12)</option>
                  <option value="Basa kuat">Basa kuat (pH 12 – 14)</option>
                </select>
              </div>
            </div>
          </div>

          {/* ── Section 2: Komponen Spektrum Warna (Hex, RGB, HSL) ── */}
          <div className="space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-wider text-[var(--color-text-muted)] border-b border-[var(--color-surface-border)] pb-1">
              2. Komponen Warna Spektrum (Hex, RGB &amp; HSL)
            </h3>

            {/* Color Swatch & Hex Picker */}
            <div className="p-3.5 bg-[var(--color-surface-off-white)] border border-[var(--color-surface-border)] flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <input
                    type="color"
                    id="edit-color-picker"
                    value={warna.startsWith("#") ? warna : "#8791a7"}
                    onChange={(e) => handleHexChange(e.target.value)}
                    className="w-10 h-10 cursor-pointer border border-black/30 p-0 rounded-none bg-transparent"
                    title="Pilih warna secara visual"
                    aria-label="Pilih warna secara visual"
                  />
                </div>
                <div>
                  <label htmlFor="edit-hex" className="text-[10px] uppercase font-mono text-[var(--color-text-muted)] block">
                    Kode Warna Hex
                  </label>
                  <input
                    id="edit-hex"
                    type="text"
                    value={warna}
                    onChange={(e) => handleHexChange(e.target.value)}
                    placeholder="#d876b4"
                    className="w-28 px-2 py-1 font-mono text-xs border border-[var(--color-surface-border)] bg-[var(--color-surface-white)] uppercase text-[var(--ink)]"
                  />
                </div>
              </div>

              <div className="text-right text-xs font-mono">
                <span className="text-[var(--color-text-muted)] block text-[10px] uppercase">
                  Warna Terpilih
                </span>
                <span className="font-bold text-sm text-[var(--ink)]" style={{ color: warna }}>
                  ● {warna.toUpperCase()}
                </span>
              </div>
            </div>

            {/* RGB Inputs */}
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--ink)] block mb-1.5">
                Nilai RGB (0 – 255)
              </span>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label htmlFor="edit-rgb-r" className="text-[10px] font-mono text-[var(--color-text-muted)] block">
                    Red (R)
                  </label>
                  <input
                    id="edit-rgb-r"
                    type="number"
                    min="0"
                    max="255"
                    value={rgb.r}
                    onChange={(e) => handleRgbComponentChange("r", parseInt(e.target.value, 10))}
                    className="w-full px-2.5 py-1.5 font-mono text-xs border border-[var(--color-surface-border)] bg-[var(--color-surface-white)] text-[var(--ink)] focus:outline-none focus:border-[var(--aubergine)]"
                  />
                </div>
                <div>
                  <label htmlFor="edit-rgb-g" className="text-[10px] font-mono text-[var(--color-text-muted)] block">
                    Green (G)
                  </label>
                  <input
                    id="edit-rgb-g"
                    type="number"
                    min="0"
                    max="255"
                    value={rgb.g}
                    onChange={(e) => handleRgbComponentChange("g", parseInt(e.target.value, 10))}
                    className="w-full px-2.5 py-1.5 font-mono text-xs border border-[var(--color-surface-border)] bg-[var(--color-surface-white)] text-[var(--ink)] focus:outline-none focus:border-[var(--aubergine)]"
                  />
                </div>
                <div>
                  <label htmlFor="edit-rgb-b" className="text-[10px] font-mono text-[var(--color-text-muted)] block">
                    Blue (B)
                  </label>
                  <input
                    id="edit-rgb-b"
                    type="number"
                    min="0"
                    max="255"
                    value={rgb.b}
                    onChange={(e) => handleRgbComponentChange("b", parseInt(e.target.value, 10))}
                    className="w-full px-2.5 py-1.5 font-mono text-xs border border-[var(--color-surface-border)] bg-[var(--color-surface-white)] text-[var(--ink)] focus:outline-none focus:border-[var(--aubergine)]"
                  />
                </div>
              </div>
            </div>

            {/* HSL Inputs */}
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--ink)] block mb-1.5">
                Nilai HSL (Hue, Saturation, Lightness)
              </span>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label htmlFor="edit-hsl-h" className="text-[10px] font-mono text-[var(--color-text-muted)] block">
                    Hue (0 – 360°)
                  </label>
                  <input
                    id="edit-hsl-h"
                    type="number"
                    min="0"
                    max="360"
                    value={hsl.h}
                    onChange={(e) => handleHslComponentChange("h", parseInt(e.target.value, 10))}
                    className="w-full px-2.5 py-1.5 font-mono text-xs border border-[var(--color-surface-border)] bg-[var(--color-surface-white)] text-[var(--ink)] focus:outline-none focus:border-[var(--aubergine)]"
                  />
                </div>
                <div>
                  <label htmlFor="edit-hsl-s" className="text-[10px] font-mono text-[var(--color-text-muted)] block">
                    Saturation (0 – 100%)
                  </label>
                  <input
                    id="edit-hsl-s"
                    type="number"
                    min="0"
                    max="100"
                    value={hsl.s}
                    onChange={(e) => handleHslComponentChange("s", parseInt(e.target.value, 10))}
                    className="w-full px-2.5 py-1.5 font-mono text-xs border border-[var(--color-surface-border)] bg-[var(--color-surface-white)] text-[var(--ink)] focus:outline-none focus:border-[var(--aubergine)]"
                  />
                </div>
                <div>
                  <label htmlFor="edit-hsl-l" className="text-[10px] font-mono text-[var(--color-text-muted)] block">
                    Lightness (0 – 100%)
                  </label>
                  <input
                    id="edit-hsl-l"
                    type="number"
                    min="0"
                    max="100"
                    value={hsl.l}
                    onChange={(e) => handleHslComponentChange("l", parseInt(e.target.value, 10))}
                    className="w-full px-2.5 py-1.5 font-mono text-xs border border-[var(--color-surface-border)] bg-[var(--color-surface-white)] text-[var(--ink)] focus:outline-none focus:border-[var(--aubergine)]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ── Section 3: Formulasi Campuran (Solven & Solut) ── */}
          <div className="space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-wider text-[var(--color-text-muted)] border-b border-[var(--color-surface-border)] pb-1">
              3. Komponen Formulasi Campuran
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Volume Solven */}
              <div>
                <label htmlFor="edit-solven" className="block text-xs font-bold uppercase tracking-wider text-[var(--ink)] mb-1">
                  Volume Solven (Pelarut) <span className="text-[var(--color-text-muted)] font-normal">(mL)</span>
                </label>
                <div className="relative">
                  <input
                    id="edit-solven"
                    type="number"
                    step="any"
                    min="0"
                    value={volumeSolven}
                    onChange={(e) => setVolumeSolven(e.target.value)}
                    placeholder="Contoh: 100"
                    className="w-full px-3 py-2 pr-10 border border-[var(--color-surface-border)] bg-[var(--color-surface-white)] text-sm text-[var(--ink)] focus:outline-none focus:border-[var(--aubergine)]"
                  />
                  <span className="absolute right-3 top-2 text-xs text-[var(--color-text-muted)] font-mono pointer-events-none">
                    mL
                  </span>
                </div>
              </div>

              {/* Volume / Massa Solut */}
              <div>
                <label htmlFor="edit-solut" className="block text-xs font-bold uppercase tracking-wider text-[var(--ink)] mb-1">
                  Volume / Massa Solut (Terlarut)
                </label>
                <div className="flex gap-2">
                  <input
                    id="edit-solut"
                    type="number"
                    step="any"
                    min="0"
                    value={volumeSolut}
                    onChange={(e) => setVolumeSolut(e.target.value)}
                    placeholder="Contoh: 15"
                    className="flex-1 px-3 py-2 border border-[var(--color-surface-border)] bg-[var(--color-surface-white)] text-sm text-[var(--ink)] focus:outline-none focus:border-[var(--aubergine)]"
                  />
                  <select
                    value={satuanSolut}
                    onChange={(e) => setSatuanSolut(e.target.value as "gr" | "mL")}
                    aria-label="Satuan solut"
                    className="w-20 px-2 py-2 border border-[var(--color-surface-border)] bg-[var(--color-surface-white)] text-sm text-[var(--ink)] font-mono focus:outline-none focus:border-[var(--aubergine)]"
                  >
                    <option value="mL">mL</option>
                    <option value="gr">gr</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* ── Section 4: Catatan Pengujian ── */}
          <div className="space-y-2">
            <h3 className="text-xs font-mono uppercase tracking-wider text-[var(--color-text-muted)] border-b border-[var(--color-surface-border)] pb-1">
              4. Catatan Eksperimen
            </h3>
            <textarea
              id="edit-catatan"
              rows={2}
              value={catatan}
              onChange={(e) => setCatatan(e.target.value)}
              placeholder="Catatan tambahan karakteristik sampel uji coba..."
              className="w-full px-3 py-2 border border-[var(--color-surface-border)] bg-[var(--color-surface-white)] text-sm text-[var(--ink)] focus:outline-none focus:border-[var(--aubergine)]"
            />
          </div>

          {/* ── Modal Footer Buttons ── */}
          <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-4 border-t border-[var(--color-surface-border)]">
            <button
              type="button"
              disabled={isSaving}
              onClick={onClose}
              className="scanner-secondary w-full sm:w-auto text-xs"
              style={{ minHeight: 40 }}
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="scanner-primary w-full sm:w-auto inline-flex items-center justify-center gap-2 text-xs"
              style={{ minHeight: 40 }}
            >
              <SaveIcon size={16} />
              {isSaving ? "Menyimpan Perubahan…" : "Simpan Perubahan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
