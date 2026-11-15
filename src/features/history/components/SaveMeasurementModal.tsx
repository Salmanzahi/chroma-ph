"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { PhAnalysisResult } from "@/src/features/ph-analysis/types";
import { getPhInterpretation } from "@/src/features/results/utils/ph-interpretation";
import { savePhMeasurement, rgbToHex } from "../services/history-service";
import { ROUTES } from "@/src/lib/constants";
import { SaveIcon, CloseIcon, ArrowRightIcon } from "@/src/components/icons";

interface SaveMeasurementModalProps {
  isOpen: boolean;
  result: PhAnalysisResult;
  onClose: () => void;
  onSaved?: (docId: string) => void;
}

export function SaveMeasurementModal({
  isOpen,
  result,
  onClose,
  onSaved,
}: SaveMeasurementModalProps) {
  const router = useRouter();
  const { estimatedPh, sampledRgb, sampledHsl } = result;
  const initialCategory =
    getPhInterpretation(estimatedPh)?.label ||
    (estimatedPh < 7 ? "Asam lemah" : estimatedPh > 7 ? "Basa lemah" : "Netral");
  const hexColor = rgbToHex(sampledRgb.r, sampledRgb.g, sampledRgb.b);

  const [bahanUji, setBahanUji] = useState("");
  const [kategoriKualitatif, setKategoriKualitatif] = useState<string>(initialCategory);
  const [volumeSolven, setVolumeSolven] = useState<string>("");
  const [volumeSolut, setVolumeSolut] = useState<string>("");
  const [satuanSolut, setSatuanSolut] = useState<"gr" | "mL">("mL");
  const [catatan, setCatatan] = useState("");

  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSaveAndRedirect = async (targetRoute: string) => {
    if (!bahanUji.trim()) {
      setErrorMsg("Nama bahan uji wajib diisi untuk menyimpan data.");
      return;
    }

    setIsSaving(true);
    setErrorMsg(null);

    try {
      const docId = await savePhMeasurement({
        bahanUji: bahanUji.trim(),
        ph: Number(estimatedPh.toFixed(1)),
        rgb: {
          r: Math.round(sampledRgb.r),
          g: Math.round(sampledRgb.g),
          b: Math.round(sampledRgb.b),
        },
        hsl: {
          h: Math.round(sampledHsl.h),
          s: Math.round(sampledHsl.s * 100),
          l: Math.round(sampledHsl.l * 100),
        },
        warna: hexColor,
        kategoriKualitatif: kategoriKualitatif.trim(),
        volumeSolven: volumeSolven !== "" ? parseFloat(volumeSolven) : null,
        volumeSolut: volumeSolut !== "" ? parseFloat(volumeSolut) : null,
        satuanSolut,
        catatan: catatan.trim(),
      });

      onSaved?.(docId);
      router.push(targetRoute);
    } catch (err: unknown) {
      console.error(err);
      setErrorMsg("Gagal menyimpan ke Firestore.");
      setIsSaving(false);
    }
  };

  const handleSkipToResult = () => {
    onClose();
    router.push(ROUTES.result);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div
        className="w-full max-w-xl max-h-[90vh] overflow-y-auto bg-[var(--color-surface-white)] border border-[var(--ink)] p-6 sm:p-8 relative"
        style={{ boxShadow: "12px 12px 0 var(--color-surface-strong)" }}
      >
        <button
          type="button"
          onClick={handleSkipToResult}
          className="absolute top-4 right-4 p-2 text-[var(--color-text-muted)] hover:text-[var(--ink)]"
          aria-label="Tutup dan lihat hasil"
        >
          <CloseIcon size={20} />
        </button>

        <div className="mb-4">
          <span className="editorial-kicker text-xs font-semibold uppercase tracking-wider text-[var(--aubergine)]">
            Deteksi Selesai
          </span>
          <h2 className="text-xl sm:text-2xl font-serif text-[var(--ink)] mt-1">
            Simpan Hasil Deteksi ke Firestore
          </h2>
          <p className="text-sm text-[var(--color-text-secondary)] mt-0.5">
            Hasil deteksi pH dan warna siap disimpan ke direktori koleksi <code>phdetector/</code>.
          </p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 bg-[var(--color-semantic-red-bg)] text-[var(--color-semantic-red)] text-sm border border-[var(--color-semantic-red)]/30">
            {errorMsg}
          </div>
        )}

        {/* Readout Summary */}
        <div className="p-3.5 bg-[var(--color-surface-off-white)] border border-[var(--color-surface-border)] mb-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 border border-black/20"
                style={{ backgroundColor: hexColor }}
              />
              <div>
                <div className="text-xs text-[var(--color-text-muted)] font-mono uppercase">
                  pH Terdeteksi
                </div>
                <div className="text-2xl font-bold font-serif text-[var(--aubergine)]">
                  {estimatedPh.toFixed(1)} <span className="text-xs font-normal text-[var(--color-text-secondary)] font-mono">({initialCategory})</span>
                </div>
              </div>
            </div>

            <div className="text-right text-xs font-mono text-[var(--color-text-secondary)]">
              <div>RGB: {Math.round(sampledRgb.r)}, {Math.round(sampledRgb.g)}, {Math.round(sampledRgb.b)}</div>
              <div>HSL: {Math.round(sampledHsl.h)}°, {Math.round(sampledHsl.s * 100)}%, {Math.round(sampledHsl.l * 100)}%</div>
            </div>
          </div>
        </div>

        {/* Form Fields */}
        <div className="space-y-4">
          <div>
            <label htmlFor="modal-bahan-uji" className="block text-xs font-bold uppercase tracking-wider text-[var(--ink)] mb-1">
              Bahan Uji (Nama Sampel) <span className="text-[var(--color-semantic-red)]">*</span>
            </label>
            <input
              id="modal-bahan-uji"
              type="text"
              required
              autoFocus
              value={bahanUji}
              onChange={(e) => setBahanUji(e.target.value)}
              placeholder="Contoh: Air Lemon, Air Sabun, Air Keran"
              className="w-full px-3 py-2 border border-[var(--color-surface-border)] bg-[var(--color-surface-white)] text-sm text-[var(--ink)] focus:outline-none focus:border-[var(--aubergine)]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="modal-kategori" className="block text-xs font-bold uppercase tracking-wider text-[var(--ink)] mb-1">
                Kategori Kualitatif
              </label>
              <select
                id="modal-kategori"
                value={kategoriKualitatif}
                onChange={(e) => setKategoriKualitatif(e.target.value)}
                className="w-full px-3 py-2 border border-[var(--color-surface-border)] bg-[var(--color-surface-white)] text-sm text-[var(--ink)] focus:outline-none focus:border-[var(--aubergine)]"
              >
                <option value="Asam kuat">Asam kuat</option>
                <option value="Asam lemah">Asam lemah</option>
                <option value="Netral">Netral</option>
                <option value="Basa lemah">Basa lemah</option>
                <option value="Basa kuat">Basa kuat</option>
              </select>
            </div>

            <div>
              <label htmlFor="modal-solven" className="block text-xs font-bold uppercase tracking-wider text-[var(--ink)] mb-1">
                Volume Solven (mL) <span className="text-[var(--color-text-muted)] font-normal">(opsional)</span>
              </label>
              <input
                id="modal-solven"
                type="number"
                step="any"
                min="0"
                value={volumeSolven}
                onChange={(e) => setVolumeSolven(e.target.value)}
                placeholder="mL pelarut"
                className="w-full px-3 py-2 border border-[var(--color-surface-border)] bg-[var(--color-surface-white)] text-sm text-[var(--ink)] focus:outline-none focus:border-[var(--aubergine)]"
              />
            </div>
          </div>

          <div>
            <label htmlFor="modal-solut" className="block text-xs font-bold uppercase tracking-wider text-[var(--ink)] mb-1">
              Volume / Massa Solut <span className="text-[var(--color-text-muted)] font-normal">(opsional)</span>
            </label>
            <div className="flex gap-2">
              <input
                id="modal-solut"
                type="number"
                step="any"
                min="0"
                value={volumeSolut}
                onChange={(e) => setVolumeSolut(e.target.value)}
                placeholder="Nilai bahan terlarut"
                className="flex-1 px-3 py-2 border border-[var(--color-surface-border)] bg-[var(--color-surface-white)] text-sm text-[var(--ink)] focus:outline-none focus:border-[var(--aubergine)]"
              />
              <select
                value={satuanSolut}
                onChange={(e) => setSatuanSolut(e.target.value as "gr" | "mL")}
                aria-label="Satuan solut"
                className="w-24 px-2 py-2 border border-[var(--color-surface-border)] bg-[var(--color-surface-white)] text-sm text-[var(--ink)] font-mono focus:outline-none focus:border-[var(--aubergine)]"
              >
                <option value="mL">mL</option>
                <option value="gr">gr</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="modal-catatan" className="block text-xs font-bold uppercase tracking-wider text-[var(--ink)] mb-1">
              Catatan <span className="text-[var(--color-text-muted)] font-normal">(opsional)</span>
            </label>
            <input
              id="modal-catatan"
              type="text"
              value={catatan}
              onChange={(e) => setCatatan(e.target.value)}
              placeholder="Catatan tambahan uji coba..."
              className="w-full px-3 py-2 border border-[var(--color-surface-border)] bg-[var(--color-surface-white)] text-sm text-[var(--ink)] focus:outline-none focus:border-[var(--aubergine)]"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3 pt-3 border-t border-[var(--color-surface-border)]">
          <button
            type="button"
            disabled={isSaving}
            onClick={() => handleSaveAndRedirect(ROUTES.history)}
            className="scanner-primary flex-1 justify-center"
          >
            <SaveIcon size={18} />
            {isSaving ? "Menyimpan…" : "Simpan & Buka Riwayat"}
          </button>

          <button
            type="button"
            disabled={isSaving}
            onClick={() => handleSaveAndRedirect(ROUTES.result)}
            className="scanner-secondary flex-1 justify-center"
          >
            Simpan &amp; Lihat Hasil
          </button>

          <button
            type="button"
            onClick={handleSkipToResult}
            className="scanner-tertiary justify-center text-xs"
          >
            Lewati Simpan <ArrowRightIcon size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
